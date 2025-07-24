
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, Heart, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PromptLibraryProps {
  onSelectPrompt?: (text: string) => void;
}

const PromptLibrary = ({ onSelectPrompt }: PromptLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", "Coding", "Designing", "Healthcare", "Marketing", "Writing", 
    "Business", "Education", "Finance", "Legal", "Research"
  ];

  const prompts = [
    // Coding Category
    {
      id: 1,
      title: "Code Review Assistant",
      description: "Get detailed code reviews with suggestions for improvement",
      category: "Coding",
      likes: 245,
      prompt: "Please review the following code and provide detailed feedback on code quality, potential bugs, performance improvements, and best practices. Include specific suggestions for refactoring if needed."
    },
    {
      id: 2,
      title: "Bug Debugging Helper",
      description: "Identify and fix bugs in your code efficiently",
      category: "Coding",
      likes: 189,
      prompt: "Help me debug this code issue. Analyze the error message, identify the root cause, and provide a step-by-step solution with corrected code."
    },
    {
      id: 3,
      title: "API Documentation Generator",
      description: "Create comprehensive API documentation",
      category: "Coding",
      likes: 156,
      prompt: "Generate detailed API documentation for the following endpoints. Include request/response examples, parameters, error codes, and usage examples."
    },
    {
      id: 4,
      title: "Database Query Optimizer",
      description: "Optimize SQL queries for better performance",
      category: "Coding",
      likes: 203,
      prompt: "Analyze this SQL query and suggest optimizations for better performance. Include indexing recommendations and alternative query structures."
    },
    {
      id: 5,
      title: "Unit Test Generator",
      description: "Generate comprehensive unit tests for your functions",
      category: "Coding",
      likes: 178,
      prompt: "Create comprehensive unit tests for the following function. Include edge cases, error handling, and mock scenarios."
    },

    // Designing Category
    {
      id: 6,
      title: "UI/UX Design Critic",
      description: "Get expert feedback on your design decisions",
      category: "Designing",
      likes: 167,
      prompt: "Evaluate this UI/UX design from usability, accessibility, and aesthetic perspectives. Provide specific improvement suggestions."
    },
    {
      id: 7,
      title: "Color Palette Generator",
      description: "Create harmonious color schemes for your projects",
      category: "Designing",
      likes: 142,
      prompt: "Generate a cohesive color palette for [project type] that evokes [mood/feeling]. Include hex codes and usage recommendations."
    },
    {
      id: 8,
      title: "Typography Advisor",
      description: "Get font pairing and typography recommendations",
      category: "Designing",
      likes: 198,
      prompt: "Recommend typography choices for [project type]. Include font pairings, hierarchy suggestions, and readability considerations."
    },
    {
      id: 9,
      title: "Design System Creator",
      description: "Build consistent design systems and style guides",
      category: "Designing",
      likes: 234,
      prompt: "Create a comprehensive design system for [project]. Include components, spacing, colors, typography, and usage guidelines."
    },
    {
      id: 10,
      title: "Wireframe Optimizer",
      description: "Improve wireframes for better user experience",
      category: "Designing",
      likes: 187,
      prompt: "Analyze this wireframe and suggest improvements for user flow, information architecture, and interaction design."
    },

    // Healthcare Category
    {
      id: 11,
      title: "Medical Research Summarizer",
      description: "Summarize complex medical research papers",
      category: "Healthcare",
      likes: 156,
      prompt: "Summarize this medical research paper in accessible language. Include key findings, methodology, and clinical implications."
    },
    {
      id: 12,
      title: "Patient Education Creator",
      description: "Create clear patient education materials",
      category: "Healthcare",
      likes: 143,
      prompt: "Create patient-friendly educational material about [medical condition]. Use simple language and include prevention/management tips."
    },
    {
      id: 13,
      title: "Healthcare Policy Analyzer",
      description: "Analyze healthcare policies and their implications",
      category: "Healthcare",
      likes: 128,
      prompt: "Analyze this healthcare policy proposal. Discuss potential impacts on patients, providers, and the healthcare system."
    },
    {
      id: 14,
      title: "Medical Case Study Helper",
      description: "Assist with medical case study analysis",
      category: "Healthcare",
      likes: 165,
      prompt: "Help analyze this medical case study. Identify key symptoms, differential diagnoses, and treatment considerations."
    },
    {
      id: 15,
      title: "Healthcare Data Interpreter",
      description: "Interpret healthcare statistics and trends",
      category: "Healthcare",
      likes: 134,
      prompt: "Interpret these healthcare statistics and identify trends, patterns, and implications for public health policy."
    },

    // Marketing Category
    {
      id: 16,
      title: "Social Media Strategy Planner",
      description: "Plan comprehensive social media marketing strategies",
      category: "Marketing",
      likes: 289,
      prompt: "Create a comprehensive social media strategy for [business/brand]. Include platform-specific content, posting schedule, and engagement tactics."
    },
    {
      id: 17,
      title: "Email Campaign Optimizer",
      description: "Optimize email marketing campaigns for better performance",
      category: "Marketing",
      likes: 234,
      prompt: "Optimize this email marketing campaign. Improve subject lines, content structure, call-to-actions, and personalization."
    },
    {
      id: 18,
      title: "Brand Voice Developer",
      description: "Develop consistent brand voice and messaging",
      category: "Marketing",
      likes: 198,
      prompt: "Develop a brand voice guide for [company]. Define tone, personality, messaging pillars, and communication examples."
    },
    {
      id: 19,
      title: "Customer Persona Creator",
      description: "Create detailed customer personas for targeting",
      category: "Marketing",
      likes: 267,
      prompt: "Create detailed customer personas for [product/service]. Include demographics, psychographics, pain points, and motivations."
    },
    {
      id: 20,
      title: "Content Marketing Strategist",
      description: "Develop content marketing strategies that convert",
      category: "Marketing",
      likes: 245,
      prompt: "Create a content marketing strategy for [industry/business]. Include content types, distribution channels, and measurement metrics."
    },

    // Writing Category
    {
      id: 21,
      title: "Creative Writing Enhancer",
      description: "Improve creative writing with expert feedback",
      category: "Writing",
      likes: 234,
      prompt: "Review this creative writing piece and provide feedback on character development, plot structure, dialogue, and prose style."
    },
    {
      id: 22,
      title: "Technical Writing Optimizer",
      description: "Make technical content clear and accessible",
      category: "Writing",
      likes: 189,
      prompt: "Optimize this technical content for clarity and accessibility. Improve structure, eliminate jargon, and enhance readability."
    },
    {
      id: 23,
      title: "Grant Proposal Writer",
      description: "Write compelling grant proposals that get funded",
      category: "Writing",
      likes: 156,
      prompt: "Help write a grant proposal for [project/organization]. Include compelling narrative, budget justification, and impact measurement."
    },
    {
      id: 24,
      title: "Academic Paper Assistant",
      description: "Improve academic writing and research papers",
      category: "Writing",
      likes: 167,
      prompt: "Review this academic paper for structure, argumentation, citation style, and clarity. Suggest improvements for publication readiness."
    },
    {
      id: 25,
      title: "Copywriting Optimizer",
      description: "Create persuasive copy that converts",
      category: "Writing",
      likes: 278,
      prompt: "Optimize this copy for conversion. Improve headlines, value propositions, call-to-actions, and persuasive elements."
    },

    // Business Category
    {
      id: 26,
      title: "Business Plan Developer",
      description: "Create comprehensive business plans",
      category: "Business",
      likes: 234,
      prompt: "Help develop a business plan for [business idea]. Include market analysis, financial projections, and growth strategies."
    },
    {
      id: 27,
      title: "SWOT Analysis Expert",
      description: "Conduct thorough SWOT analyses",
      category: "Business",
      likes: 198,
      prompt: "Conduct a SWOT analysis for [company/situation]. Identify strengths, weaknesses, opportunities, and threats with actionable insights."
    },
    {
      id: 28,
      title: "Market Research Analyst",
      description: "Analyze market trends and opportunities",
      category: "Business",
      likes: 167,
      prompt: "Analyze the market for [product/service]. Include market size, trends, competition, and opportunities."
    },
    {
      id: 29,
      title: "Financial Model Builder",
      description: "Build comprehensive financial models",
      category: "Business",
      likes: 145,
      prompt: "Create a financial model for [business scenario]. Include revenue projections, cost structure, and profitability analysis."
    },
    {
      id: 30,
      title: "Strategic Planning Advisor",
      description: "Develop strategic plans and roadmaps",
      category: "Business",
      likes: 189,
      prompt: "Develop a strategic plan for [organization/project]. Include objectives, initiatives, timeline, and success metrics."
    },

    // Education Category
    {
      id: 31,
      title: "Curriculum Designer",
      description: "Design effective educational curricula",
      category: "Education",
      likes: 156,
      prompt: "Design a curriculum for [subject/course]. Include learning objectives, modules, assessments, and teaching methodologies."
    },
    {
      id: 32,
      title: "Learning Assessment Creator",
      description: "Create comprehensive learning assessments",
      category: "Education",
      likes: 134,
      prompt: "Create assessment materials for [subject/topic]. Include various question types, rubrics, and evaluation criteria."
    },
    {
      id: 33,
      title: "Educational Content Simplifier",
      description: "Simplify complex topics for different age groups",
      category: "Education",
      likes: 178,
      prompt: "Simplify this complex topic for [target age group]. Use age-appropriate language, examples, and learning activities."
    },
    {
      id: 34,
      title: "Interactive Learning Designer",
      description: "Design engaging interactive learning experiences",
      category: "Education",
      likes: 167,
      prompt: "Design interactive learning activities for [subject]. Include hands-on exercises, group activities, and technology integration."
    },
    {
      id: 35,
      title: "Study Guide Creator",
      description: "Create comprehensive study guides and materials",
      category: "Education",
      likes: 145,
      prompt: "Create a comprehensive study guide for [subject/exam]. Include key concepts, practice questions, and memory aids."
    },

    // Finance Category
    {
      id: 36,
      title: "Investment Analysis Expert",
      description: "Analyze investment opportunities and risks",
      category: "Finance",
      likes: 198,
      prompt: "Analyze this investment opportunity. Include risk assessment, return projections, and recommendation with rationale."
    },
    {
      id: 37,
      title: "Budget Optimization Advisor",
      description: "Optimize personal and business budgets",
      category: "Finance",
      likes: 167,
      prompt: "Analyze this budget and provide optimization recommendations. Include cost reduction strategies and savings opportunities."
    },
    {
      id: 38,
      title: "Financial Risk Assessor",
      description: "Assess and mitigate financial risks",
      category: "Finance",
      likes: 156,
      prompt: "Assess financial risks for [scenario/organization]. Identify potential risks, probability, impact, and mitigation strategies."
    },
    {
      id: 39,
      title: "Tax Strategy Planner",
      description: "Develop tax-efficient strategies",
      category: "Finance",
      likes: 134,
      prompt: "Develop tax optimization strategies for [situation]. Include legal methods to minimize tax liability and maximize savings."
    },
    {
      id: 40,
      title: "Financial Report Analyzer",
      description: "Analyze financial statements and reports",
      category: "Finance",
      likes: 189,
      prompt: "Analyze these financial statements. Identify trends, ratios, strengths, weaknesses, and investment implications."
    },

    // Legal Category
    {
      id: 41,
      title: "Contract Review Assistant",
      description: "Review contracts for key terms and risks",
      category: "Legal",
      likes: 178,
      prompt: "Review this contract and identify key terms, potential risks, unclear clauses, and areas for negotiation."
    },
    {
      id: 42,
      title: "Legal Research Helper",
      description: "Assist with legal research and case analysis",
      category: "Legal",
      likes: 156,
      prompt: "Help research legal precedents for [legal issue]. Find relevant cases, statutes, and legal principles."
    },
    {
      id: 43,
      title: "Compliance Checker",
      description: "Check compliance with regulations and laws",
      category: "Legal",
      likes: 134,
      prompt: "Check compliance with [relevant regulations] for [business/situation]. Identify gaps and provide recommendations."
    },
    {
      id: 44,
      title: "Legal Document Drafter",
      description: "Draft legal documents and agreements",
      category: "Legal",
      likes: 167,
      prompt: "Draft a [type of legal document] that addresses [specific needs]. Include necessary clauses and protective language."
    },
    {
      id: 45,
      title: "Intellectual Property Advisor",
      description: "Advise on intellectual property matters",
      category: "Legal",
      likes: 145,
      prompt: "Analyze intellectual property considerations for [situation]. Include protection strategies and potential conflicts."
    },

    // Research Category
    {
      id: 46,
      title: "Literature Review Compiler",
      description: "Compile comprehensive literature reviews",
      category: "Research",
      likes: 198,
      prompt: "Compile a literature review on [research topic]. Include key studies, methodology comparison, and research gaps."
    },
    {
      id: 47,
      title: "Research Methodology Designer",
      description: "Design robust research methodologies",
      category: "Research",
      likes: 167,
      prompt: "Design a research methodology for [research question]. Include approach, data collection, analysis methods, and limitations."
    },
    {
      id: 48,
      title: "Data Analysis Interpreter",
      description: "Interpret research data and findings",
      category: "Research",
      likes: 156,
      prompt: "Interpret these research findings. Analyze statistical significance, practical implications, and future research directions."
    },
    {
      id: 49,
      title: "Survey Designer",
      description: "Design effective surveys and questionnaires",
      category: "Research",
      likes: 134,
      prompt: "Design a survey for [research objective]. Include question types, scale design, and bias minimization strategies."
    },
    {
      id: 50,
      title: "Research Proposal Writer",
      description: "Write compelling research proposals",
      category: "Research",
      likes: 189,
      prompt: "Write a research proposal for [topic]. Include background, objectives, methodology, timeline, and expected outcomes."
    }
  ];

  const filteredPrompts = selectedCategory === "All" 
    ? prompts 
    : prompts.filter(prompt => prompt.category === selectedCategory);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard"
    });
  };

  const selectPrompt = (text: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(text);
      toast({
        title: "Prompt selected",
        description: "The prompt has been loaded into the optimizer"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-tokun mb-2">Prompt Library</h2>
        <p className="text-muted-foreground">Curated collection of high-quality prompts for various use cases</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-tokun hover:bg-tokun/80" : ""}
          >
            <Filter className="h-3 w-3 mr-1" />
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
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
              <div className="bg-secondary/30 p-3 rounded-lg mb-4 max-h-24 overflow-y-auto">
                <p className="text-sm text-muted-foreground italic">{prompt.prompt}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">{prompt.likes}</span>
                  </div>
                </div>
                <BookOpen className="h-4 w-4 text-tokun" />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => copyToClipboard(prompt.prompt)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  className="flex-1 bg-tokun hover:bg-tokun/80"
                  onClick={() => selectPrompt(prompt.prompt)}
                >
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptLibrary;
