import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import hero1 from "@/assets/hero-1.jpeg";
import hero2 from "@/assets/hero-2.jpeg";

const features = [
  {
    icon: Heart,
    title: "Share Positive Energy",
    description: "Connect with people who radiate warmth and positivity in your area.",
  },
  {
    icon: Users,
    title: "Verified Profiles",
    description: "Every hugger is verified for your safety and peace of mind.",
  },
  {
    icon: Zap,
    title: "Energy Matching",
    description: "Our algorithm matches you based on energy compatibility.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Built-in safety features and community guidelines protect everyone.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-hero">
        {/* Decorative circles */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground"
              >
                <Heart className="h-3.5 w-3.5" />
                Spread positivity today
              </motion.div>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Share Your{" "}
                <span className="gradient-text">Positive Energy</span>{" "}
                With The World
              </h1>

              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                Connect with warm, verified people near you. Exchange energy,
                book hugging sessions, and brighten someone's day.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/browse">
                  <Button
                    size="lg"
                    className="gradient-primary shine-effect border-0 px-8 text-lg text-primary-foreground"
                  >
                    Browse Huggers
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 px-8 text-lg text-foreground hover:bg-accent"
                  >
                    Join Free
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Verified users
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Energy matching
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative grid grid-cols-2 gap-4">
                <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
                <img
                  src={hero1}
                  alt="Two people sharing a friendly handshake"
                  className="relative rounded-3xl shadow-elevated object-cover aspect-[3/4] w-full"
                />
                <img
                  src={hero2}
                  alt="Two friends sharing positive energy"
                  className="relative rounded-3xl shadow-elevated object-cover aspect-[3/4] w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why <span className="gradient-text">Hugging.me</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We're building a kinder world, one hug at a time. Here's what
              makes us special.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center transition-all hover:shadow-elevated"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary overflow-hidden rounded-3xl p-12 text-center shadow-elevated"
          >
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Share Your Energy?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
              Join thousands of people spreading positivity. Sign up today and
              get 10 free credits to start.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-card text-foreground hover:bg-card/90 border-0 px-10 text-lg font-semibold"
              >
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>© 2026 Hugging.me. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">Privacy</a>
            <a href="#" className="transition-colors hover:text-primary">Terms</a>
            <a href="#" className="transition-colors hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
