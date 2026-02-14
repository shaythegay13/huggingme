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
          available_today: {
            type: "boolean",
            description: "Filter to only people available today",
          },
          min_energy: {
            type: "integer",
            description: "Minimum energy level (1-10)",
          },
          max_energy: {
            type: "integer",
            description: "Maximum energy level (1-10)",
          },
          location: {
            type: "string",
            description: "Location to filter by (partial match)",
          },
          verified_only: {
            type: "boolean",
            description: "Only show verified profiles",
          },
          gender: {
            type: "string",
            description: "Filter by gender",
          },
          limit: {
            type: "integer",
            description: "Max number of results (default 5)",
          },
        },
        additionalProperties: false,
      },
    },
  },
];

async function searchProfiles(
  params: Record<string, unknown>,
  userId: string
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("profiles")
    .select(
      "first_name, energy_state, bio, location, available_today, is_verified, gender, languages, height, user_id"
    )
    .eq("is_public", true)
    .neq("user_id", userId);

  if (params.available_today === true) query = query.eq("available_today", true);
  if (params.min_energy) query = query.gte("energy_state", params.min_energy);
  if (params.max_energy) query = query.lte("energy_state", params.max_energy);
  if (params.location)
    query = query.ilike("location", `%${params.location}%`);
  if (params.verified_only === true) query = query.eq("is_verified", true);
  if (params.gender) query = query.eq("gender", params.gender);

  const limit = (params.limit as number) || 5;
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { profiles: data, count: data?.length || 0 };
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

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
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch {}
    }

    // First AI call - may request tool use
    let aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    let response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: aiMessages,
          tools,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI error:", status, t);
      throw new Error("AI gateway error");
    }

    let data = await response.json();
    let assistantMsg = data.choices?.[0]?.message;

    // Handle tool calls (one round)
    if (assistantMsg?.tool_calls?.length) {
      aiMessages.push(assistantMsg);

      for (const tc of assistantMsg.tool_calls) {
        if (tc.function.name === "search_profiles") {
          const params = JSON.parse(tc.function.arguments);
          const result = await searchProfiles(params, userId);
          aiMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
      }

      // Second AI call with tool results - stream this one
      const streamResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: aiMessages,
            stream: true,
          }),
        }
      );

      if (!streamResponse.ok) throw new Error("AI stream error");

      return new Response(streamResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tool call - stream directly (re-do as stream)
    const streamResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: aiMessages,
          stream: true,
        }),
      }
    );

    return new Response(streamResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("matchmaker-chat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
