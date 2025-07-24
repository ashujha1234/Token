
export type LLMProvider = 'openai' | 'perplexity' | 'anthropic' | 'google' | 'other';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface TokenizerResponse {
  tokens: number;
  words: number;
}

export interface OptimizeResponse {
  optimizedText: string;
  tokens: number;
  words: number;
  suggestions: string[];
}

const DEFAULT_MODEL_BY_PROVIDER: Record<LLMProvider, string> = {
  'openai': 'gpt-4o-mini',
  'perplexity': 'llama-3.1-sonar-small-128k-online',
  'anthropic': 'claude-instant',
  'google': 'gemini-pro',
  'other': 'generic'
};

class LLMService {
  private config: LLMConfig = {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini'
  };
  
  constructor() {
    // Load config on initialization
    this.loadConfig();
  }
  
  private loadConfig() {
    const savedProvider = localStorage.getItem('llm_provider') || 'openai';
    const savedApiKey = localStorage.getItem(`${savedProvider}_key`);
    const savedModel = localStorage.getItem(`${savedProvider}_model`) || DEFAULT_MODEL_BY_PROVIDER[savedProvider as LLMProvider];
    
    this.config = {
      provider: savedProvider as LLMProvider,
      apiKey: savedApiKey || '',
      model: savedModel
    };
  }
  
  setConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config };
    
    // Save to localStorage
    localStorage.setItem('llm_provider', this.config.provider);
    if (this.config.apiKey) {
      localStorage.setItem(`${this.config.provider}_key`, this.config.apiKey);
    }
    if (this.config.model) {
      localStorage.setItem(`${this.config.provider}_model`, this.config.model);
    }
  }
  
  getConfig(): LLMConfig {
    return { ...this.config };
  }
  
  async countTokens(text: string): Promise<TokenizerResponse> {
    // Simple estimation - actual tokens are more complex
    const words = text.split(/\s+/).filter(Boolean).length;
    
    // Different token calculations based on provider
    let tokenMultiplier = 1.3; // Default for most models
    
    switch (this.config.provider) {
      case 'openai':
        tokenMultiplier = 1.3;
        break;
      case 'perplexity':
        tokenMultiplier = 1.35;
        break;
      case 'anthropic':
        tokenMultiplier = 1.25;
        break;
      case 'google':
        tokenMultiplier = 1.2;
        break;
      default:
        tokenMultiplier = 1.3;
    }
    
    const tokens = Math.round(words * tokenMultiplier);
    
    return {
      tokens,
      words
    };
  }
  
  async optimizePrompt(text: string, targetTokens?: number): Promise<OptimizeResponse> {
    if (!this.config.apiKey) {
      throw new Error("API key not set");
    }
    
    try {
      const originalCount = await this.countTokens(text);
      const target = targetTokens || Math.max(Math.floor(originalCount.tokens * 0.7), 10);
      
      switch (this.config.provider) {
        case 'openai':
          return this.optimizeWithOpenAI(text, target);
        case 'perplexity':
          return this.optimizeWithPerplexity(text, target);
        case 'anthropic':
          return this.optimizeWithAnthropic(text, target);
        case 'google':
          return this.optimizeWithGoogle(text, target);
        default:
          return this.optimizeWithOpenAI(text, target);
      }
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      throw error;
    }
  }
  
  // OpenAI optimization implementation
  private async optimizeWithOpenAI(text: string, targetTokens: number): Promise<OptimizeResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at optimizing text to use fewer tokens while preserving the original meaning. 
            Your task is to optimize the input text to be more concise, using fewer tokens, but preserving the core meaning.
            Return a JSON object with the following structure:
            {
              "optimizedText": "the optimized version of the input text",
              "suggestions": ["suggestion 1 for further optimization", "suggestion 2", "suggestion 3"]
            }
            Make the optimized text around ${targetTokens} tokens long.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error optimizing prompt');
    }
    
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      throw new Error('Invalid response format from OpenAI');
    }
    
    const optimizedCount = await this.countTokens(result.optimizedText);
    
    return {
      optimizedText: result.optimizedText,
      tokens: optimizedCount.tokens,
      words: optimizedCount.words,
      suggestions: result.suggestions || []
    };
  }
  
  // Perplexity optimization implementation
  private async optimizeWithPerplexity(text: string, targetTokens: number): Promise<OptimizeResponse> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an expert at optimizing text to use fewer tokens while preserving the original meaning. 
            Your task is to optimize the input text to be more concise, using fewer tokens, but preserving the core meaning.
            Return a JSON object with the following structure:
            {
              "optimizedText": "the optimized version of the input text",
              "suggestions": ["suggestion 1 for further optimization", "suggestion 2", "suggestion 3"]
            }
            Make the optimized text around ${targetTokens} tokens long.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error optimizing prompt');
    }
    
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      throw new Error('Invalid response format from Perplexity');
    }
    
    const optimizedCount = await this.countTokens(result.optimizedText);
    
    return {
      optimizedText: result.optimizedText,
      tokens: optimizedCount.tokens,
      words: optimizedCount.words,
      suggestions: result.suggestions || []
    };
  }
  
  // Anthropic optimization implementation (placeholder)
  private async optimizeWithAnthropic(text: string, targetTokens: number): Promise<OptimizeResponse> {
    // Implementation would be similar to OpenAI and Perplexity
    // This is a placeholder for the Anthropic API
    
    const originalCount = await this.countTokens(text);
    return {
      optimizedText: text,
      tokens: originalCount.tokens,
      words: originalCount.words,
      suggestions: ["Anthropic integration pending"]
    };
  }
  
  // Google optimization implementation (placeholder)
  private async optimizeWithGoogle(text: string, targetTokens: number): Promise<OptimizeResponse> {
    // Implementation would be similar to OpenAI and Perplexity
    // This is a placeholder for the Google AI API
    
    const originalCount = await this.countTokens(text);
    return {
      optimizedText: text,
      tokens: originalCount.tokens,
      words: originalCount.words,
      suggestions: ["Google AI integration pending"]
    };
  }
}

export const llmService = new LLMService();
