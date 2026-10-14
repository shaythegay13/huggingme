import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Shield, Zap, Heart, Handshake, Globe, Ruler, User, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import EnergyBar from "@/components/EnergyBar";
import { mockProfiles, type MockProfile } from "@/data/mockProfiles";
import { useState } from "react";
import SendOfferModal from "@/components/SendOfferModal";
import { supabase } from "@/integrations/supabase/client";

type ProfileView = {
  name: string;
  age?: number;
  gender: string;
  height: string;
  location: string;
  bio: string;
  photos: string[];
  energyLevel: number;
  isVerified: boolean;
  isAvailable: boolean;
  languages: string[];
};

const fromMock = (profile: MockProfile): ProfileView => ({
  name: profile.name,
  age: profile.age,
  gender: profile.gender,
  height: profile.height,
  location: profile.location,
  bio: profile.bio,
  photos: profile.photos,
  energyLevel: profile.energyLevel,
  isVerified: profile.isVerified,
  isAvailable: profile.isAvailable,
  languages: profile.languages,
});

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerType, setOfferType] = useState<"hug" | "handshake">("hug");
  const mockProfile = mockProfiles.find((p) => p.id === id);

  const { data: dbProfile, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    enabled: !!id && !mockProfile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, legal_age, gender, height, location, bio, photos, energy_state, is_verified, available_today, languages")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const profile: ProfileView | null = mockProfile
    ? fromMock(mockProfile)
    : dbProfile
      ? {
          name: dbProfile.first_name || "Hugger",
          age: dbProfile.legal_age ?? undefined,
          gender: dbProfile.gender || "Not listed",
          height: dbProfile.height || "Not listed",
          location: dbProfile.location || "Unknown",
          bio: dbProfile.bio || "",
          photos: dbProfile.photos?.length ? dbProfile.photos : ["/placeholder.svg"],
          energyLevel: dbProfile.energy_state,
          isVerified: dbProfile.is_verified,
          isAvailable: dbProfile.available_today,
          languages: dbProfile.languages?.length ? dbProfile.languages : ["Not listed"],
        }
      : null;

  if (!mockProfile && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {isError ? "Could not load this profile" : "Profile not found"}
            </h2>
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
                      {profile.age ? `${profile.name}, ${profile.age}` : profile.name}
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
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => { setOfferType("hug"); setOfferOpen(true); }}
                    className="gradient-primary shine-effect border-0 py-6 text-primary-foreground"
                  >
                    <Heart className="mr-2 h-5 w-5" /> Hug
                  </Button>
                  <Button
                    onClick={() => { setOfferType("handshake"); setOfferOpen(true); }}
                    variant="outline"
                    className="border-primary/20 py-6 text-foreground hover:bg-accent"
                  >
                    <Handshake className="mr-2 h-5 w-5" /> Handshake
                  </Button>
                </div>
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
        interactionType={offerType}
      />
    </div>
  );
};

export default Profile;
