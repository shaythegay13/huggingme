import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Shield, Zap, Heart, Globe, Ruler, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import EnergyBar from "@/components/EnergyBar";
import { mockProfiles } from "@/data/mockProfiles";
import { useState } from "react";
import SendOfferModal from "@/components/SendOfferModal";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerOpen, setOfferOpen] = useState(false);
  const profile = mockProfiles.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Profile not found</h2>
            <Link to="/browse" className="mt-4 inline-block text-primary hover:underline">
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Photos */}
            <div className="lg:col-span-2">
              <div className="grid gap-3 grid-cols-2">
                {profile.photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={i === 0 ? "col-span-2" : ""}
                  >
                    <img
                      src={photo}
                      alt={`${profile.name} photo ${i + 1}`}
                      className="w-full rounded-2xl object-cover shadow-card"
                      style={{ maxHeight: i === 0 ? "500px" : "280px" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.name}, {profile.age}
                    </h1>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {profile.isVerified && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    {profile.isAvailable && (
                      <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        Available
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Energy Level</span>
                  </div>
                  <EnergyBar level={profile.energyLevel} />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 space-y-3"
              >
                <h3 className="font-semibold text-foreground">Details</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-primary/60" />
                    <span>{profile.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler className="h-4 w-4 text-primary/60" />
                    <span>{profile.height}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary/60" />
                    <span>{profile.languages.join(", ")}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => setOfferOpen(true)}
                  className="w-full gradient-primary shine-effect border-0 text-lg py-6 text-primary-foreground"
                >
                  <Heart className="mr-2 h-5 w-5" /> Send Hug Offer
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <SendOfferModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        profileName={profile.name}
        profileEnergy={profile.energyLevel}
      />
    </div>
  );
};

export default Profile;
