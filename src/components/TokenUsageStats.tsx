
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TokenUsageStatsProps {
  totalTokens: number;
  tokenLimit: number;
}

const TokenUsageStats = ({ totalTokens, tokenLimit }: TokenUsageStatsProps) => {
  const tokensLeft = tokenLimit - totalTokens;
  const isLowTokens = tokensLeft <= 10000;
  
  return (
    <Card className="bg-card border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
          <Info className="h-5 w-5" />
          Total Token Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-sm text-muted-foreground">Used</p>
              <p className="text-2xl font-bold text-tokun">{totalTokens.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Limit</p>
              <p className="text-2xl font-bold">{tokenLimit.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-full h-2 bg-secondary mt-4 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isLowTokens ? 'bg-red-500' : 'bg-tokun'}`}
              style={{ width: `${Math.min(100, (totalTokens / tokenLimit) * 100)}%` }}
            />
          </div>
          
          <p className="text-sm mt-2 text-muted-foreground">
            {tokensLeft.toLocaleString()} tokens remaining
          </p>
          
          {isLowTokens && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription className="text-xs">
                Warning: You have less than 10,000 tokens left
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsageStats;
