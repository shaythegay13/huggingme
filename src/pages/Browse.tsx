import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";

const mockProfiles = [
  { name: "Sarah", age: 28, location: "New York, NY", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop", energyLevel: 8, isVerified: true, isAvailable: true },
  { name: "James", age: 32, location: "Los Angeles, CA", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", energyLevel: 7, isVerified: true, isAvailable: false },
  { name: "Emma", age: 25, location: "Chicago, IL", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop", energyLevel: 9, isVerified: false, isAvailable: true },
  { name: "Michael", age: 30, location: "Miami, FL", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop", energyLevel: 6, isVerified: true, isAvailable: true },
  { name: "Luna", age: 27, location: "Seattle, WA", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop", energyLevel: 10, isVerified: true, isAvailable: true },
  { name: "David", age: 35, location: "Austin, TX", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop", energyLevel: 5, isVerified: false, isAvailable: false },
];

const Browse = () => {
  const [search, setSearch] = useState("");

  const filtered = mockProfiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

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
          className="mb-8 flex gap-3"
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
          <Button variant="outline" size="icon" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile, i) => (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProfileCard {...profile} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No huggers found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
