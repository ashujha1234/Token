import { useState,useEffect,useRef,useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        navigate("/app");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
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
    {/* DYNAMIC COLOR-CHANGING GRADIENT */}
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

    {/* STATIC STARFIELD BACKGROUND */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black" />
      <div className="w-full h-full bg-[url('/stars.png')] bg-repeat bg-center opacity-30" />
    </div>

    {/* MORE SPARKLES */}
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

    {/* CENTRAL BLUE GLOW */}
    <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-[200px] opacity-30 z-0" />

    {/* CONTENT */}
    <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key="email-step"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 text-center"
          >
            <div className="space-y-2">
              <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Welcome Back</h1>
              <p className="text-[1.25rem] text-white/70 font-light">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                  className="bg-white/5 text-white placeholder-white/50 focus:outline-none focus:border-white/30 border-white/10 rounded-full py-3 px-4 w-full"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 text-white placeholder-white/50 focus:outline-none focus:border-white/30 border-white/10 rounded-full py-3 px-4 w-full"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className={`w-full rounded-full font-medium py-3 border transition-all duration-300
                  ${email && password
                  ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                  : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                }`}
                disabled={isLoading || !email || !password}
                whileHover={{ scale: email && password ? 1.02 : 1 }}
                whileTap={{ scale: email && password ? 0.98 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <p className="text-sm text-center text-white/50 pt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="underline hover:text-white/70 transition-colors font-medium">
                Sign up here
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
);

}
export default Login