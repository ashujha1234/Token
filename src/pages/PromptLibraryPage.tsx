import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Code, Palette, TrendingUp, Video, FileText, Briefcase, Heart, ArrowLeft, Copy, Sparkles, BookOpen, Play, DollarSign, Calculator } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const PromptLibraryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: FileText, count: 250 },
    { name: "Coding", icon: Code, count: 55 },
    { name: "Design", icon: Palette, count: 42 },
    { name: "Marketing", icon: TrendingUp, count: 38 },
    { name: "Video Creation", icon: Video, count: 35 },
    { name: "Business", icon: Briefcase, count: 30 },
    { name: "Finance", icon: DollarSign, count: 25 },
    { name: "Education", icon: BookOpen, count: 25 },
  ];

  const prompts = [
    {
      id: 1,
      title: "React Component Generator",
      description: "Generate clean, reusable React components with TypeScript and modern patterns",
      category: "Coding",
      tags: ["React", "TypeScript", "Components"],
      likes: 234,
      uses: 1200,
      prompt: "Create a reusable React component with TypeScript that follows best practices for [component type]. Include proper props interface, error handling, and accessibility features."
    },
    {
      id: 2,
      title: "Brand Logo Design Brief",
      description: "Create comprehensive design briefs for stunning logo creation",
      category: "Design",
      tags: ["Logo", "Branding", "Creative"],
      likes: 189,
      uses: 890,
      prompt: "Design a comprehensive logo brief for [brand name] in [industry]. Include target audience, brand values, color preferences, style guidelines, and competitive analysis."
    },
    {
      id: 3,
      title: "Social Media Content Planner",
      description: "Plan engaging social media posts across all major platforms",
      category: "Marketing",
      tags: ["Social Media", "Content", "Strategy"],
      likes: 345,
      uses: 1500,
      prompt: "Create a week-long social media content plan for [brand] targeting [audience]. Include platform-specific posts, hashtags, optimal posting times, and engagement strategies."
    },
    {
      id: 4,
      title: "YouTube Script Writer",
      description: "Create engaging scripts for YouTube videos that retain viewers",
      category: "Video Creation",
      tags: ["YouTube", "Script", "Content"],
      likes: 278,
      uses: 1100,
      prompt: "Write a compelling YouTube script for [topic] that hooks viewers in the first 15 seconds. Include clear structure, call-to-actions, and subscriber engagement tactics."
    },
    {
      id: 5,
      title: "Business Plan Generator",
      description: "Generate comprehensive business plans and growth strategies",
      category: "Business",
      tags: ["Business", "Strategy", "Planning"],
      likes: 156,
      uses: 750,
      prompt: "Create a detailed business plan for [business idea] including market analysis, financial projections, marketing strategy, and growth milestones for the next 3 years."
    },
    {
      id: 6,
      title: "API Documentation Writer",
      description: "Create clear and comprehensive API documentation",
      category: "Coding",
      tags: ["API", "Documentation", "Technical"],
      likes: 201,
      uses: 980,
      prompt: "Generate comprehensive API documentation for [API name]. Include endpoint descriptions, request/response examples, authentication methods, and error handling."
    },
    {
      id: 7,
      title: "UI/UX Design System",
      description: "Build comprehensive design systems for consistent interfaces",
      category: "Design",
      tags: ["Design System", "UI/UX", "Components"],
      likes: 167,
      uses: 823,
      prompt: "Create a complete design system for [product type]. Include color palettes, typography scale, component library, spacing guidelines, and usage documentation."
    },
    {
      id: 8,
      title: "Email Marketing Campaign",
      description: "Design high-converting email marketing sequences",
      category: "Marketing",
      tags: ["Email", "Marketing", "Conversion"],
      likes: 298,
      uses: 1345,
      prompt: "Design a 5-email marketing sequence for [product/service]. Include subject lines, personalization, value propositions, and conversion-focused CTAs."
    },
    {
      id: 9,
      title: "Video Editing Workflow",
      description: "Optimize video editing processes for content creators",
      category: "Video Creation",
      tags: ["Editing", "Workflow", "Efficiency"],
      likes: 145,
      uses: 678,
      prompt: "Create an efficient video editing workflow for [content type]. Include pre-production planning, editing techniques, and post-production optimization strategies."
    },
    {
      id: 10,
      title: "Startup Pitch Deck",
      description: "Create compelling pitch decks that secure funding",
      category: "Business",
      tags: ["Pitch", "Startup", "Investment"],
      likes: 234,
      uses: 567,
      prompt: "Develop a 10-slide pitch deck for [startup idea]. Include problem statement, solution, market size, business model, and funding requirements with compelling storytelling."
    },
    {
      id: 11,
      title: "Python Data Analysis",
      description: "Perform comprehensive data analysis using Python",
      category: "Coding",
      tags: ["Python", "Data", "Analysis"],
      likes: 187,
      uses: 934,
      prompt: "Create a Python script for analyzing [data type]. Include data cleaning, visualization, statistical analysis, and actionable insights generation."
    },
    {
      id: 12,
      title: "Mobile App UI Design",
      description: "Design intuitive mobile app interfaces",
      category: "Design",
      tags: ["Mobile", "App", "Interface"],
      likes: 156,
      uses: 712,
      prompt: "Design a mobile app interface for [app type]. Include user journey mapping, wireframes, visual design, and interaction patterns for iOS and Android."
    },
    {
      id: 13,
      title: "Content Marketing Strategy",
      description: "Develop comprehensive content marketing strategies",
      category: "Marketing",
      tags: ["Content", "Strategy", "Growth"],
      likes: 267,
      uses: 1234,
      prompt: "Create a content marketing strategy for [industry/niche]. Include content calendar, distribution channels, SEO optimization, and performance metrics."
    },
    {
      id: 14,
      title: "Podcast Production Guide",
      description: "Complete guide for professional podcast production",
      category: "Video Creation",
      tags: ["Podcast", "Audio", "Production"],
      likes: 134,
      uses: 456,
      prompt: "Create a comprehensive podcast production guide for [podcast theme]. Include equipment setup, recording techniques, editing workflow, and distribution strategy."
    },
    {
      id: 15,
      title: "Market Research Analysis",
      description: "Conduct thorough market research and competitive analysis",
      category: "Business",
      tags: ["Research", "Market", "Competition"],
      likes: 198,
      uses: 789,
      prompt: "Conduct market research for [product/service] in [market]. Include competitor analysis, target audience profiling, market sizing, and opportunity identification."
    },
    {
      id: 16,
      title: "Database Design Schema",
      description: "Design efficient database schemas and relationships",
      category: "Coding",
      tags: ["Database", "Schema", "SQL"],
      likes: 145,
      uses: 623,
      prompt: "Design a database schema for [application type]. Include table structures, relationships, indexes, and optimization strategies for performance and scalability."
    },
    {
      id: 17,
      title: "Brand Identity Package",
      description: "Create complete brand identity systems",
      category: "Design",
      tags: ["Branding", "Identity", "Visual"],
      likes: 223,
      uses: 891,
      prompt: "Develop a complete brand identity for [brand name]. Include logo variations, color palette, typography, brand guidelines, and application examples."
    },
    {
      id: 18,
      title: "SEO Content Optimization",
      description: "Optimize content for search engines and users",
      category: "Marketing",
      tags: ["SEO", "Content", "Optimization"],
      likes: 189,
      uses: 1067,
      prompt: "Optimize content for [target keywords] while maintaining readability. Include on-page SEO elements, meta descriptions, header structure, and internal linking strategy."
    },
    {
      id: 19,
      title: "Animation Storyboard",
      description: "Create detailed storyboards for animations and videos",
      category: "Video Creation",
      tags: ["Animation", "Storyboard", "Visual"],
      likes: 167,
      uses: 534,
      prompt: "Create a detailed storyboard for [animation/video concept]. Include scene descriptions, camera angles, timing, transitions, and visual style notes."
    },
    {
      id: 20,
      title: "Financial Model Builder",
      description: "Build comprehensive financial models and projections",
      category: "Business",
      tags: ["Finance", "Modeling", "Projections"],
      likes: 156,
      uses: 445,
      prompt: "Build a financial model for [business type]. Include revenue projections, cost structure, cash flow analysis, and scenario planning for 3-5 years."
    },
    {
      id: 6,
      title: "Investment Analysis Expert",
      description: "Analyze investment opportunities with detailed risk assessment",
      category: "Finance",
      tags: ["Investment", "Analysis", "Risk"],
      likes: 198,
      uses: 820,
      prompt: "Analyze this investment opportunity for [asset/stock]. Include risk assessment, return projections, market analysis, and detailed recommendation with supporting rationale."
    },
    {
      id: 7,
      title: "Personal Budget Optimizer",
      description: "Create and optimize personal budgets for better financial health",
      category: "Finance",
      tags: ["Budget", "Personal Finance", "Optimization"],
      likes: 167,
      uses: 950,
      prompt: "Create a comprehensive personal budget for [income level] with [specific goals]. Include expense categories, savings targets, debt management, and optimization recommendations."
    },
    {
      id: 8,
      title: "Tax Strategy Planner",
      description: "Develop tax-efficient strategies for individuals and businesses",
      category: "Finance",
      tags: ["Tax", "Strategy", "Planning"],
      likes: 145,
      uses: 670,
      prompt: "Develop a tax optimization strategy for [situation]. Include legal deductions, tax-efficient investments, timing strategies, and compliance considerations."
    },
    {
      id: 9,
      title: "Financial Report Analyzer",
      description: "Analyze financial statements and provide actionable insights",
      category: "Finance",
      tags: ["Analysis", "Reports", "Financial Statements"],
      likes: 189,
      uses: 730,
      prompt: "Analyze these financial statements for [company/period]. Identify key trends, ratios, strengths, weaknesses, and provide investment or operational recommendations."
    },
    {
      id: 10,
      title: "Curriculum Designer",
      description: "Design comprehensive educational curricula for any subject",
      category: "Education",
      tags: ["Curriculum", "Learning", "Education"],
      likes: 156,
      uses: 680,
      prompt: "Design a comprehensive curriculum for [subject] targeting [grade level/audience]. Include learning objectives, lesson plans, assessments, and progression milestones."
    },
    {
      id: 11,
      title: "Interactive Quiz Creator",
      description: "Create engaging quizzes and assessments for learning",
      category: "Education",
      tags: ["Quiz", "Assessment", "Interactive"],
      likes: 143,
      uses: 590,
      prompt: "Create an interactive quiz for [subject/topic] with [number] questions. Include multiple choice, true/false, and short answer formats with detailed explanations."
    },
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `"${title}" prompt has been copied successfully`
    });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Full-width Hero Video Banner */}
      <div className="relative w-screen h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
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
                <BookOpen className="h-16 w-16 text-tokun" />
              </div>
              <h1 className="text-8xl font-bold bg-gradient-to-r from-white via-tokun to-white bg-clip-text text-transparent">
                Prompt Library
              </h1>
              <div className="p-4 rounded-full bg-tokun/20 backdrop-blur-sm border border-tokun/30">
                <Sparkles className="h-16 w-16 text-tokun animate-pulse" />
              </div>
            </div>
            <p className="text-3xl text-white/90 mb-12 leading-relaxed font-light max-w-4xl mx-auto">
              Discover our curated collection of high-quality prompts designed to enhance your AI interactions
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Button size="lg" className="bg-tokun hover:bg-tokun/80 text-white text-xl px-12 py-6 h-auto rounded-full shadow-2xl shadow-tokun/30 border border-tokun/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <BookOpen className="mr-3 h-6 w-6" />
                Explore Library
              </Button>
              <Button size="lg" variant="outline" className="text-white border-2 border-white/30 hover:bg-white/10 text-xl px-12 py-6 h-auto rounded-full backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <Play className="mr-3 h-6 w-6" />
                Watch Guide
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">250+</div>
                <div className="text-white/80 text-lg">Free Prompts</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">50K+</div>
                <div className="text-white/80 text-lg">Downloads</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-tokun mb-2">100%</div>
                <div className="text-white/80 text-lg">Free Access</div>
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

      <div className="container mx-auto px-6 py-16">
        {/* Search and Categories */}
        <div className="space-y-8 mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search prompts, categories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card/50 border-border/50 focus:border-tokun/50 rounded-xl"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 h-12 px-6 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-tokun text-white hover:bg-tokun/80 shadow-lg shadow-tokun/25"
                      : "hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground text-lg">
            Showing {filteredPrompts.length} prompts
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="bg-card/50 border-border/30 hover:border-tokun/40 transition-all duration-300 hover:shadow-xl hover:shadow-tokun/10 backdrop-blur-sm rounded-xl h-80 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-tokun/10 text-tokun border-tokun/20">
                    {prompt.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{prompt.likes}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground leading-tight">{prompt.title}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{prompt.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-background/50 border-border/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {prompt.uses} uses
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-tokun/10 hover:text-tokun hover:border-tokun/30"
                    onClick={() => copyToClipboard(prompt.prompt, prompt.title)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-tokun hover:bg-tokun/80 text-white shadow-lg shadow-tokun/25"
                  >
                    Use Prompt
                  </Button>
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
    </div>
  );
};

export default PromptLibraryPage;
