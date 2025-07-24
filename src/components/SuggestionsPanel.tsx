
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Sparkles, ArrowDown, Percent, Lightbulb, CheckCircle } from "lucide-react";

interface SuggestionsPanelProps {
  suggestions: string[];
  originalTokens: number;
  optimizedTokens: number;
}

const SuggestionsPanel = ({ suggestions, originalTokens, optimizedTokens }: SuggestionsPanelProps) => {
  // Calculate actual token reduction percentage
  const reductionPercentage = originalTokens > 0 && optimizedTokens > 0
    ? Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100)
    : 0;

  const tokenReduction = originalTokens - optimizedTokens;

  return (
    <div className="space-y-6">
      <Card className="bg-card border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-tokun text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Token Reduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-around items-center gap-6 py-6">
            {/* Original Tokens Circle */}
            <div className="w-48 h-48 transition-transform hover:scale-105 duration-300">
              <div className="relative">
                <CircularProgressbar
                  value={100}
                  text={`${originalTokens}`}
                  styles={buildStyles({
                    textSize: '26px',
                    pathColor: '#4ade80', // Green circumference
                    textColor: '#6E59A5',
                    trailColor: '#e6e6e6',
                    strokeLinecap: 'round',
                  })}
                />
                <p className="text-center mt-4 text-sm text-muted-foreground font-medium">Original</p>
              </div>
            </div>
            
            {/* Arrow Indicator */}
            <div className="flex flex-col items-center justify-center">
              <ArrowDown className="h-8 w-8 text-tokun" />
            </div>
            
            {/* Optimized Tokens Circle */}
            <div className="w-48 h-48 transition-transform hover:scale-105 duration-300">
              <div className="relative">
                <CircularProgressbar
                  value={optimizedTokens > 0 ? (optimizedTokens / originalTokens) * 100 : 0}
                  text={`${optimizedTokens}`}
                  styles={buildStyles({
                    textSize: '26px',
                    pathColor: '#4ade80', // Green circumference
                    textColor: '#1EAEDB',
                    trailColor: '#e6e6e6',
                    strokeLinecap: 'round',
                  })}
                />
                <p className="text-center mt-4 text-sm text-muted-foreground font-medium">Optimized</p>
              </div>
            </div>
          </div>
            
          {/* Savings Display - Modern clean style */}
          {tokenReduction > 0 ? (
            <div className="w-full mt-8">
              <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-tokun font-bold text-3xl">{reductionPercentage}</span>
                    <Percent className="h-6 w-6 text-tokun ml-1" />
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent"></div>
                  <div>
                    <p className="text-lg font-medium text-tokun">{tokenReduction} tokens saved</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mt-8 text-center text-sm text-muted-foreground">
              Optimize your prompt to see token reduction statistics
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card to-secondary/30 border-none shadow-lg overflow-hidden group hover:shadow-tokun/10 transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-tokun/5 to-transparent">
          <CardTitle className="text-tokun text-xl flex items-center gap-3">
            <div className="p-2 bg-tokun/10 rounded-full">
              <Lightbulb className="h-6 w-6" />
            </div>
            AI-Powered Suggestions
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Smart recommendations to optimize your prompts and reduce token usage
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          {suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="group/item relative p-4 bg-gradient-to-r from-background to-secondary/20 rounded-lg border border-border/50 hover:border-tokun/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-tokun/10 rounded-full group-hover/item:bg-tokun/20 transition-colors">
                      <CheckCircle className="h-4 w-4 text-tokun" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed group-hover/item:text-tokun/90 transition-colors">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-tokun/0 via-tokun/0 to-tokun/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-tokun/5 to-transparent rounded-lg border border-tokun/20">
                <div className="flex items-center gap-2 text-sm text-tokun font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>{suggestions.length} optimization {suggestions.length === 1 ? 'tip' : 'tips'} available</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-tokun/10 to-tokun/5 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 text-tokun/60" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to Optimize</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Enter your prompt and click optimize to receive personalized suggestions for improving efficiency and reducing token usage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsPanel;
