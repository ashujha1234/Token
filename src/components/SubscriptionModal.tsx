
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building, User } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const [planType, setPlanType] = useState<"individual" | "business">("individual");
  
  const individualPlans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "month",
      features: [
        "1,000 optimizations per month",
        "Standard optimization quality",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "month",
      features: [
        "10,000 optimizations per month",
        "Advanced optimization quality",
        "Priority support",
        "Custom suggestions",
      ],
      popular: true,
    }
  ];
  
  const businessPlans = [
    {
      name: "Team",
      price: "$49.99",
      period: "month",
      features: [
        "25,000 optimizations per month",
        "Advanced optimization quality",
        "Priority support",
        "Custom suggestions",
        "5 team members",
      ],
      popular: false,
    },
    {
      name: "Business",
      price: "$99.99",
      period: "month",
      features: [
        "100,000 optimizations per month",
        "Advanced optimization quality",
        "24/7 priority support",
        "Custom suggestions",
        "20 team members",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited optimizations",
        "Advanced optimization quality",
        "24/7 dedicated support",
        "Custom suggestions",
        "Unlimited team members",
        "API access",
        "Custom integration",
      ],
      popular: false,
    }
  ];

  const renderPlans = (plans: typeof individualPlans) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      {plans.map((plan) => (
        <Card key={plan.name} className={`border transition-all hover:shadow-lg ${plan.popular ? 'border-tokun shadow-tokun/20' : 'border-border'}`}>
          <CardHeader>
            {plan.popular && (
              <Badge className="w-fit mb-2 bg-tokun">Popular</Badge>
            )}
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground ml-1">/{plan.period}</span>}
            </div>
          </CardHeader>
          <CardContent className="h-64 overflow-auto">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-tokun flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${plan.popular ? "bg-tokun hover:bg-tokun/80" : ""}`}
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.name === "Enterprise" ? "Contact Sales" : "Subscribe"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-tokun">Subscription Plans</DialogTitle>
          <DialogDescription>
            Choose the plan that works best for your token optimization needs
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="individual" value={planType} onValueChange={(v) => setPlanType(v as "individual" | "business")}>
          <div className="flex justify-center mb-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <User size={16} />
                <span>Individual</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building size={16} />
                <span>Business</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="individual">
            {renderPlans(individualPlans)}
          </TabsContent>
          
          <TabsContent value="business">
            {renderPlans(businessPlans)}
          </TabsContent>
        </Tabs>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          All plans include a 7-day free trial. No credit card required.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
