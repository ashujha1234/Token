import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Store, ArrowDown, Zap } from "lucide-react";

interface AppNavigationProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const AppNavigation = ({ activeSection, onSectionChange }: AppNavigationProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    {
      id: "smartgen",
      label: "Smartgen",
      icon: Sparkles,
      description: "Transform ideas into detailed prompts"
    },
    {
      id: "prompt-optimization", 
      label: "Prompt Optimizer",
      icon: Zap,
      description: "Optimize prompts for efficiency"
    },
    {
      id: "prompt-library",
      label: "Prompt Library", 
      icon: BookOpen,
      description: "Manage your saved prompts"
    },
    {
      id: "prompt-marketplace",
      label: "Prompt Marketplace",
      icon: Store,
      description: "Buy and sell premium prompts"
    }
  ];

  const handleSectionClick = (section: any) => {
    if (section.isScroll) {
      // Scroll to section within the same page
      const element = document.getElementById(section.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        onSectionChange(section.id);
      }
    } else {
      // Navigate to separate page
      if (section.id === 'prompt-library') {
        navigate('/prompt-library');
      } else if (section.id === 'prompt-marketplace') {
        navigate('/prompt-marketplace');
      }
    }
  };

  return (
    <nav className="bg-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 py-4">
          {navItems.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleSectionClick(section)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-tokun text-white hover:bg-tokun/80" 
                    : "hover:bg-tokun/10 hover:text-tokun"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation;
