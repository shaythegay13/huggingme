import { motion } from "framer-motion";
import { CreditCard, Zap, Heart, Handshake, ArrowUpRight, ArrowDownLeft, Clock, Check, X, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import EnergyBar from "@/components/EnergyBar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface OfferWithPartner {
  id: string;
  interaction_type: string;
  credits_offered: number;
  status: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  direction: "sent" | "received";
  partner_name: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits, energy_state")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["my-offers", user?.id],
    queryFn: async () => {
      const userId = user!.id;

      // Fetch sent and received offers separately to join with profiles
      const [sentRes, receivedRes] = await Promise.all([
        supabase
          .from("offers")
          .select("id, interaction_type, credits_offered, status, created_at, sender_id, receiver_id")
          .eq("sender_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("offers")
          .select("id, interaction_type, credits_offered, status, created_at, sender_id, receiver_id")
          .eq("receiver_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      if (sentRes.error) throw sentRes.error;
      if (receivedRes.error) throw receivedRes.error;

      // Collect all partner user_ids to fetch names
      const partnerIds = new Set<string>();
      sentRes.data.forEach((o) => partnerIds.add(o.receiver_id));
      receivedRes.data.forEach((o) => partnerIds.add(o.sender_id));

      const profileMap: Record<string, string> = {};
      if (partnerIds.size > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, first_name")
          .in("user_id", Array.from(partnerIds));
        if (profiles) {
          profiles.forEach((p) => { profileMap[p.user_id] = p.first_name || "Unknown"; });
        }
      }

      const mapped: OfferWithPartner[] = [
        ...sentRes.data.map((o) => ({
          ...o,
          direction: "sent" as const,
          partner_name: profileMap[o.receiver_id] || "Unknown",
        })),
        ...receivedRes.data.map((o) => ({
          ...o,
          direction: "received" as const,
          partner_name: profileMap[o.sender_id] || "Unknown",
        })),
      ];

      mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return mapped;
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: string }) => {
      const { error } = await supabase
        .from("offers")
        .update({ status })
        .eq("id", offerId);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["my-offers"] });
      toast({ title: `Offer ${status}`, description: `The offer has been ${status}.` });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pt-24">
          <div className="glass-card p-8 text-center max-w-sm">
            <h2 className="text-xl font-bold text-foreground mb-2">Sign in Required</h2>
            <p className="text-sm text-muted-foreground mb-4">Log in to view your dashboard and track credits.</p>
            <Link to="/login">
              <Button className="gradient-primary shine-effect border-0 text-primary-foreground">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const credits = profile?.credits ?? 0;
  const energyLevel = profile?.energy_state ?? 5;

  const sentCredits = offers
    .filter((o) => o.direction === "sent" && o.status === "accepted")
    .reduce((sum, o) => sum + o.credits_offered, 0);
  const receivedCredits = offers
    .filter((o) => o.direction === "received" && o.status === "accepted")
    .reduce((sum, o) => sum + o.credits_offered, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Track your credits, energy, and offers.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Credits Balance</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{credits}</p>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" /> {receivedCredits} earned
              </span>
              <span className="flex items-center gap-1">
                <ArrowDownLeft className="h-3 w-3 text-red-400" /> {sentCredits} spent
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Energy Level</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{energyLevel}/10</p>
            <EnergyBar level={energyLevel} size="sm" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Interactions</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{offers.length}</p>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span>{offers.filter((o) => o.interaction_type === "hug").length} hugs</span>
              <span>{offers.filter((o) => o.interaction_type === "handshake").length} handshakes</span>
            </div>
          </motion.div>
        </div>

        {/* Offers History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="mb-4 text-xl font-bold text-foreground">Recent Offers</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : offers.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">No offers yet. Browse profiles to send your first!</p>
              <Link to="/browse">
                <Button className="mt-4 gradient-primary shine-effect border-0 text-primary-foreground">Browse Profiles</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="glass-card flex items-center gap-4 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                    {offer.interaction_type === "hug" ? (
                      <Heart className="h-5 w-5 text-primary" />
                    ) : (
                      <Handshake className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      {offer.direction === "sent" ? "Sent to" : "Received from"}{" "}
                      <span className="gradient-text">{offer.partner_name}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="capitalize">{offer.interaction_type}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(offer.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      {offer.direction === "sent" ? "-" : "+"}{offer.credits_offered} cr
                    </span>

                    {/* Accept/Reject for received pending offers */}
                    {offer.direction === "received" && offer.status === "pending" ? (
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                          onClick={() => updateStatus.mutate({ offerId: offer.id, status: "accepted" })}
                          disabled={updateStatus.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-100 hover:text-red-600"
                          onClick={() => updateStatus.mutate({ offerId: offer.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[offer.status]}`}>
                        {offer.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
