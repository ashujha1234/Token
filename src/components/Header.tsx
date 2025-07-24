
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ApiKeyModal from "@/components/ApiKeyModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center py-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-tokun">TOKUN</span>
        </h1>
        <p className="text-muted-foreground text-sm">UNTOKEN IT.</p>
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-tokun" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card">
                <DropdownMenuItem onClick={() => setApiKeyModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Set API Key
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSubscriptionModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Subscription Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button 
              className="bg-tokun hover:bg-tokun/80 text-white"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      
      <ApiKeyModal 
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        onSave={() => {}}
      />
      
      <SubscriptionModal
        open={subscriptionModalOpen}
        onOpenChange={setSubscriptionModalOpen}
      />
    </header>
  );
};

export default Header;
