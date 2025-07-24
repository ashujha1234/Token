
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { llmService, type LLMProvider } from "@/services/llmService";
import { Label } from "@/components/ui/label";

interface LLMSelectorProps {
  onProviderChange?: (provider: LLMProvider) => void;
}

const LLMSelector = ({ onProviderChange }: LLMSelectorProps) => {
  const [provider, setProvider] = useState<LLMProvider>(llmService.getConfig().provider);

  const handleProviderChange = (value: string) => {
    const newProvider = value as LLMProvider;
    setProvider(newProvider);
    llmService.setConfig({ provider: newProvider });
    
    if (onProviderChange) {
      onProviderChange(newProvider);
    }
  };

  useEffect(() => {
    // Initialize with current config
    const currentConfig = llmService.getConfig();
    setProvider(currentConfig.provider);
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="llm-provider">LLM Provider</Label>
      <Select value={provider} onValueChange={handleProviderChange}>
        <SelectTrigger id="llm-provider" className="bg-secondary">
          <SelectValue placeholder="Select LLM provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
          <SelectItem value="perplexity">Perplexity AI</SelectItem>
          <SelectItem value="anthropic">Anthropic Claude</SelectItem>
          <SelectItem value="google">Google Gemini</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LLMSelector;
