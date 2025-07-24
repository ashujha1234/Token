import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Copy, Sparkles, Zap, Mic, MicOff, Lightbulb, Download, ExternalLink, BookOpen, Gauge } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

  // Check for speech recognition support
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
    
    // Simulate AI processing
    setTimeout(() => {
      const enhanced = createDetailedPrompt(promptToProcess);
      setDetailedPrompt(enhanced);
      
      // Calculate token efficiency score
      const originalTokens = Math.ceil(promptToProcess.length / 4);
      const enhancedTokens = Math.ceil(enhanced.length / 4);
      const efficiencyScore = Math.min(95, Math.max(60, 100 - Math.round((enhancedTokens - originalTokens) / originalTokens * 50)));
      setTokenEfficiencyScore(efficiencyScore);
      
      if (onPromptGenerated) {
        onPromptGenerated(enhanced);
      }
      
      setIsGenerating(false);
      
      toast({
        title: "Detailed Prompt Generated!",
        description: "Your detailed prompt is ready",
      });
    }, 2000);
  };

  const createDetailedPrompt = (original: string): string => {
    const lowerOriginal = original.toLowerCase();
    
    // Barber shop strategy
    if (lowerOriginal.includes('barber shop') || lowerOriginal.includes('barbershop')) {
      return `Research the Market – Understand local demand, competition, and customer needs.

Create a Business Plan – Define services, pricing, budget, and revenue goals.

Handle Legal Requirements – Register the business, get licenses, and ensure compliance.

Choose a Good Location – Pick a visible, accessible spot and set up a clean, stylish space.

Hire Skilled Staff – Recruit experienced barbers and provide training.

Build Your Brand – Design a strong brand, use social media, and run local promotions.

Focus on Customer Experience – Prioritize cleanliness, comfort, and service quality.

Use Tools to Manage & Grow – Track bookings, collect feedback, and expand smartly.`;
    }
    
    // Cafe/Coffee business
    if (lowerOriginal.includes('cafe') || lowerOriginal.includes('coffee')) {
      return `Market Research – Analyze local coffee market, customer preferences, and competition.

Business Planning – Create comprehensive business plan with financial projections and timelines.

Location Selection – Choose high-traffic area with good visibility and accessibility.

Licensing & Permits – Obtain food service license, business registration, and health permits.

Equipment & Setup – Purchase espresso machines, grinders, furniture, and POS systems.

Menu Development – Design coffee menu, pricing strategy, and specialty offerings.

Staffing – Hire experienced baristas, provide training, and establish service standards.

Marketing & Branding – Develop brand identity, social media presence, and local marketing campaigns.

Operations Management – Establish workflows, inventory management, and quality control procedures.

Financial Management – Set up accounting systems, track expenses, and monitor profitability.`;
    }
    
    // Marketing strategy
    if (lowerOriginal.includes('marketing strategy')) {
      return `Target Audience Analysis – Define customer personas, demographics, and behavior patterns.

Competitive Research – Analyze competitors' strategies, positioning, and market share.

Brand Positioning – Establish unique value proposition and brand messaging framework.

Marketing Objectives – Set SMART goals, KPIs, and success metrics for campaigns.

Channel Strategy – Select optimal marketing channels (digital, traditional, social media).

Content Marketing Plan – Create content calendar, topics, and distribution strategy.

Social Media Strategy – Develop platform-specific content and engagement tactics.

Email Marketing – Design automated campaigns, segmentation, and personalization strategies.

SEO/SEM Approach – Optimize search visibility and manage paid advertising campaigns.

Budget Allocation – Distribute marketing spend across channels for maximum ROI.

Performance Measurement – Track metrics, analyze results, and optimize campaigns continuously.`;
    }
    
    // Technical tutorial
    if (lowerOriginal.includes('technical tutorial')) {
      return `Learning Objectives – Define clear, measurable goals for tutorial completion.

Prerequisites – List required knowledge, tools, and software needed.

Tutorial Structure – Create logical step-by-step progression with clear sections.

Code Examples – Provide working code samples with detailed explanations.

Visual Aids – Include screenshots, diagrams, and video demonstrations.

Hands-on Exercises – Design practical activities to reinforce learning concepts.

Troubleshooting Guide – Address common errors and provide solution strategies.

Testing & Validation – Include methods to verify successful completion.

Additional Resources – Link to documentation, tools, and further learning materials.

Assessment Criteria – Create evaluation methods to measure understanding and progress.`;
    }
    
    // Generic business strategy for other topics
    if (lowerOriginal.includes('business') || lowerOriginal.includes('startup') || lowerOriginal.includes('company')) {
      return `Market Research – Analyze target market, customer needs, and industry trends.

Business Model – Define value proposition, revenue streams, and cost structure.

Legal Framework – Register business, obtain permits, and ensure regulatory compliance.

Financial Planning – Create budgets, cash flow projections, and funding strategies.

Location & Infrastructure – Choose optimal location and set up necessary facilities.

Team Building – Recruit skilled personnel and establish training programs.

Brand Development – Create brand identity, marketing materials, and online presence.

Operations Setup – Establish workflows, systems, and quality control processes.

Customer Acquisition – Develop marketing strategies and customer engagement tactics.

Growth Planning – Set milestones, track performance, and plan for scalable expansion.`;
    }
    
    // Generic detailed response format
    const topic = original.replace(/give me|create|develop|help me|write/gi, '').trim();
    return `Key Analysis – Conduct thorough research and understand core requirements for ${topic}.

Strategic Planning – Develop comprehensive approach with clear objectives and timelines.

Resource Identification – Determine necessary tools, skills, and materials needed.

Implementation Steps – Create detailed action plan with prioritized tasks and milestones.

Best Practices – Apply industry standards and proven methodologies for optimal results.

Risk Management – Identify potential challenges and develop mitigation strategies.

Quality Assurance – Establish monitoring systems and success criteria for evaluation.

Optimization Strategies – Implement continuous improvement processes and feedback loops.`;
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

  const tokenCount = (text: string) => Math.ceil(text.length / 4);

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
          {/* Example Ideas Section */}
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

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter your prompt:</label>
            <div className="relative">
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here... (e.g., 'Give me a detailed prompt for how to start cafe business')"
                className="min-h-32 pr-12"
              />
              
              {/* Speech Input Button */}
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
          {/* Detailed Prompt Output */}
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
              
              {/* Action Buttons */}
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

          {/* Token Efficiency Stats */}
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
