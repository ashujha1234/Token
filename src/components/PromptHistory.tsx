
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, Calendar, DollarSign, Upload, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const PromptHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load purchase history
    const purchases = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    setPurchaseHistory(purchases);

    // Load upload history
    const uploads = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    setUploadHistory(uploads);
  }, []);

  const downloadPrompt = (prompt: any) => {
    const element = document.createElement("a");
    const file = new Blob([prompt.promptText || prompt.fullPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `${prompt.title} has been downloaded`
    });
  };

  const deleteUpload = (promptId: string) => {
    const updatedUploads = uploadHistory.filter(prompt => prompt.id !== promptId);
    setUploadHistory(updatedUploads);
    localStorage.setItem('uploadHistory', JSON.stringify(updatedUploads));

    // Also remove from marketplace
    const marketplace = JSON.parse(localStorage.getItem('promptsForSale') || '[]');
    const updatedMarketplace = marketplace.filter((prompt: any) => prompt.id !== promptId);
    localStorage.setItem('promptsForSale', JSON.stringify(updatedMarketplace));

    toast({
      title: "Prompt Removed",
      description: "Your prompt has been removed from the marketplace"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-tokun mb-2">Prompt History</h2>
        <p className="text-muted-foreground">Track your purchased and uploaded prompts</p>
      </div>

      <Tabs defaultValue="purchased" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchased" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Purchased ({purchaseHistory.length})
          </TabsTrigger>
          <TabsTrigger value="uploaded" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Uploaded ({uploadHistory.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchased" className="space-y-4">
          {purchaseHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No purchased prompts yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Visit the marketplace to discover and purchase prompts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {purchaseHistory.map((prompt) => (
                <Card key={prompt.id} className="bg-card border-border/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">{prompt.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary">{prompt.category}</Badge>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-tokun" />
                          <span className="font-bold text-tokun">{prompt.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Purchased: {formatDate(prompt.purchasedAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadPrompt(prompt)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Full
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="uploaded" className="space-y-4">
          {uploadHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No uploaded prompts yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your first prompt to share with the community
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {uploadHistory.map((prompt) => (
                <Card key={prompt.id} className="bg-card border-border/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">{prompt.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary">{prompt.category}</Badge>
                        <div className="flex items-center gap-1">
                          {prompt.isFree ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 text-tokun" />
                              <span className="font-bold text-tokun">{prompt.price}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Uploaded: {formatDate(prompt.uploadedAt || prompt.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Sales: {prompt.sales || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadPrompt(prompt)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteUpload(prompt.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptHistory;
