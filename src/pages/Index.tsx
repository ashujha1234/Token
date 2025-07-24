
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AppNavigation from "@/components/AppNavigation";
import TokenCircle from "@/components/TokenCircle";
import PromptInput from "@/components/PromptInput";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import ApiKeyModal from "@/components/ApiKeyModal";
import SmarterPrompt from "@/components/SmarterPrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { llmService } from "@/services/llmService";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TokenUsageStats from "@/components/TokenUsageStats";
import { useAuth } from "@/contexts/AuthContext";

// Check if running in extension context
const isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

// Helper function for safely accessing chrome storage
const getChromeStorage = (key: string, defaultValue: any): Promise<any> => {
  return new Promise((resolve) => {
    if (isExtensionContext) {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    } else {
      // Use localStorage as fallback when not in extension context
      const value = localStorage.getItem(key);
      resolve(value !== null ? JSON.parse(value) : defaultValue);
    }
  });
};

// Helper function for safely setting chrome storage
const setChromeStorage = (key: string, value: any): void => {
  if (isExtensionContext) {
    chrome.storage.local.set({ [key]: value });
  } else {
    // Use localStorage as fallback when not in extension context
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("smartgen");
  const [originalTokens, setOriginalTokens] = useState(0);
  const [originalWords, setOriginalWords] = useState(0);
  const [optimizedTokens, setOptimizedTokens] = useState(0);
  const [optimizedWords, setOptimizedWords] = useState(0);
  const [optimizedText, setOptimizedText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [tokenLimit, setTokenLimit] = useState(100000);
  const [isKeySet, setIsKeySet] = useState(false);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [promptText, setPromptText] = useState("");

  // Check if API key is set on first load
  useEffect(() => {
    const config = llmService.getConfig();
    setIsKeySet(!!config.apiKey);
    if (!config.apiKey) {
      setApiKeyModalOpen(true);
    }
    
    // Load saved total tokens from storage
    const loadInitialData = async () => {
      const savedTokens = await getChromeStorage('total_tokens_used', 0);
      setTotalTokensUsed(Number(savedTokens));
      
      const savedLimit = await getChromeStorage('token_limit', 100000);
      setTokenLimit(Number(savedLimit));
    };
    
    loadInitialData();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleTokensChange = (tokens: number, words: number) => {
    setOriginalTokens(tokens);
    setOriginalWords(words);
  };

  const handleOptimize = (text: string, tokens: number, words: number, newSuggestions: string[]) => {
    setOptimizedText(text);
    setOptimizedTokens(tokens);
    setOptimizedWords(words);
    setSuggestions(newSuggestions);
    
    const reduction = originalTokens - tokens;
    const percentReduction = originalTokens > 0 ? Math.round((reduction / originalTokens) * 100) : 0;
    
    // Update total tokens used
    const newTotalTokens = totalTokensUsed + originalTokens;
    setTotalTokensUsed(newTotalTokens);
    
    // Save to storage
    setChromeStorage('total_tokens_used', newTotalTokens);
    
    toast({
      title: "Prompt Optimized",
      description: `Reduced by ${reduction} tokens (${percentReduction}%)`,
    });
  };

  // Check if token usage is getting low and alert the user
  useEffect(() => {
    const remainingTokens = tokenLimit - totalTokensUsed;
    if (remainingTokens <= 10000 && remainingTokens > 0) {
      toast({
        title: "Token Limit Warning",
        description: `You have only ${remainingTokens.toLocaleString()} tokens left in your allocation`,
        variant: "destructive",
      });
    }
  }, [totalTokensUsed, tokenLimit]);

  const handleSmartgenPromptGenerated = (prompt: string) => {
    // Don't automatically copy to prompt optimizer
    // User can manually use it if needed
    toast({
      title: "Detailed Prompt Generated",
      description: "Your enhanced prompt is ready. You can now export or use it.",
    });
  };

  const handleUseInOptimizer = (prompt: string) => {
    setPromptText(prompt);
    setActiveSection("prompt-optimization");
    // Scroll to the prompt optimization section
    setTimeout(() => {
      const element = document.getElementById('prompt-optimization');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <AppNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* Smartgen Section - Now appears first */}
        <section id="smartgen" className="py-8">
          <SmarterPrompt 
            onPromptGenerated={handleSmartgenPromptGenerated}
            onUseInOptimizer={handleUseInOptimizer}
          />
        </section>

        {/* Prompt Optimization Section */}
        <section id="prompt-optimization" className="py-8 border-t border-border/20">
          <div className="my-8">
            <h2 className="text-3xl font-bold mb-2">Prompt Optimization Dashboard</h2>
            <p className="text-muted-foreground">Reduce token usage while preserving meaning across multiple LLMs</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main panel */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-card border-none shadow-lg">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-xl text-tokun flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Multi-LLM Prompt Optimizer
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <PromptInput 
                    onTokensChange={handleTokensChange}
                    onOptimize={handleOptimize}
                    initialText={promptText}
                  />
                  
                  <div className="flex justify-between mt-4 p-4 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Token Count</p>
                      <p className="text-2xl font-bold text-tokun">{originalTokens}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ArrowRight className="h-6 w-6 mx-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Word Count</p>
                      <p className="text-2xl font-bold">{originalWords}</p>
                    </div>
                  </div>

                  {/* Optimized Output Section */}
                  {optimizedText && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-tokun mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Optimized Result
                      </h3>
                      <div className="min-h-[120px] p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{optimizedText}</p>
                      </div>
                      
                      <div className="flex justify-between mt-4 p-4 bg-tokun/5 rounded-lg border border-tokun/20">
                        <div>
                          <p className="text-sm text-muted-foreground">Optimized Tokens</p>
                          <p className="text-2xl font-bold text-tokun">{optimizedTokens}</p>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <ArrowRight className="h-6 w-6 mx-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Optimized Words</p>
                          <p className="text-2xl font-bold text-tokun">{optimizedWords}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="hidden lg:block">
                <SuggestionsPanel 
                  suggestions={suggestions}
                  originalTokens={originalTokens}
                  optimizedTokens={optimizedTokens}
                />
              </div>
            </div>
            
            {/* Side panel with token visualization */}
            <div className="space-y-8">
              <Card className="bg-card border-none shadow-lg py-6 hover:shadow-tokun/10 transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center text-tokun">Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenCircle tokens={optimizedTokens || originalTokens} maxTokens={tokenLimit} />
                  
                  {optimizedTokens > 0 && originalTokens > 0 && (
                    <div className="mt-6 text-center">
                      <div className="text-sm text-muted-foreground">Token Reduction</div>
                      <div className="text-2xl font-bold text-tokun">
                        {originalTokens - optimizedTokens} tokens
                      </div>
                      <div className="text-md text-tokun">
                        {Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)}% saved
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <TokenUsageStats totalTokens={totalTokensUsed} tokenLimit={tokenLimit} />
              
              <Card className="bg-card border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-tokun flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setApiKeyModalOpen(true)}
                  >
                    {isKeySet ? "Update API Settings" : "Set API Settings"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => {
                      const newLimit = parseInt(prompt("Enter new token limit:", tokenLimit.toString()) || String(tokenLimit));
                      if (!isNaN(newLimit) && newLimit > 0) {
                        setTokenLimit(newLimit);
                        setChromeStorage('token_limit', newLimit);
                        toast({
                          title: "Token limit updated",
                          description: `New limit: ${newLimit.toLocaleString()} tokens`
                        });
                      }
                    }}
                  >
                    Adjust Token Limit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => {
                      if (confirm("Reset total token count?")) {
                        setTotalTokensUsed(0);
                        setChromeStorage('total_tokens_used', 0);
                        toast({
                          title: "Token count reset",
                          description: "Total token count has been reset to zero"
                        });
                      }
                    }}
                  >
                    Reset Token Count
                  </Button>
                </CardContent>
              </Card>
              
              <div className="block lg:hidden">
                <SuggestionsPanel 
                  suggestions={suggestions}
                  originalTokens={originalTokens}
                  optimizedTokens={optimizedTokens}
                />
              </div>
            </div>
          </div>
        </section>
        
        <footer className="py-8 mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 TOKUN. All rights reserved.</p>
        </footer>
      </div>
      
      <ApiKeyModal 
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        onSave={() => setIsKeySet(true)}
      />
    </div>
  );
};

export default Index;
