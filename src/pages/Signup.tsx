


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(name, email, password);
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to TOKUN. You're now signed in.",
        });
        navigate("/app");
      } else {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative overflow-hidden">
      {/* DYNAMIC BACKGROUND GRADIENT */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(0,0,0,1) 0%, transparent 100%), #000011",
            "radial-gradient(circle at center, rgba(0,0,0,1) 0%, transparent 100%), #001133",
            "radial-gradient(circle at center, rgba(0,0,0,1) 0%, transparent 100%), #110022",
            "radial-gradient(circle at center, rgba(0,0,0,1) 0%, transparent 100%), #000011",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* STARFIELD BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="w-full h-full bg-[url('/stars.png')] bg-repeat bg-center opacity-30" />
      </div>

      {/* SPARKLES */}
      <AnimatePresence>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-white rounded-full z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* BLUE GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-[200px] opacity-30 z-0" />

      {/* SIGNUP FORM */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm text-white space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Create Account</h1>
            <p className="text-[1.25rem] text-white/70 font-light">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white/80">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 text-white placeholder-white/50 border-white/10 rounded-full py-3 px-4 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 text-white placeholder-white/50 border-white/10 rounded-full py-3 px-4 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 text-white placeholder-white/50 border-white/10 rounded-full py-3 px-4 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 text-white placeholder-white/50 border-white/10 rounded-full py-3 px-4 w-full"
                required
              />
            </div>

            <motion.button
              type="submit"
              className={`w-full rounded-full font-medium py-3 border transition-all duration-300
                ${name && email && password && confirmPassword
                  ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                  : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                }`}
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              whileHover={{ scale: name && email && password && confirmPassword ? 1.02 : 1 }}
              whileTap={{ scale: name && email && password && confirmPassword ? 0.98 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-sm text-center text-white/50 pt-6">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-white/70 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;