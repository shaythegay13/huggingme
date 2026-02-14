import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Dr. Hug, a friendly matchmaker assistant for a social platform where people connect through hugs and handshakes. 
You help users find people to meet based on their preferences.

When a user asks to find people, use the search_profiles tool to query the database. You can filter by:
- availability (available_today)
- minimum energy level
- location
- verified status
- gender

After getting results, present them in a friendly, conversational way. Mention their name, energy level, bio, location, and whether they're available today. 
If no results match, suggest broadening the filters.
Keep responses concise and warm. Use emoji sparingly.`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_profiles",
      description:
        "Search for public profiles to recommend people to meet. Returns matching profiles based on filters.",
      parameters: {
        type: "object",
        properties: {
          available_today: { type: "boolean", description: "Filter to only people available today" },
          min_energy: { type: "integer", description: "Minimum energy level (1-10)" },
          max_energy: { type: "integer", description: "Maximum energy level (1-10)" },
          location: { type: "string", description: "Location to filter by (partial match)" },
          verified_only: { type: "boolean", description: "Only show verified profiles" },
          gender: { type: "string", description: "Filter by gender" },
          limit: { type: "integer", description: "Max number of results (default 5)" },
        },
        additionalProperties: false,
      },
    },
  },
];

async function searchProfiles(params: Record<string, unknown>, userId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("profiles")
    .select("first_name, energy_state, bio, location, available_today, is_verified, gender, languages, height, user_id")
    .eq("is_public", true)
    .neq("user_id", userId);

  if (params.available_today === true) query = query.eq("available_today", true);
  if (params.min_energy) query = query.gte("energy_state", params.min_energy);
  if (params.max_energy) query = query.lte("energy_state", params.max_energy);
  if (params.location) query = query.ilike("location", `%${params.location}%`);
  if (params.verified_only === true) query = query.eq("is_verified", true);
  if (params.gender) query = query.eq("gender", params.gender);

  const limit = (params.limit as number) || 5;
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { profiles: data, count: data?.length || 0 };
}

// Parse a full SSE response body into assembled message chunks
function parseSSEToMessage(text: string) {
  const lines = text.split("\n");
  let content = "";
  let toolCalls: any[] = [];

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const jsonStr = line.slice(6).trim();
    if (jsonStr === "[DONE]") continue;
    try {
      const parsed = JSON.parse(jsonStr);
      const delta = parsed.choices?.[0]?.delta;
      if (!delta) continue;
      if (delta.content) content += delta.content;
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0;
          if (!toolCalls[idx]) {
            toolCalls[idx] = { id: tc.id, type: tc.type, function: { name: "", arguments: "" } };
          }
          if (tc.id) toolCalls[idx].id = tc.id;
          if (tc.function?.name) toolCalls[idx].function.name = tc.function.name;
          if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
        }
      }
    } catch { /* skip */ }
  }

  return { content, toolCalls: toolCalls.filter(Boolean) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Extract user id from auth header
    const authHeader = req.headers.get("authorization") || "";
    let userId = "anonymous";
    if (authHeader.startsWith("Bearer ")) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch { /* continue as anonymous */ }
    }

    const aiMessages: any[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    const callAI = async (msgs: any[], useTools: boolean, stream: boolean) => {
      const body: any = { model: "google/gemini-3-flash-preview", messages: msgs, stream };
      if (useTools) body.tools = tools;
      return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    };

    // First call with tools enabled - buffer full response to check for tool calls
    const firstResponse = await callAI(aiMessages, true, true);

    if (!firstResponse.ok) {
      const status = firstResponse.status;
      const errMsg = status === 429 ? "Rate limited, please try again shortly."
        : status === 402 ? "AI credits exhausted. Please add funds."
        : "AI gateway error";
      return new Response(JSON.stringify({ error: errMsg }), {
        status: status >= 400 && status < 500 ? status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buffer the first response to check for tool calls
    const firstBody = await firstResponse.text();
    const parsed = parseSSEToMessage(firstBody);

    // If no tool calls, just forward the buffered SSE as-is
    if (parsed.toolCalls.length === 0) {
      return new Response(firstBody, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Process tool calls
    const assistantMsg: any = { role: "assistant", content: parsed.content || null, tool_calls: parsed.toolCalls };
    aiMessages.push(assistantMsg);

    for (const tc of parsed.toolCalls) {
      if (tc.function.name === "search_profiles") {
        const params = JSON.parse(tc.function.arguments);
        const result = await searchProfiles(params, userId);
        console.log("Search profiles result:", JSON.stringify(result));
        aiMessages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
      }
    }

    // Second call - stream the final response
    const streamResponse = await callAI(aiMessages, false, true);
    if (!streamResponse.ok) {
      const t = await streamResponse.text();
      console.error("Second AI call error:", streamResponse.status, t);
      throw new Error("AI stream error");
    }

    return new Response(streamResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("matchmaker-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
