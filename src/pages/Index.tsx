
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ItemCard } from "@/components/ItemCard";
import { categories, mockItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, ThumbsUp, ShieldCheck, Clock, RefreshCw } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const featuredItems = mockItems.slice(0, 4); // Just get a few items for the homepage

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Popular Categories</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Browse through our most popular categories to find exactly what you're looking for.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-secondary/10 transition-colors"
                  onClick={() => navigate(`/browse?category=${category}`)}
                >
                  <span className="text-lg font-medium">{category}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate("/browse")}
                className="group"
              >
                View All Categories 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Featured Items</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Discover our handpicked selection of high-quality items from trusted sellers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button 
                onClick={() => navigate("/browse")}
                className="group"
              >
                Explore All Items 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Trading on TradeCraftHub is simple and secure. Follow these steps to get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium">Find Items</h3>
                <p className="text-sm text-muted-foreground">
                  Browse or search for items you're interested in purchasing.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium">Make an Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Contact the seller and negotiate the price if needed.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium">Secure Transaction</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the purchase using our secure payment methods.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium">Sell Your Items</h3>
                <p className="text-sm text-muted-foreground">
                  List your own items and start selling to our community.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button onClick={() => navigate("/register")}>
                Get Started Now
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight">Ready to Start Trading?</h2>
                <p className="max-w-[600px]">
                  Join thousands of satisfied users who are buying and selling on TradeCraftHub every day.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate("/pricing")}
                >
                  View Pricing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
