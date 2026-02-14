import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";

const TOTAL_STEPS = 6;

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    gender: "",
    age: "",
    height: "",
    skinType: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const updateForm = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const slideVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <Header />

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Step {step} of {TOTAL_STEPS}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full gradient-primary rounded-full"
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="glass-card p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Personal Details</h2>
                      <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} placeholder="Your first name" />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" value={form.age} onChange={(e) => updateForm("age", e.target.value)} placeholder="18+" />
                        </div>
                        <div>
                          <Label htmlFor="height">Height</Label>
                          <Input id="height" value={form.height} onChange={(e) => updateForm("height", e.target.value)} placeholder="e.g. 5'8&quot;" />
                        </div>
                      </div>
                      <div>
                        <Label>Skin Type</Label>
                        <Select value={form.skinType} onValueChange={(v) => updateForm("skinType", v)}>
                          <SelectTrigger><SelectValue placeholder="Select skin type" /></SelectTrigger>
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Account Setup</h2>
                      <p className="text-sm text-muted-foreground">Create your login credentials</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="you@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="Create a strong password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} placeholder="Re-enter password" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Upload Photo</h2>
                      <p className="text-sm text-muted-foreground">Add a clear, friendly photo of yourself</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                        <Upload className="h-7 w-7 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop or click to upload
                      </p>
                      <Button variant="outline" size="sm">Choose File</Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Preview Profile</h2>
                      <p className="text-sm text-muted-foreground">Here's how your profile will look</p>
                    </div>
                    <div className="rounded-2xl bg-accent/50 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                          <Eye className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{form.firstName || "Your Name"}</p>
                          <p className="text-sm text-muted-foreground">{form.age ? `${form.age} years old` : "Age"} · {form.gender || "Gender"}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Height: {form.height || "—"}</p>
                        <p>Skin Type: {form.skinType || "—"}</p>
                        <p>Email: {form.email || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Legal Agreement</h2>
                      <p className="text-sm text-muted-foreground">Please review and accept our terms</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-xl bg-secondary/50 p-4 text-xs text-muted-foreground">
                      <p className="mb-2 font-semibold text-foreground">Terms of Service</p>
                      <p>By creating an account on Hugging.me, you agree to our community guidelines, privacy policy, and terms of service. You confirm that you are at least 18 years old and will use the platform responsibly. All interactions must be consensual and respectful. We reserve the right to remove accounts that violate our guidelines.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={form.agreedToTerms}
                        onCheckedChange={(v) => updateForm("agreedToTerms", !!v)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-snug text-muted-foreground">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-5 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Welcome, {form.firstName || "Friend"}!</h2>
                      <p className="text-sm text-muted-foreground">Your account has been created. Start browsing huggers near you.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {step > 1 && step < 6 ? (
                <Button variant="ghost" onClick={prev} className="text-muted-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}
              {step < 6 ? (
                <Button
                  onClick={next}
                  className="gradient-primary shine-effect ml-auto border-0 text-primary-foreground"
                  disabled={step === 5 && !form.agreedToTerms}
                >
                  {step === 5 ? "Complete" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gradient-primary shine-effect mx-auto border-0 text-primary-foreground"
                  onClick={() => window.location.href = "/browse"}
                >
                  Start Browsing
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
