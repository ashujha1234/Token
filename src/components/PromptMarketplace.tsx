
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, DollarSign, Eye, Play, Pause, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PurchaseDialog from "./PurchaseDialog";

const PromptMarketplace = () => {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [purchasedPrompts, setPurchasedPrompts] = useState<number[]>([]);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const marketplacePrompts = [
    {
      id: 1,
      title: "E-commerce Product Description Generator",
      description: "Generate compelling product descriptions that convert visitors into customers",
      price: 4.99,
      rating: 4.8,
      downloads: 1234,
      category: "Marketing",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      preview: "Create an engaging product description for [product name] that highlights key features...",
      fullPrompt: "Create an engaging product description for [product name] that highlights key features and benefits. Include emotional triggers, technical specifications, and compelling call-to-action. Format the description with bullet points for easy scanning and ensure it's optimized for both search engines and conversion. Consider the target audience demographics and purchasing motivations when crafting the tone and messaging."
    },
    {
      id: 2,
      title: "Social Media Content Planner",
      description: "Plan and create engaging social media posts across all platforms",
      price: 7.99,
      rating: 4.9,
      downloads: 856,
      category: "Social Media",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      preview: "Generate a week's worth of social media posts for [brand/business] focusing on...",
      fullPrompt: "Generate a week's worth of social media posts for [brand/business] focusing on [topic/theme]. Create content for Instagram, Facebook, Twitter, and LinkedIn with platform-specific optimizations. Include hashtag strategies, posting times, engagement tactics, and cross-promotion opportunities. Ensure brand consistency while adapting tone for each platform's audience expectations."
    },
    {
      id: 3,
      title: "Blog Article Outline Creator",
      description: "Create comprehensive blog article outlines with SEO optimization",
      price: 3.99,
      rating: 4.7,
      downloads: 2341,
      category: "Content",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      preview: "Create a detailed blog outline for '[topic]' targeting '[audience]' with SEO...",
      fullPrompt: "Create a detailed blog outline for '[topic]' targeting '[audience]' with SEO keywords '[keywords]'. Structure should include compelling headline, introduction hook, 5-7 main sections with subsections, conclusion with call-to-action, and meta description. Include keyword density recommendations, internal linking opportunities, and suggested word count for each section."
    },
    {
      id: 4,
      title: "Email Marketing Campaign",
      description: "Design effective email marketing campaigns that drive engagement",
      price: 6.99,
      rating: 4.6,
      downloads: 743,
      category: "Marketing",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      preview: "Create a 5-email welcome sequence for [business type] targeting...",
      fullPrompt: "Create a 5-email welcome sequence for [business type] targeting [customer segment]. Include subject lines, personalization tokens, value propositions, social proof elements, and clear CTAs. Design email templates that are mobile-responsive and include A/B testing suggestions for optimization. Provide timing recommendations and segmentation strategies."
    }
  ];

  const handleVideoPlay = (promptId: number) => {
    setPlayingVideo(playingVideo === promptId ? null : promptId);
  };

  const handlePreview = (prompt: any) => {
    if (purchasedPrompts.includes(prompt.id)) {
      toast({
        title: "Full Prompt Access",
        description: `You have full access to "${prompt.title}"`
      });
    } else {
      toast({
        title: "Preview Mode",
        description: `Showing preview for "${prompt.title}". Purchase to see full prompt.`
      });
    }
  };

  const handlePurchase = (prompt: any) => {
    setSelectedPrompt(prompt);
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseComplete = (promptId: number) => {
    setPurchasedPrompts(prev => [...prev, promptId]);
    toast({
      title: "Purchase Successful!",
      description: "You now have full access to this prompt."
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-tokun mb-2">Prompt Marketplace</h2>
        <p className="text-muted-foreground">Discover and purchase premium prompts created by experts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketplacePrompts.map((prompt) => (
          <Card key={prompt.id} className="bg-card border-border/50 hover:border-tokun/30 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground mb-2">{prompt.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{prompt.description}</p>
                </div>
                <Badge variant="secondary" className="ml-2">{prompt.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Video Reel Section */}
              <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
                <video
                  className="w-full h-48 object-cover"
                  src={prompt.videoUrl}
                  loop
                  muted
                  playsInline
                  ref={(video) => {
                    if (video) {
                      if (playingVideo === prompt.id) {
                        video.play();
                      } else {
                        video.pause();
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                    onClick={() => handleVideoPlay(prompt.id)}
                  >
                    {playingVideo === prompt.id ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  0:20
                </div>
              </div>

              {/* Prompt Preview Section */}
              <div className="bg-secondary/30 p-3 rounded-lg mb-4 max-h-24 overflow-y-auto relative">
                {purchasedPrompts.includes(prompt.id) ? (
                  <p className="text-sm text-foreground">{prompt.fullPrompt}</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground italic">{prompt.preview}</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent flex items-end justify-center pb-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/90 px-2 py-1 rounded">
                        <Lock className="h-3 w-3" />
                        Purchase to unlock full prompt
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{prompt.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{prompt.downloads}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-tokun" />
                  <span className="text-lg font-bold text-tokun">{prompt.price}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handlePreview(prompt)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {purchasedPrompts.includes(prompt.id) ? "View Full" : "Preview"}
                </Button>
                {!purchasedPrompts.includes(prompt.id) ? (
                  <Button 
                    className="flex-1 bg-tokun hover:bg-tokun/80"
                    onClick={() => handlePurchase(prompt)}
                  >
                    Purchase
                  </Button>
                ) : (
                  <Button 
                    variant="secondary"
                    className="flex-1"
                    disabled
                  >
                    Owned
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PurchaseDialog 
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        prompt={selectedPrompt}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
};

export default PromptMarketplace;
