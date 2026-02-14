import { motion } from "framer-motion";
import { MapPin, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EnergyBar from "./EnergyBar";

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  energyLevel: number;
  isVerified: boolean;
  isAvailable: boolean;
  onSendOffer: () => void;
}

const ProfileCard = ({
  id,
  name,
  age,
  location,
  photo,
  energyLevel,
  isVerified,
  isAvailable,
  onSendOffer,
}: ProfileCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass-card group overflow-hidden"
    >
      <Link to={`/profile/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
          <img
            src={photo}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-darker/80 via-transparent to-transparent" />

          {isAvailable && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary-foreground" />
              Available
            </div>
          )}

          {isVerified && (
            <div className="absolute right-3 top-3 rounded-full bg-primary/90 p-1.5 backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-primary-foreground">
              {name}, {age}
            </h3>
            <div className="flex items-center gap-1 text-primary-foreground/80">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs">{location}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Energy Level</span>
        </div>
        <EnergyBar level={energyLevel} size="sm" />

        <Button
          onClick={(e) => { e.preventDefault(); onSendOffer(); }}
          className="gradient-primary shine-effect mt-4 w-full border-0 text-primary-foreground"
        >
          Send Hug Offer
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
