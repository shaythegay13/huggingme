import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import SendOfferModal from "@/components/SendOfferModal";
import { mockProfiles } from "@/data/mockProfiles";

const Browse = () => {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [minEnergy, setMinEnergy] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "energy">("name");

  const [offerTarget, setOfferTarget] = useState<{ name: string; energy: number; type: "hug" | "handshake" } | null>(null);

  const filtered = mockProfiles
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchesAvailable = !showAvailable || p.isAvailable;
      const matchesVerified = !showVerified || p.isVerified;
      const matchesEnergy = p.energyLevel >= minEnergy;
      return matchesSearch && matchesAvailable && matchesVerified && matchesEnergy;
    })
    .sort((a, b) => {
      if (sortBy === "energy") return b.energyLevel - a.energyLevel;
      return a.name.localeCompare(b.name);
    });

  const activeFilterCount = [showAvailable, showVerified, minEnergy > 1].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Browse <span className="gradient-text">Huggers</span>
          </h1>
          <p className="text-muted-foreground">
            Find someone to share positive energy with today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="glass-card p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  <button onClick={() => setFiltersOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="available"
                      checked={showAvailable}
                      onCheckedChange={(v) => setShowAvailable(!!v)}
                    />
                    <Label htmlFor="available" className="text-sm flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Available now
                    </Label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="verified"
                      checked={showVerified}
                      onCheckedChange={(v) => setShowVerified(!!v)}
                    />
                    <Label htmlFor="verified" className="text-sm flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      Verified only
                    </Label>
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-sm flex items-center gap-1.5 mb-2">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      Min Energy Level: {minEnergy}
                    </Label>
                    <Slider
                      value={[minEnergy]}
                      onValueChange={(v) => setMinEnergy(v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Button
                    variant={sortBy === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("name")}
                    className={sortBy === "name" ? "gradient-primary border-0 text-primary-foreground" : ""}
                  >
                    Name
                  </Button>
                  <Button
                    variant={sortBy === "energy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("energy")}
                    className={sortBy === "energy" ? "gradient-primary border-0 text-primary-foreground" : ""}
                  >
                    Energy Level
                  </Button>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowAvailable(false); setShowVerified(false); setMinEnergy(1); }}
                    className="text-muted-foreground"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mb-4 text-sm text-muted-foreground">{filtered.length} hugger{filtered.length !== 1 ? "s" : ""} found</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProfileCard
                id={profile.id}
                name={profile.name}
                age={profile.age}
                location={profile.location}
                photo={profile.photo}
                energyLevel={profile.energyLevel}
                isVerified={profile.isVerified}
                isAvailable={profile.isAvailable}
                onSendOffer={(type) => setOfferTarget({ name: profile.name, energy: profile.energyLevel, type })}
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No huggers found. Try adjusting your filters.
          </div>
        )}
      </div>

      <SendOfferModal
        open={!!offerTarget}
        onClose={() => setOfferTarget(null)}
        profileName={offerTarget?.name || ""}
        profileEnergy={offerTarget?.energy || 5}
        interactionType={offerTarget?.type || "hug"}
      />
    </div>
  );
};

export default Browse;
