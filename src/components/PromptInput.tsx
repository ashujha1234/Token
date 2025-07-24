import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { llmService } from "@/services/llmService";
import LLMSelector from "./LLMSelector";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  Loader2, 
  ChevronRight, 
  Lightbulb,
  AlertCircle
} from "lucide-react";

interface PromptInputProps {
  onTokensChange: (tokens: number, words: number) => void;
  onOptimize: (text: string, tokens: number, words: number, suggestions: string[]) => void;
  initialText?: string;
}

interface OptimizationOption {
  text: string;
  tokens: number;
  words: number;
  description: string;
}

const LLM_WEBSITES = {
  openai: { 
    name: "ChatGPT", 
    url: "https://chat.openai.com",
    bgColor: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white"
  },
  perplexity: { 
    name: "Perplexity", 
    url: "https://perplexity.ai",
    bgColor: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white"
  },
  anthropic: { 
    name: "Claude", 
    url: "https://claude.ai",
    bgColor: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-white"
  },
  google: { 
    name: "Gemini", 
    url: "https://gemini.google.com",
    bgColor: "bg-purple-500 hover:bg-purple-600",
    textColor: "text-white"
  }
};

const PromptInput = ({ onTokensChange, onOptimize, initialText = "" }: PromptInputProps) => {
  const [text, setText] = useState(initialText);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationOption, setOptimizationOption] = useState<OptimizationOption | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialText && initialText !== text) {
      setText(initialText);
      countTokens(initialText);
    }
  }, [initialText]);

  const countTokens = async (newText: string) => {
    try {
      const { tokens, words } = await llmService.countTokens(newText);
      onTokensChange(tokens, words);
    } catch (error) {
      console.error("Error counting tokens:", error);
    }
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    countTokens(newText);
    // Clear option when text changes
    setOptimizationOption(null);
  };

  const generateOptimizedVersion = (originalText: string, optimizedText: string) => {
    const sentences = optimizedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = optimizedText.split(/\s+/).filter(Boolean);
    const originalWords = originalText.split(/\s+/).filter(Boolean);
    
    // Strategic optimization: Keep key sentences from beginning and middle
    const targetCount = Math.max(2, Math.floor(sentences.length * 0.7));
    
    let selectedIndices: number[] = [];
    if (sentences.length <= targetCount) {
      selectedIndices = Array.from({ length: sentences.length }, (_, i) => i);
    } else {
      // Always include first sentence
      selectedIndices.push(0);
      
      // Add sentences from middle sections
      const remainingSlots = targetCount - 1;
      const step = Math.floor(sentences.length / remainingSlots);
      
      for (let i = 1; i < remainingSlots; i++) {
        const index = Math.min(i * step, sentences.length - 1);
        if (!selectedIndices.includes(index)) {
          selectedIndices.push(index);
        }
      }
      
      // Add last sentence if not already included
      if (!selectedIndices.includes(sentences.length - 1) && selectedIndices.length < targetCount) {
        selectedIndices.push(sentences.length - 1);
      }
    }
    
    selectedIndices = [...new Set(selectedIndices)].sort((a, b) => a - b);
    
    const optimizedVersionText = selectedIndices
      .map(i => sentences[i])
      .filter(Boolean)
      .join('. ').trim() + '.';
    
    return {
      text: optimizedVersionText,
      tokens: Math.floor(originalWords.length * 0.6), // More realistic token reduction
      words: optimizedVersionText.split(/\s+/).filter(Boolean).length,
      description: "Optimized for clarity and conciseness"
    };
  };

  const generateOptimizationSuggestions = (originalText: string) => {
    const suggestions: string[] = [];
    
    // Check for common optimization opportunities
    if (originalText.includes('please') || originalText.includes('kindly')) {
      suggestions.push("Remove unnecessary politeness words like 'please' and 'kindly'");
    }
    
    if (originalText.includes('I want you to') || originalText.includes('I would like you to')) {
      suggestions.push("Replace 'I want you to' with direct commands for brevity");
    }
    
    if (originalText.match(/\b(very|really|quite|extremely|absolutely)\b/gi)) {
      suggestions.push("Remove unnecessary intensifiers like 'very', 'really', 'quite'");
    }
    
    if (originalText.includes('in order to')) {
      suggestions.push("Replace 'in order to' with simple 'to'");
    }
    
    if (originalText.match(/\b(that is|which is|who is)\b/gi)) {
      suggestions.push("Remove unnecessary relative clauses to reduce word count");
    }
    
    if (originalText.split(/\s+/).length > 50) {
      suggestions.push("Break down complex sentences into shorter, clearer statements");
    }
    
    if (originalText.match(/\b(actually|basically|essentially|fundamentally)\b/gi)) {
      suggestions.push("Remove filler words like 'actually', 'basically', 'essentially'");
    }
    
    if (originalText.includes('make sure') || originalText.includes('ensure that')) {
      suggestions.push("Use 'ensure' instead of 'make sure that' for conciseness");
    }
    
    // Always add general suggestions
    suggestions.push("Use active voice instead of passive voice when possible");
    suggestions.push("Combine related sentences to reduce repetition");
    suggestions.push("Focus on essential information and remove background context");
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  };

  const handleOptimize = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter text to optimize",
        variant: "destructive",
      });
      return;
    }

    const config = llmService.getConfig();
    if (!config.apiKey) {
      toast({
        title: "API key missing",
        description: `Please set your ${config.provider.toUpperCase()} API key in the settings`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { optimizedText, tokens, words, suggestions } = await llmService.optimizePrompt(text);
      
      // Generate single optimized option
      const option = generateOptimizedVersion(text, optimizedText);
      
      // Generate practical optimization suggestions
      const optimizationSuggestions = generateOptimizationSuggestions(text);
      
      setOptimizationOption(option);
      
      toast({
        title: "Optimization complete",
        description: "Review the optimized version below",
      });
    } catch (error) {
      console.error("Error optimizing prompt:", error);
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectOption = (option: OptimizationOption) => {
    const optimizationSuggestions = generateOptimizationSuggestions(text);
    onOptimize(option.text, option.tokens, option.words, optimizationSuggestions);
    setOptimizationOption(null);
    setText(option.text); // Set the input text to the selected optimized version
    toast({
      title: "Optimization applied",
      description: "The optimized text has been applied"
    });
  };

  const openLLMWebsite = (provider: keyof typeof LLM_WEBSITES, promptText?: string) => {
    const llm = LLM_WEBSITES[provider];
    let url = llm.url;
    
    // Add prompt as URL parameter where supported
    if (promptText) {
      // Copy to clipboard first
      navigator.clipboard.writeText(promptText);
      
      // For some platforms, we can add the prompt to URL
      switch (provider) {
        case 'perplexity':
          url = `${llm.url}/?q=${encodeURIComponent(promptText)}`;
          break;
        case 'google':
          url = `${llm.url}/app?q=${encodeURIComponent(promptText)}`;
          break;
        default:
          // For ChatGPT and Claude, we just copy to clipboard
          // as they don't support URL parameters for prompts
          break;
      }
    }
    
    window.open(url, '_blank');
    
    if (promptText) {
      toast({
        title: "Prompt copied to clipboard",
        description: `Opening ${llm.name} with your prompt ready to paste`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <LLMSelector />
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Enter your prompt here..."
          className="min-h-[200px] bg-secondary/50 resize-none border border-border/60 rounded-xl"
          value={text}
          onChange={handleTextChange}
        />
        
        <div className="absolute top-3 right-3 flex gap-2">
          {text && (
            <Button
              onClick={() => setText("")}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/70 hover:bg-background"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
          <span>Optimizing your prompt can significantly reduce token usage.</span>
        </div>
        
        {/* Main Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/40">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-1">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Optimize your prompt or try it directly with an LLM</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Optimize Button */}
            <Button 
              onClick={handleOptimize}
              disabled={isProcessing || !text}
              className="bg-tokun hover:bg-tokun/80 rounded-lg min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize
                </>
              )}
            </Button>
            
            {/* LLM Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-1">
              {Object.entries(LLM_WEBSITES).map(([key, llm]) => (
                <Button
                  key={key}
                  onClick={() => openLLMWebsite(key as keyof typeof LLM_WEBSITES, text)}
                  size="sm"
                  className={`h-9 px-4 text-xs font-medium rounded-lg transition-all duration-200 ${llm.bgColor} ${llm.textColor} min-w-[80px]`}
                  title={`Open ${llm.name} with current prompt`}
                >
                  {llm.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Single Optimization Option */}
      {optimizationOption && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-tokun">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-medium text-lg">Optimized Version</h3>
          </div>
          
          <Card className="overflow-hidden border border-border/50 hover:border-tokun/30 transition-all duration-300 bg-card rounded-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-base">Optimized Prompt</h4>
                  <p className="text-sm text-muted-foreground">{optimizationOption.description}</p>
                </div>
                <div className="flex gap-3 items-center text-xs text-muted-foreground">
                  <span className="bg-tokun/10 px-3 py-1 rounded-full font-medium">{optimizationOption.tokens} tokens</span>
                  <span className="bg-secondary px-3 py-1 rounded-full font-medium">{optimizationOption.words} words</span>
                </div>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg mb-4 max-h-32 overflow-y-auto">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {optimizationOption.text}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(LLM_WEBSITES).map(([key, llm]) => (
                    <Button
                      key={key}
                      onClick={() => openLLMWebsite(key as keyof typeof LLM_WEBSITES, optimizationOption.text)}
                      size="sm"
                      className={`h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${llm.bgColor} ${llm.textColor}`}
                      title={`Open ${llm.name} with optimized prompt`}
                    >
                      {llm.name}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  onClick={() => selectOption(optimizationOption)}
                  className="bg-tokun hover:bg-tokun/80 gap-2 rounded-lg min-w-[140px]"
                  size="sm"
                >
                  <Check className="h-4 w-4" />
                  Use this version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Usage information */}
      {!optimizationOption && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-border/60">
          <AlertCircle className="h-4 w-4" />
          <p>Enter your prompt above and click "Optimize" to get an optimized version with suggestions.</p>
        </div>
      )}
    </div>
  );
};

export default PromptInput;
