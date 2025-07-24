import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
  Play,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const backgroundImage = useMotionTemplate`
    radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-200"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header with Login Button */}
      <div className="absolute top-0 right-0 p-6 z-20">
        <motion.button
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative px-6 py-3 text-base rounded-xl font-semibold text-white border border-white/20 bg-white/10 backdrop-blur-xl shadow-md"
          style={{
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), 0 8px 24px rgba(255,255,255,0.1)",
          }}
        >
          <div className="absolute inset-0 rounded-xl bg-white opacity-5 blur-[4px] pointer-events-none" />
          Login / Sign Up
        </motion.button>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* HERO SECTION */}
        <div className="text-center space-y-8">
          <div className="transform transition-transform duration-300 ease-out" style={{ transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)` }}>
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="gradient-text relative">
                TOKUN
                <div className="absolute inset-0 gradient-text blur-lg opacity-50 animate-pulse" />
              </span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-tokun">
              Prompt like a Pro. Save tokens. Earn smarter.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Optimize your LLM prompts, generate better outcomes, and monetize your best prompts—all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {/* Try Smartgen - 3D Gradient Button */}
            <motion.button
              onClick={() => navigate("/app")}
              whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative px-8 py-4 text-lg rounded-xl text-white font-semibold bg-gradient-to-br from-[#13FFAA] to-[#1E67C6] shadow-2xl border border-white/10 backdrop-blur-md"
              style={{
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 20px rgba(19,255,170,0.3)",
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-white opacity-10 blur-[6px] pointer-events-none" />
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" /> Try Smartgen
              </div>
            </motion.button>

            {/* Browse Prompt Library - 3D Outline Button */}
            <motion.button
              onClick={() => navigate("/prompt-library")}
              whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative px-8 py-4 text-lg rounded-xl font-semibold text-tokun border border-tokun shadow-lg bg-white/5 backdrop-blur-md"
              style={{
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 6px 16px rgba(30,103,198,0.25)",
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-white opacity-5 blur-[4px] pointer-events-none" />
              Browse Prompt Library
            </motion.button>
          </div>
        </div>

        {/* WHAT WE OFFER */}
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Prompt Optimization",
                description: "Reduce token usage by up to 60% while maintaining meaning and effectiveness across all LLM platforms.",
                color: "from-yellow-500 to-red-500",
              },
              {
                icon: Sparkles,
                title: "Smartgen Generator",
                description: "Transform simple ideas into powerful, optimized prompts with our AI-powered generation system.",
                color: "from-tokun to-blue-500",
              },
              {
                icon: Target,
                title: "Prompt Library",
                description: "Access categorized prompts for Coding, Design, Marketing, Video Creation, and more.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: TrendingUp,
                title: "Prompt Marketplace",
                description: "Built a great prompt? Trade it. Monetize your creativity and earn from your best prompt innovations.",
                color: "from-emerald-500 to-lime-500",
              },
            ].map((feature, index) => (
              <div key={index} className="glass p-8 rounded-2xl border border-white/20">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS - MODERN ELEGANT DESIGN */}
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            How It Works
          </h2>
          
          {/* Interactive Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tokun/50 to-transparent transform -translate-y-1/2 hidden lg:block" />
            
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 mb-20">
              {[
                { 
                  step: "Input Idea", 
                  icon: "💡", 
                  description: "Share your concept or requirement",
                  video: "input-idea-demo"
                },
                { 
                  step: "Smartgen", 
                  icon: "🤖", 
                  description: "AI generates optimized prompts",
                  video: "smartgen-demo"
                },
                { 
                  step: "Optimize", 
                  icon: "⚡", 
                  description: "Reduce tokens, improve quality",
                  video: "optimization-demo"
                },
                { 
                  step: "Save or Sell", 
                  icon: "💾", 
                  description: "Store in library or marketplace",
                  video: "save-sell-demo"
                },
                { 
                  step: "Earn", 
                  icon: "💰", 
                  description: "Monetize your best prompts",
                  video: "earn-demo"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="group flex flex-col items-center text-center cursor-pointer relative"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedVideo(item.video)}
                >
                  {/* Step Circle */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-tokun/20 to-tokun/40 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl border border-tokun/30 backdrop-blur-xl group-hover:border-tokun group-hover:shadow-tokun/40 transition-all duration-300">
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-tokun rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-tokun transition-colors duration-300">
                    {item.step}
                  </h3>
                  <p className="text-white/70 text-sm max-w-32 group-hover:text-white/90 transition-colors duration-300">
                    {item.description}
                  </p>
                  
                  {/* Play Indicator */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-tokun/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Video Player Section */}
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-center mb-6 text-white">
              {selectedVideo ? "Product Demo" : "Click on any step above to see it in action"}
            </h3>
            
            <div className="relative aspect-video bg-black/40 rounded-2xl overflow-hidden border border-white/20">
              {selectedVideo ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-20 w-20 text-tokun mb-4 mx-auto" />
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {selectedVideo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Video
                    </h4>
                    <p className="text-white/70">
                      Video demonstration of {selectedVideo.replace('-demo', '').replace('-', ' ')} feature
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/50">
                    <div className="w-32 h-32 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Play className="h-12 w-12" />
                    </div>
                    <p className="text-lg">Select a step to watch the demo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS CAROUSEL - LARGER */}
        <div className="mt-32 overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
            What Our Users Say
          </h2>

          <motion.div
            className="flex gap-8 w-max"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: "linear",
            }}
          >
            {Array.from({ length: 20 }).map((_, index) => {
              const testimonials = [
                {
                  name: "Sarah Chen",
                  role: "AI Developer",
                  content: "TOKUN reduced my prompt costs by 70% while improving response quality. It's absolutely revolutionary for anyone working with LLMs on a daily basis.",
                  rating: 5,
                  avatar: "https://via.placeholder.com/60x60/13FFAA/white?text=SC",
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Content Creator",
                  content: "The Smartgen feature is incredible. I've earned over $500 selling my prompts in just one month. The marketplace is a game-changer.",
                  rating: 5,
                  avatar: "https://via.placeholder.com/60x60/1E67C6/white?text=MR",
                },
                {
                  name: "Emily Watson",
                  role: "Marketing Manager",
                  content: "The prompt library saved me hours of work every week. Everything is perfectly categorized and the quality is consistently excellent.",
                  rating: 5,
                  avatar: "https://via.placeholder.com/60x60/CE84CF/white?text=EW",
                },
                {
                  name: "Ankit Yadav",
                  role: "Startup Founder",
                  content: "I pitch better, create faster, and scale smarter thanks to TOKUN's optimization. This platform has transformed my workflow completely.",
                  rating: 5,
                  avatar: "https://via.placeholder.com/60x60/DD335C/white?text=AY",
                },
                {
                  name: "Priya Sinha",
                  role: "Educator",
                  content: "I use the prompt library in my AI courses—it saves tons of time for both me and my students. The educational value is immense.",
                  rating: 5,
                  avatar: "https://via.placeholder.com/60x60/13FFAA/black?text=PS",
                },
              ];
              const t = testimonials[index % testimonials.length];

              return (
                <div
                  key={index}
                  className="glass w-96 h-64 shrink-0 p-8 rounded-2xl border border-white/20 mx-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white mb-6 italic text-lg leading-relaxed">"{t.content}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="font-semibold text-white text-lg">{t.name}</div>
                      <div className="text-sm text-white/70">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* STATS SECTION */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 gradient-text">
            Trusted by Developers Worldwide
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Prompts Optimized" },
              { number: "60%", label: "Average Token Reduction" },
              { number: "4.9", label: "User Rating" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass p-8 rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-tokun mb-2">{stat.number}</div>
                <div className="text-white/80 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Ready to optimize your prompts?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already saving costs and improving efficiency with TOKUN.
          </p>
          <motion.button
            onClick={() => navigate("/app")}
            whileHover={{ scale: 1.05, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative px-12 py-6 text-xl rounded-xl text-white font-semibold bg-gradient-to-br from-[#13FFAA] to-[#1E67C6] shadow-2xl border border-white/10 backdrop-blur-md"
            style={{
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 20px rgba(19,255,170,0.3)",
            }}
          >
            <div className="absolute inset-0 rounded-xl bg-white opacity-10 blur-[6px] pointer-events-none" />
            <div className="flex items-center justify-center gap-3">
              Start Optimizing Now
              <Sparkles className="h-6 w-6" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-32">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold gradient-text mb-4">TOKUN</h3>
              <p className="text-white/70 text-lg mb-6 max-w-md">
                The ultimate platform for prompt optimization, generation, and monetization. Transform your AI interactions today.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Instagram, Facebook].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-tokun/20 transition-colors cursor-pointer">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {["Smartgen", "Prompt Library", "Marketplace", "Pricing", "About Us"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/70 hover:text-tokun transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-tokun" />
                  <span className="text-white/70">support@tokun.ai</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-tokun" />
                  <span className="text-white/70">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-tokun" />
                  <span className="text-white/70">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/70">© 2024 TOKUN. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-white/70 hover:text-tokun transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/70 hover:text-tokun transition-colors">Terms of Service</a>
                <a href="#" className="text-white/70 hover:text-tokun transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => navigate("/login")}
          className="w-16 h-16 rounded-full bg-tokun hover:bg-tokun/80 shadow-2xl shadow-tokun/30 transform hover:scale-110 transition-all duration-300"
          style={{ animation: "pulse 2s infinite" }}
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </motion.section>
  );
};

export default Landing;