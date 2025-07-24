
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, User, Mail, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseComplete?: (promptId: number) => void;
  prompt: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
  } | null;
}

const PurchaseDialog = ({ open, onOpenChange, prompt, onPurchaseComplete }: PurchaseDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchase = () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required payment details",
        variant: "destructive"
      });
      return;
    }

    // Simulate purchase process
    toast({
      title: "Processing Purchase",
      description: "Your payment is being processed..."
    });

    setTimeout(() => {
      if (prompt && onPurchaseComplete) {
        onPurchaseComplete(prompt.id);
      }
      onOpenChange(false);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        address: "",
        city: "",
        zipCode: ""
      });
    }, 2000);
  };

  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-tokun">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're purchasing "{prompt.title}" for ${prompt.price}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary/30 p-3 rounded-lg">
            <h4 className="font-medium text-sm">{prompt.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-tokun font-bold">${prompt.price}</span>
              <span className="text-xs bg-secondary px-2 py-1 rounded">{prompt.category}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-tokun" />
              Personal Information
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-tokun" />
              Payment Details
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-xs">Card Number *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiryDate" className="text-xs">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-xs">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-tokun" />
              Billing Address
            </div>

            <div>
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city" className="text-xs">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-xs">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePurchase} className="flex-1 bg-tokun hover:bg-tokun/80">
              Purchase ${prompt.price}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
