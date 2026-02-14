import { motion } from "framer-motion";
import { CreditCard, Zap, Heart, Handshake, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import Header from "@/components/Header";
import EnergyBar from "@/components/EnergyBar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockOffers = [
  { id: "1", type: "hug" as const, partner: "Sarah", credits: 3, status: "accepted", direction: "sent" as const, date: "2026-02-13" },
  { id: "2", type: "handshake" as const, partner: "James", credits: 2, status: "pending", direction: "received" as const, date: "2026-02-14" },
  { id: "3", type: "hug" as const, partner: "Luna", credits: 5, status: "accepted", direction: "received" as const, date: "2026-02-12" },
  { id: "4", type: "handshake" as const, partner: "Michael", credits: 1, status: "rejected", direction: "sent" as const, date: "2026-02-11" },
  { id: "5", type: "hug" as const, partner: "Emma", credits: 4, status: "pending", direction: "sent" as const, date: "2026-02-14" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const { user } = useAuth();
  const credits = 10;
  const energyLevel = 7;

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

  const sentCredits = mockOffers
    .filter((o) => o.direction === "sent" && o.status === "accepted")
    .reduce((sum, o) => sum + o.credits, 0);
  const receivedCredits = mockOffers
    .filter((o) => o.direction === "received" && o.status === "accepted")
    .reduce((sum, o) => sum + o.credits, 0);

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
            <p className="text-3xl font-bold text-foreground">{mockOffers.length}</p>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span>{mockOffers.filter((o) => o.type === "hug").length} hugs</span>
              <span>{mockOffers.filter((o) => o.type === "handshake").length} handshakes</span>
            </div>
          </motion.div>
        </div>

        {/* Offers History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="mb-4 text-xl font-bold text-foreground">Recent Offers</h2>
          <div className="space-y-3">
            {mockOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="glass-card flex items-center gap-4 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  {offer.type === "hug" ? (
                    <Heart className="h-5 w-5 text-primary" />
                  ) : (
                    <Handshake className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {offer.direction === "sent" ? "Sent to" : "Received from"}{" "}
                    <span className="gradient-text">{offer.partner}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{offer.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {offer.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-foreground">
                    {offer.direction === "sent" ? "-" : "+"}{offer.credits} cr
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[offer.status]}`}>
                    {offer.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
