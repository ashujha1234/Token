
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X, DollarSign, Upload, Image, Video, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SellPromptModalProps {
  onPromptSubmitted: () => void;
}

const SellPromptModal = ({ onPromptSubmitted }: SellPromptModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  const categories = [
    "Coding", "Design", "UI/UX", "Writing", "Business", "Marketing", 
    "Education", "Entertainment", "Health & Wellness", "Finance", "Travel", "Technology"
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: "Only image and video files are allowed",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: "Files must be under 50MB",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    if (attachments.length + validFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 attachments allowed",
        variant: "destructive"
      });
      return;
    }
    
    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !promptText || !category || (!isFree && !price)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const promptForSale = {
      id: Date.now().toString(),
      title,
      description,
      promptText,
      category,
      price: isFree ? 0 : parseFloat(price),
      isFree,
      tags,
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file) // In a real app, files would be uploaded to cloud storage
      })),
      seller: "You", // In a real app, this would be the current user
      createdAt: new Date().toISOString(),
      sales: 0,
      rating: 0,
      type: 'uploaded' // Mark as uploaded by user
    };

    // Store in localStorage (in a real app, this would be sent to a backend)
    const existingPrompts = JSON.parse(localStorage.getItem('promptsForSale') || '[]');
    localStorage.setItem('promptsForSale', JSON.stringify([...existingPrompts, promptForSale]));

    // Also add to upload history
    const uploadHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    uploadHistory.push({
      ...promptForSale,
      uploadedAt: new Date().toISOString()
    });
    localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));

    toast({
      title: "Prompt Listed Successfully!",
      description: `Your prompt is now ${isFree ? 'available for free' : 'available for purchase'} in the marketplace`
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPromptText("");
    setCategory("");
    setPrice("");
    setIsFree(false);
    setTags([]);
    setAttachments([]);
    setOpen(false);
    onPromptSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <DollarSign className="h-4 w-4 mr-2" />
          Upload Your Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-tokun">Upload Your Prompt to Marketplace</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Advanced Code Review Prompt"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your prompt does and what makes it valuable..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prompt">Prompt Text *</Label>
            <Textarea
              id="prompt"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Enter your complete prompt here..."
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be the full prompt that buyers receive
            </p>
          </div>

          {/* Price or Free Toggle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="free-toggle"
                checked={isFree}
                onCheckedChange={setIsFree}
              />
              <Label htmlFor="free-toggle">Make this prompt free</Label>
            </div>
            
            {!isFree && (
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  required={!isFree}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Tags (max 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                disabled={tags.length >= 5}
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                disabled={tags.length >= 5 || !newTag.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <Label>Attachments (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload images or videos to showcase your prompt (max 5 files, 50MB each)
            </p>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-4">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={attachments.length >= 5}
              />
              <label 
                htmlFor="file-upload" 
                className={`cursor-pointer flex flex-col items-center gap-2 ${
                  attachments.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {attachments.length >= 5 
                    ? "Maximum files reached" 
                    : "Click to upload images or videos"
                  }
                </span>
              </label>
            </div>

            {/* Uploaded Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Video className="h-5 w-5 text-purple-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FileX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-tokun hover:bg-tokun/90">
              {isFree ? 'Upload Free Prompt' : 'List Prompt for Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SellPromptModal;
