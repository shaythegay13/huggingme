import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, CreditCard, Clock, MessageSquare, Send, Heart, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SendOfferModalProps {
  open: boolean;
  onClose: () => void;
  profileName: string;
  profileEnergy: number;
  interactionType: "hug" | "handshake";
}

const SendOfferModal = ({ open, onClose, profileName, profileEnergy, interactionType }: SendOfferModalProps) => {
  const [yourEnergy, setYourEnergy] = useState(5);
  const [credits, setCredits] = useState(1);
  const [message, setMessage] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const energyDiff = Math.abs(yourEnergy - profileEnergy);
  const isHug = interactionType === "hug";
  const Icon = isHug ? Heart : Handshake;
  const label = isHug ? "Hug" : "Handshake";

  const handleSend = () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to send offers.", variant: "destructive" });
      return;
    }
    toast({
      title: `${label} Offer Sent! ${isHug ? "🤗" : "🤝"}`,
      description: `Your ${label.toLowerCase()} offer has been sent to ${profileName}. They'll be notified shortly.`,
    });
    onClose();
    setMessage("");
    setCredits(1);
    setYourEnergy(5);
    setTimeSlot("");
    setLocation("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" /> Send {label} Offer
              </h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Send a {label.toLowerCase()} offer to <strong className="text-foreground">{profileName}</strong>
            </p>

            <div className="space-y-5">
              {/* Energy Level */}
              <div>
                <Label className="flex items-center gap-1.5 mb-2">
                  <Zap className="h-4 w-4 text-primary" /> Your Energy Level
                </Label>
                <Slider
                  value={[yourEnergy]}
                  onValueChange={(v) => setYourEnergy(v[0])}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Your energy: {yourEnergy}/10</span>
                  <span>Differential: {energyDiff}</span>
                </div>
              </div>

              {/* Credits */}
              <div>
                <Label htmlFor="credits" className="flex items-center gap-1.5 mb-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Credits to Offer
                </Label>
                <Input
                  id="credits"
                  type="number"
                  min={1}
                  max={100}
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Time Slot */}
              <div>
                <Label className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-4 w-4 text-primary" /> Preferred Time
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                    <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-2 block">Meeting Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central Park, coffee shop..."
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Message (optional)
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say something nice..."
                  rows={3}
                />
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-accent/50 p-4 text-sm space-y-1">
                <p className="font-medium text-foreground">Offer Summary</p>
                <p className="text-muted-foreground">Type: <strong className="text-foreground">{label}</strong></p>
                <p className="text-muted-foreground">Energy differential: <strong className="text-foreground">{energyDiff}</strong></p>
                <p className="text-muted-foreground">Credits: <strong className="text-foreground">{credits}</strong></p>
                {timeSlot && <p className="text-muted-foreground">Time: <strong className="text-foreground capitalize">{timeSlot}</strong></p>}
                {location && <p className="text-muted-foreground">Location: <strong className="text-foreground">{location}</strong></p>}
              </div>

              <Button
                onClick={handleSend}
                className="w-full gradient-primary shine-effect border-0 text-primary-foreground"
              >
                <Send className="mr-2 h-4 w-4" /> Send {label} Offer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendOfferModal;
