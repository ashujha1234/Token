import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Star, Download, DollarSign, Eye, Play, Pause, Lock, ArrowLeft, Image as ImageIcon, Video, Sparkles, ShoppingBag, Expand, History, Calculator, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import PurchaseDialog from "@/components/PurchaseDialog";
import MediaEnlargeModal from "@/components/MediaEnlargeModal";
import SellPromptModal from "@/components/SellPromptModal";
import PromptHistory from "@/components/PromptHistory";

const PromptMarketplacePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showImages, setShowImages] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [purchasedPrompts, setPurchasedPrompts] = useState<number[]>([]);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [enlargeModalOpen, setEnlargeModalOpen] = useState(false);
  const [enlargeMedia, setEnlargeMedia] = useState<{ url: string; type: 'image' | 'video'; title: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const categories = [
    "All", "Marketing", "Content", "Social Media", "Business", "Creative", "Education", "Finance"
  ];

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
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
      preview: "Create an engaging product description for [product name]...",
      fullPrompt: "Create an engaging product description for [product name] that highlights key features and benefits..."
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
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
      preview: "Generate a week's worth of social media posts...",
      fullPrompt: "Generate a week's worth of social media posts for [brand/business]..."
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
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
      preview: "Create a detailed blog outline for '[topic]'...",
      fullPrompt: "Create a detailed blog outline for '[topic]' targeting '[audience]'..."
    },
    {
      id: 21,
      title: "Investment Portfolio Analyzer",
      description: "Analyze and optimize investment portfolios for maximum returns",
      price: 12.99,
      rating: 4.9,
      downloads: 567,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop",
      preview: "Analyze my investment portfolio with [holdings]...",
      fullPrompt: "Analyze my investment portfolio with [holdings] and current allocation. Provide detailed risk assessment, diversification recommendations, rebalancing strategies, and projected returns based on historical data and market conditions."
    },
    {
      id: 22,
      title: "Personal Finance Planner",
      description: "Create comprehensive personal financial plans and budgets",
      price: 8.99,
      rating: 4.7,
      downloads: 892,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
      preview: "Create a personal financial plan for [income level]...",
      fullPrompt: "Create a comprehensive personal financial plan for [income level] with goals of [financial goals]. Include budget breakdown, savings strategies, debt management, investment recommendations, and timeline to achieve financial objectives."
    },
    {
      id: 23,
      title: "Tax Optimization Strategies",
      description: "Develop tax-efficient strategies for individuals and businesses",
      price: 15.99,
      rating: 4.8,
      downloads: 423,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      imageUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400&h=400&fit=crop",
      preview: "Develop tax optimization strategies for [situation type]...",
      fullPrompt: "Develop comprehensive tax optimization strategies for [situation type] considering [income sources] and [deductions available]. Include legal tax minimization techniques, timing strategies, retirement planning impacts, and compliance requirements."
    },
    {
      id: 24,
      title: "Cryptocurrency Trading Guide",
      description: "Expert guidance for cryptocurrency trading and investment",
      price: 18.99,
      rating: 4.6,
      downloads: 678,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=400&fit=crop",
      preview: "Create a cryptocurrency trading strategy for [risk level]...",
      fullPrompt: "Create a comprehensive cryptocurrency trading strategy for [risk level] investor with [capital amount]. Include technical analysis techniques, risk management, portfolio allocation, market timing strategies, and regulatory considerations."
    },
    {
      id: 25,
      title: "Real Estate Investment Analyzer",
      description: "Analyze real estate investment opportunities and returns",
      price: 11.99,
      rating: 4.5,
      downloads: 334,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
      preview: "Analyze this real estate investment opportunity...",
      fullPrompt: "Analyze this real estate investment opportunity with [property details] and [market conditions]. Include cash flow analysis, ROI calculations, market comparisons, risk assessment, and long-term appreciation potential."
    },
    {
      id: 26,
      title: "Retirement Planning Calculator",
      description: "Plan and optimize retirement savings and income strategies",
      price: 9.99,
      rating: 4.8,
      downloads: 756,
      category: "Finance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop",
      preview: "Create a retirement plan for [age] looking to retire at [target age]...",
      fullPrompt: "Create a comprehensive retirement plan for [age] year old looking to retire at [target age]. Include savings targets, investment strategies, Social Security optimization, healthcare costs, and income replacement strategies."
    }
  ];

  const filteredPrompts = marketplacePrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoPlay = (promptId: number) => {
    setPlayingVideo(playingVideo === promptId ? null : promptId);
  };

  const handleEnlargeMedia = (prompt: any) => {
    setEnlargeMedia({
      url: showImages ? prompt.imageUrl : prompt.videoUrl,
      type: showImages ? 'image' : 'video',
      title: prompt.title
    });
    setEnlargeModalOpen(true);
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
    
    // Add to purchase history
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    const prompt = marketplacePrompts.find(p => p.id === promptId);
    if (prompt) {
      purchaseHistory.push({
        ...prompt,
        purchasedAt: new Date().toISOString()
      });
      localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
    }
    
    toast({
      title: "Purchase Successful!",
      description: "You now have full access to this prompt."
    });
  };

  const handlePromptSubmitted = () => {
    // Refresh the page or update the prompts list
    window.location.reload();
  };

  if (showHistory) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-6 py-8">
          <Header />
          
          <div className="flex items-center gap-4 mb-12">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 hover:bg-tokun/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
            <div className="h-6 w-px bg-border" />
          </div>

          <PromptHistory />
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Full-width Hero Video Banner */}
      <div className="relative w-screen h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Header positioned absolutely */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 py-8">
          <Header />
        </div>
        
        {/* Navigation positioned absolutely */}
        <div className="absolute top-24 left-6 z-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/app")}
              className="flex items-center gap-2 hover:bg-white/10 text-white border-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-6xl px-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 rounded-full bg-tokun/20 backdrop-blur-sm border border-tokun/30">
                <ShoppingBag className="h-16 w-16 text-tokun" />
              </div>
              <h1 className="text-8xl font-bold bg-gradient-to-r from-white via-tokun to-white bg-clip-text text-transparent animate-pulse-slow">
                Prompt Marketplace
              </h1>
              <div className="p-4 rounded-full bg-tokun/20 backdrop-blur-sm border border-tokun/30">
                <Sparkles className="h-16 w-16 text-tokun animate-pulse" />
              </div>
            </div>
            
            <p className="text-3xl text-white/90 mb-12 leading-relaxed font-light max-w-4xl mx-auto">
              Discover and purchase premium AI prompts created by experts from around the world. 
              Transform your ideas into reality with our curated collection.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-tokun hover:bg-tokun/80 text-white text-xl px-12 py-6 h-auto rounded-full shadow-2xl shadow-tokun/30 border border-tokun/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="mr-3 h-6 w-6" />
                Browse Prompts
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/30 hover:bg-white/10 text-xl px-12 py-6 h-auto rounded-full backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <Video className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">10,000+</div>
                <div className="text-white/80 text-lg">Premium Prompts</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">5,000+</div>
                <div className="text-white/80 text-lg">Happy Customers</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">98%</div>
                <div className="text-white/80 text-lg">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center text-white/60 animate-bounce">
            <div className="text-sm mb-2">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* History Button and Upload Button Section */}
        <div className="flex justify-between items-center mb-12">
          <Button
            variant="outline"
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
          >
            <History className="h-4 w-4" />
            Purchase History
          </Button>
          <SellPromptModal onPromptSubmitted={handlePromptSubmitted} />
        </div>

        {/* Search, Categories, and Toggle */}
        <div className="space-y-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search premium prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card/50 border-border/50 focus:border-tokun/50 rounded-xl"
              />
            </div>
            
            <div className="flex items-center space-x-4 bg-card/30 px-4 py-2 rounded-xl border border-border/30">
              <Video className="h-5 w-5 text-tokun" />
              <Switch
                id="media-toggle"
                checked={showImages}
                onCheckedChange={setShowImages}
              />
              <Label htmlFor="media-toggle" className="flex items-center gap-2 cursor-pointer">
                <ImageIcon className="h-5 w-5 text-tokun" />
                Images
              </Label>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`h-12 px-6 rounded-xl transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-tokun text-white hover:bg-tokun/80 shadow-lg shadow-tokun/25"
                    : "hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
                }`}
              >
                {category === "Finance" && <Calculator className="h-4 w-4 mr-2" />}
                {category === "Marketing" && <TrendingUp className="h-4 w-4 mr-2" />}
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground text-lg">
            Showing {filteredPrompts.length} premium prompts
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="bg-card/50 border-border/30 hover:border-tokun/40 transition-all duration-300 hover:shadow-xl hover:shadow-tokun/10 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-tokun/10 text-tokun border-tokun/20">
                    {prompt.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-tokun" />
                    <span className="text-lg font-bold text-tokun">{prompt.price}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground leading-tight">{prompt.title}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{prompt.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Media Section with Enlarge Button */}
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video group">
                  {showImages ? (
                    <img
                      src={prompt.imageUrl}
                      alt={prompt.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        className="w-full h-full object-cover"
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
                    </>
                  )}
                  
                  {/* Enlarge Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEnlargeMedia(prompt)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                </div>

                {/* Prompt Preview Section */}
                <div className="bg-secondary/30 p-3 rounded-lg max-h-20 overflow-y-auto relative">
                  {purchasedPrompts.includes(prompt.id) ? (
                    <p className="text-sm text-foreground">{prompt.fullPrompt}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground italic">{prompt.preview}</p>
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent flex items-end justify-center pb-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/90 px-2 py-1 rounded">
                          <Lock className="h-3 w-3" />
                          Purchase to unlock
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
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
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
                    onClick={() => handlePreview(prompt)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {purchasedPrompts.includes(prompt.id) ? "View Full" : "Preview"}
                  </Button>
                  {!purchasedPrompts.includes(prompt.id) ? (
                    <Button 
                      className="flex-1 bg-tokun hover:bg-tokun/80 text-white shadow-lg shadow-tokun/25"
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

        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-xl mb-4">No prompts found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <PurchaseDialog 
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        prompt={selectedPrompt}
        onPurchaseComplete={handlePurchaseComplete}
      />

      <MediaEnlargeModal
        isOpen={enlargeModalOpen}
        onClose={() => setEnlargeModalOpen(false)}
        mediaUrl={enlargeMedia?.url || ""}
        mediaType={enlargeMedia?.type || "image"}
        title={enlargeMedia?.title || ""}
      />
    </div>
  );
};

export default PromptMarketplacePage;
