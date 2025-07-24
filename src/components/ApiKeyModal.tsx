
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { llmService, type LLMProvider } from "@/services/llmService";
import LLMSelector from "./LLMSelector";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const ApiKeyModal = ({ open, onOpenChange, onSave }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const [provider, setProvider] = useState<LLMProvider>('openai');
  const [model, setModel] = useState('');
  
  const providerLabels: Record<LLMProvider, string> = {
    'openai': 'OpenAI',
    'perplexity': 'Perplexity AI',
    'anthropic': 'Anthropic',
    'google': 'Google AI',
    'other': 'Custom LLM'
  };

  const modelPlaceholders: Record<LLMProvider, string> = {
    'openai': 'gpt-4o-mini (default)',
    'perplexity': 'llama-3.1-sonar-small-128k-online (default)',
    'anthropic': 'claude-instant (default)',
    'google': 'gemini-pro (default)',
    'other': 'model identifier'
  };

  useEffect(() => {
    if (open) {
      const config = llmService.getConfig();
      setProvider(config.provider);
      
      const savedKey = config.apiKey;
      setIsKeySet(!!savedKey);
      
      if (savedKey) {
        // Show only first 8 characters and last 4 of the API key for security
        const maskedKey = savedKey.substring(0, 8) + "..." + savedKey.substring(savedKey.length - 4);
        setApiKey(maskedKey);
      } else {
        setApiKey("");
      }
      
      setModel(config.model || '');
    }
  }, [open, provider]);

  const handleSave = () => {
    if (apiKey.trim() && !apiKey.includes('...')) {
      llmService.setConfig({ 
        provider, 
        apiKey: apiKey.trim(),
        model: model.trim() || undefined
      });
      
      setIsKeySet(true);
      toast({
        title: "API Key Saved",
        description: `Your ${providerLabels[provider]} API key has been saved securely.`,
      });
      onSave();
    }
    onOpenChange(false);
  };

  const handleReset = () => {
    setApiKey("");
    setIsKeySet(false);
  };

  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
    
    // Check if we have an API key for this provider
    const savedKey = localStorage.getItem(`${newProvider}_key`);
    setIsKeySet(!!savedKey);
    
    if (savedKey) {
      const maskedKey = savedKey.substring(0, 8) + "..." + savedKey.substring(savedKey.length - 4);
      setApiKey(maskedKey);
    } else {
      setApiKey("");
    }
    
    // Check if we have a model for this provider
    const savedModel = localStorage.getItem(`${newProvider}_model`);
    setModel(savedModel || '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="text-tokun">Configure LLM Settings</DialogTitle>
          <DialogDescription>
            Configure your API settings for various LLM providers to enable token optimization.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <LLMSelector onProviderChange={handleProviderChange} />
          
          {isKeySet ? (
            <div className="flex items-center space-x-2 p-4 bg-tokun/10 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{providerLabels[provider]} API key is set and ready to use</span>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="apiKey" className="text-sm mb-2 block">
                  {providerLabels[provider]} API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`${providerLabels[provider]} API key`}
                  className="bg-secondary"
                />
              </div>
              
              <div>
                <Label htmlFor="model" className="text-sm mb-2 block">
                  Model (Optional)
                </Label>
                <Input
                  id="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={modelPlaceholders[provider]}
                  className="bg-secondary"
                />
              </div>
            </>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Your API keys stay in your browser and are never sent to our servers.
          </p>
        </div>
        <DialogFooter>
          {isKeySet ? (
            <Button variant="outline" onClick={handleReset}>
              Change API Key
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button className="bg-tokun hover:bg-tokun/80" onClick={handleSave}>
            {isKeySet ? "Continue" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
