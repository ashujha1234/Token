import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Copy, Sparkles, Zap, Mic, MicOff, Lightbulb, Download, ExternalLink, BookOpen, Gauge } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { llmService } from "@/services/llmService"; // Adjust path as needed

interface SmarterPromptProps {
  onPromptGenerated?: (prompt: string) => void;
  onUseInOptimizer?: (prompt: string) => void;
}

const SmarterPrompt = ({ onPromptGenerated, onUseInOptimizer }: SmarterPromptProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [tokenEfficiencyScore, setTokenEfficiencyScore] = useState(0);
  const recognitionRef = useRef<any>(null);

  const exampleIdeas = [
    "Help me create a marketing strategy",
    "Write a technical tutorial for beginners",
    "Analyze competitor pricing models",
    "Design a user onboarding flow"
  ];

  // Check for speech recognition support and set API key
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserPrompt(prev => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          toast({
            title: "Speech recognition failed",
            description: "Please try again or use text input",
            variant: "destructive"
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Updated to match .env
      const model = import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o-mini'; // Use new variable or fallback
      console.log('VITE_OPENAI_API_KEY:', apiKey, 'VITE_DEFAULT_MODEL:', model); // Debug log
      if (apiKey) {
        llmService.setConfig({ apiKey, provider: 'openai', model }); // Include model
      } else {
        toast({
          title: "API Key Missing",
          description: "Please set VITE_OPENAI_API_KEY in your .env file",
          variant: "destructive"
        });
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setUserPrompt(example);
  };

  const generateDetailedPrompt = async () => {
    const promptToProcess = userPrompt.trim();

    if (!promptToProcess) {
      toast({
        title: "No prompt provided",
        description: "Please enter a prompt first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Use a higher targetTokens value (e.g., 1000) to encourage a detailed response
      const response = await llmService.optimizePrompt(promptToProcess, 1000, 'detailed');
      setDetailedPrompt(response.optimizedText);

      const originalTokens = tokenCount(promptToProcess);
      const enhancedTokens = tokenCount(detailedPrompt);
      const efficiencyScore = Math.min(95, Math.max(60, 100 - Math.round((enhancedTokens - originalTokens) / originalTokens * 50)));
      setTokenEfficiencyScore(efficiencyScore);

      if (onPromptGenerated) {
        onPromptGenerated(response.optimizedText);
      }

      toast({
        title: "Detailed Prompt Generated!",
        description: `Your detailed prompt is ready (Efficiency: ${efficiencyScore}% - ${getEfficiencyLabel(efficiencyScore)})`,
      });
    } catch (error) {
      toast({
        title: "Error Generating Prompt",
        description: error instanceof Error ? error.message : "Failed to generate prompt",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied successfully`
    });
  };

  const downloadPrompt = () => {
    const element = document.createElement("a");
    const file = new Blob([detailedPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "detailed-prompt.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download started",
      description: "Your prompt has been downloaded as a text file"
    });
  };

  const saveToLibrary = () => {
    const savedPrompts = JSON.parse(localStorage.getItem('saved_prompts') || '[]');
    const newPrompt = {
      id: Date.now(),
      title: userPrompt.substring(0, 50) + (userPrompt.length > 50 ? '...' : ''),
      original: userPrompt,
      enhanced: detailedPrompt,
      timestamp: new Date().toISOString(),
      tokenEfficiency: tokenEfficiencyScore
    };

    savedPrompts.push(newPrompt);
    localStorage.setItem('saved_prompts', JSON.stringify(savedPrompts));

    toast({
      title: "Saved to library",
      description: "Your prompt has been saved to your personal library"
    });
  };

  const openInChatGPT = () => {
    const encodedPrompt = encodeURIComponent(detailedPrompt);
    window.open(`https://chat.openai.com/?prompt=${encodedPrompt}`, '_blank');
  };

  const tokenCount = (text: string) => Math.ceil(text.length / 4); // Retained for UI consistency

  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getEfficiencyLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-tokun/10 to-purple-500/10 border-tokun/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tokun text-center justify-center">
            <Sparkles className="h-5 w-5" />
            Smartgen - Get detailed prompts for any topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-tokun" />
              <h3 className="text-sm font-medium text-tokun">Example Ideas:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleIdeas.map((idea, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleExampleClick(idea)}
                  className="text-left justify-start h-auto py-2 px-3 text-sm border-tokun/20 hover:border-tokun/40 hover:bg-tokun/5"
                >
                  • {idea}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter your prompt:</label>
            <div className="relative">
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here... (e.g., 'Give me a detailed prompt for how to start cafe business')"
                className="min-h-32 pr-12"
              />
              {speechSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-2 top-2 h-8 w-8 p-0 ${
                    isListening ? 'text-red-500 hover:text-red-600' : 'text-tokun hover:text-tokun/80'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {isListening && (
              <p className="text-sm text-tokun mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... Speak now
              </p>
            )}
          </div>

          <div className="text-center mb-6">
            <Button
              onClick={generateDetailedPrompt}
              disabled={isGenerating || !userPrompt.trim()}
              className="bg-tokun hover:bg-tokun/80 text-white px-8 py-3 h-auto text-lg font-semibold shadow-lg shadow-tokun/25"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Detailed Prompt...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Detailed Prompt
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="text-center text-muted-foreground mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-tokun rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-tokun rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-tokun rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p>Creating detailed prompt...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {detailedPrompt && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-tokun/5 to-purple-500/5 border-tokun/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-tokun">
                  <Sparkles className="h-4 w-4" />
                  Detailed Prompt
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-tokun/10 text-tokun border-tokun/20">
                    {tokenCount(detailedPrompt)} tokens
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-semibold ${getEfficiencyColor(tokenEfficiencyScore)}`}>
                      {tokenEfficiencyScore}% {getEfficiencyLabel(tokenEfficiencyScore)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={detailedPrompt}
                onChange={(e) => setDetailedPrompt(e.target.value)}
                className="min-h-32 bg-background/50 border-tokun/20 focus:border-tokun/40 resize-none text-sm"
                readOnly
              />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(detailedPrompt, "Detailed prompt")}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPrompt}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveToLibrary}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Save to Library
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInChatGPT}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Use in ChatGPT
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500/10 to-tokun/10 border-green-500/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Original Length</div>
                  <div className="text-lg font-bold text-tokun">{tokenCount(userPrompt)} tokens</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Detailed Length</div>
                  <div className="text-lg font-bold text-tokun">{tokenCount(detailedPrompt)} tokens</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Efficiency Score</div>
                  <div className={`text-lg font-bold ${getEfficiencyColor(tokenEfficiencyScore)}`}>
                    {tokenEfficiencyScore}% {getEfficiencyLabel(tokenEfficiencyScore)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmarterPrompt;