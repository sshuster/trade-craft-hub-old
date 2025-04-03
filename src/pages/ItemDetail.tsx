
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getItemById, Item } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  MapPin,
  MessageSquare,
  Info,
  X,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [message, setMessage] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/browse");
      return;
    }

    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const fetchedItem = getItemById(id);
      if (fetchedItem) {
        setItem(fetchedItem);
      } else {
        toast({
          title: "Item Not Found",
          description: "The item you're looking for doesn't exist or has been removed",
          variant: "destructive"
        });
        navigate("/browse");
      }
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller",
    });
    setMessage("");
  };

  const handleSaveItem = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to save items",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Item Saved",
      description: "This item has been saved to your favorites",
    });
  };

  const handleShareItem = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    toast({
      title: "Link Copied",
      description: "The link to this item has been copied to your clipboard",
    });
  };

  const handleSubmitReport = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Report Reason Required",
        description: "Please provide a reason for your report",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Our team will review it shortly.",
    });
    setIsReportDialogOpen(false);
    setReportReason("");
  };

  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-60 bg-muted rounded"></div>
            <div className="h-80 w-full max-w-2xl bg-muted rounded"></div>
            <div className="h-20 w-full max-w-2xl bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item Images */}
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden border aspect-video bg-muted mb-4">
              <img
                src={item.images[0] || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square rounded overflow-hidden border bg-muted">
                  <img
                    src={item.images[i] || "/placeholder.svg"}
                    alt={`${item.title} - Image ${i+1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Item Details & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <Badge className="mb-2">{item.category}</Badge>
                <Badge variant="outline">{item.condition}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{item.title}</h1>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Posted on {formatDate(item.createdAt)}</span>
              </div>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item.location}</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {item.description}
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleSaveItem}>
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleShareItem}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="text-muted-foreground w-full text-sm"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Item
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Send Message to Seller</h3>
              <Textarea 
                placeholder="Hi, I'm interested in this item. Is it still available?"
                className="mb-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button 
                className="w-full"
                onClick={handleSendMessage}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Seller Info Section */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">About the Seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                {item.userId.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium">User #{item.userId}</h3>
                <p className="text-sm text-muted-foreground">Member since January 2023</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < 4 ? "text-yellow-400" : "text-gray-300"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-6.327 3.323a1 1 0 01-1.45-1.054l1.208-7.039-5.118-4.984a1 1 0 01.555-1.705l7.076-1.027 3.16-6.403a1 1 0 011.792 0l3.16 6.403 7.076 1.027a1 1 0 01.555 1.705l-5.118 4.984 1.208 7.039a1 1 0 01-1.45 1.054L10 15.585z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.0 out of 5</span>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                View Seller Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-12 border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Similar Items</h2>
            <Button variant="link" className="group" onClick={() => navigate("/browse")}>
              View All 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="h-40 bg-muted">
                  <img
                    src="/placeholder.svg"
                    alt="Similar item"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="font-medium truncate">Similar Item {i+1}</div>
                  <div className="text-primary font-semibold mt-1">
                    ${(Math.random() * 100 + 50).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Item Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Item</DialogTitle>
              <DialogDescription>
                Please let us know why you're reporting this item. This information will help us take appropriate action.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for reporting</label>
                <Textarea
                  placeholder="Please describe why you're reporting this item..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReport}>
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default ItemDetail;
