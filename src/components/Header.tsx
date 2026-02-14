import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Browse" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Hugging<span className="gradient-text">.me</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-muted-foreground">
                <LogOut className="mr-1.5 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="gradient-primary shine-effect border-0 text-primary-foreground">
                Log in or Sign up
              </Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass border-t border-border md:hidden"
        >
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button variant="outline" onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-muted-foreground">
                <LogOut className="mr-1.5 h-4 w-4" /> Sign out
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button className="gradient-primary shine-effect w-full border-0 text-primary-foreground">
                  Log in or Sign up
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
