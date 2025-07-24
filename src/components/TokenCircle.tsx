
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TokenCircleProps {
  tokens: number;
  maxTokens: number;
}

const TokenCircle = ({ tokens, maxTokens }: TokenCircleProps) => {
  const percentage = Math.min(100, (tokens / maxTokens) * 100);
  
  return (
    <div className="tokun-circle mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-b from-tokun/30 to-transparent rounded-full blur-xl animate-pulse-slow" />
      <div className="relative">
        <CircularProgressbar
          value={percentage}
          text={`${tokens}`}
          styles={buildStyles({
            textSize: '28px',
            pathColor: '#1EAEDB',
            textColor: '#1EAEDB',
            trailColor: 'rgba(30, 174, 219, 0.2)',
            strokeLinecap: 'round',
          })}
          className="drop-shadow-lg"
        />
        <div className="text-center mt-4">
          <p className="text-tokun text-2xl font-bold">TOKENS</p>
        </div>
      </div>
      
      {/* Efficiency info with improved spacing */}
      <div className="mt-8 text-center">
        <div className="text-xs text-muted-foreground bg-secondary/70 rounded-full py-1 px-3 max-w-max mx-auto backdrop-blur-sm">
          {percentage > 75 ? 
            "High token usage" : 
            percentage > 50 ? 
            "Moderate token usage" : 
            "Efficient token usage"
          }
        </div>
      </div>
    </div>
  );
};

export default TokenCircle;
