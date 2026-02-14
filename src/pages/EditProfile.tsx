import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import EnergyBar from "@/components/EnergyBar";

const EditProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    first_name: "",
    bio: "",
    gender: "",
    legal_age: "",
    height: "",
    skin_type: "",
    location: "",
    languages: "",
    energy_state: 5,
    available_today: false,
    is_public: true,
  });
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile-edit", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        legal_age: profile.legal_age?.toString() || "",
        height: profile.height || "",
        skin_type: profile.skin_type || "",
        location: profile.location || "",
        languages: profile.languages?.join(", ") || "",
        energy_state: profile.energy_state || 5,
        available_today: profile.available_today || false,
        is_public: profile.is_public ?? true,
      });
      setExistingPhotos(profile.photos || []);
    }
  }, [profile]);

  const updateForm = (key: string, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    const totalSlots = 4 - existingPhotos.length + removedPhotos.length;
    const allowed = valid.slice(0, totalSlots - newFiles.length);
    setNewFiles((prev) => [...prev, ...allowed]);
    setNewPreviews((prev) => [...prev, ...allowed.map((f) => URL.createObjectURL(f))]);
  };

  const removeExisting = (url: string) => {
    setRemovedPhotos((prev) => [...prev, url]);
    setExistingPhotos((prev) => prev.filter((p) => p !== url));
  };

  const removeNew = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");

      // Upload new photos
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("profile-photos").upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
          uploadedUrls.push(data.publicUrl);
        }
      }

      const finalPhotos = [...existingPhotos, ...uploadedUrls];
      const langs = form.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.first_name,
          bio: form.bio || null,
          gender: form.gender || null,
          legal_age: form.legal_age ? parseInt(form.legal_age) : null,
          height: form.height || null,
          skin_type: form.skin_type || null,
          location: form.location || null,
          languages: langs.length > 0 ? langs : null,
          energy_state: form.energy_state,
          available_today: form.available_today,
          is_public: form.is_public,
          photos: finalPhotos.length > 0 ? finalPhotos : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile-edit"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      setNewFiles([]);
      setNewPreviews([]);
      setRemovedPhotos([]);
      toast({ title: "Profile saved!", description: "Your changes have been saved." });
    },
    onError: (err: Error) => {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-screen items-center justify-center pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const totalPhotos = existingPhotos.length + newFiles.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Edit <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground">Update your profile information visible to others.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Photos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Photos</h2>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {existingPhotos.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                  <img src={url} alt="Profile" className="h-full w-full object-cover" />
                  <button onClick={() => removeExisting(url)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                  <img src={src} alt="New" className="h-full w-full object-cover" />
                  <button onClick={() => removeNew(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {totalPhotos < 4 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/40"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{totalPhotos}/4 photos · Max 5MB each</p>
          </motion.div>

          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={form.first_name} onChange={(e) => updateForm("first_name", e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={form.bio} onChange={(e) => updateForm("bio", e.target.value)} placeholder="Tell people about yourself..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="legal_age">Age</Label>
                  <Input id="legal_age" type="number" value={form.legal_age} onChange={(e) => updateForm("legal_age", e.target.value)} placeholder="18+" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" value={form.height} onChange={(e) => updateForm("height", e.target.value)} placeholder="e.g. 5'8&quot;" />
                </div>
                <div>
                  <Label>Skin Type</Label>
                  <Select value={form.skin_type} onValueChange={(v) => updateForm("skin_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="olive">Olive</SelectItem>
                      <SelectItem value="tan">Tan</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="e.g. New York, NY" />
              </div>
              <div>
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input id="languages" value={form.languages} onChange={(e) => updateForm("languages", e.target.value)} placeholder="e.g. English, Spanish" />
              </div>
            </div>
          </motion.div>

          {/* Energy & Availability */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Energy & Availability</h2>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Energy Level</Label>
                  <span className="text-sm font-semibold text-foreground">{form.energy_state}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.energy_state}
                  onChange={(e) => updateForm("energy_state", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <EnergyBar level={form.energy_state} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Available Today</p>
                  <p className="text-xs text-muted-foreground">Show others you're open to connecting</p>
                </div>
                <Switch checked={form.available_today} onCheckedChange={(v) => updateForm("available_today", v)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Public Profile</p>
                  <p className="text-xs text-muted-foreground">Let others find you when browsing</p>
                </div>
                <Switch checked={form.is_public} onCheckedChange={(v) => updateForm("is_public", v)} />
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="w-full gradient-primary shine-effect border-0 text-primary-foreground"
            >
              {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
