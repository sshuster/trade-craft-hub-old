
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { categories, mockItems, Item } from "@/lib/data";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Browse = () => {
  const location = useLocation();
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  const conditions = ["new", "like new", "good", "fair", "poor"];

  // Get any category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = [...mockItems];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply condition filter
    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Apply price range filter
    filtered = filtered.filter(
      item => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setItems(filtered);
  }, [searchTerm, selectedCategory, selectedCondition, priceRange, sortOption]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedCondition(null);
    setPriceRange([0, 2000]);
    setSortOption("newest");
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex flex-col space-y-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Browse Items</h1>
          <p className="text-muted-foreground">
            Discover unique items from sellers around the world
          </p>
          
          {/* Search and mobile filter toggle */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for items..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={toggleMobileFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Reset
              </Button>
            </div>
            
            <Accordion type="single" collapsible defaultValue="category">
              <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategory === category}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategory(category);
                            } else {
                              setSelectedCategory(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="condition">
                <AccordionTrigger>Condition</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`condition-${condition}`}
                          checked={selectedCondition === condition}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCondition(condition);
                            } else {
                              setSelectedCondition(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <Slider
                      min={0}
                      max={2000}
                      step={10}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Mobile Filters */}
          <div className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background p-6 transition-transform duration-300 ease-in-out md:hidden",
            isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </h2>
              <Button variant="ghost" size="icon" onClick={toggleMobileFilters}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-grow overflow-auto">
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategory(category);
                              } else {
                                setSelectedCategory(null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`mobile-category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="condition">
                  <AccordionTrigger>Condition</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-condition-${condition}`}
                            checked={selectedCondition === condition}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCondition(condition);
                              } else {
                                setSelectedCondition(null);
                              }
                            }}
                          />
                          <label
                            htmlFor={`mobile-condition-${condition}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <Slider
                        min={0}
                        max={2000}
                        step={10}
                        value={[priceRange[0], priceRange[1]]}
                        onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">${priceRange[0]}</span>
                        <span className="text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="pt-6 space-y-4 border-t">
              <Button className="w-full" onClick={toggleMobileFilters}>
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                clearFilters();
                toggleMobileFilters();
              }}>
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
                Showing {items.length} items
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="price-asc">Price: Low to high</SelectItem>
                    <SelectItem value="price-desc">Price: High to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Applied filters */}
            {(selectedCategory || selectedCondition || searchTerm || priceRange[0] > 0 || priceRange[1] < 2000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <div className="flex items-center bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                    <span>Category: {selectedCategory}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {selectedCondition && (
                  <div className="flex items-center bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                    <span>Condition: {selectedCondition}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => setSelectedCondition(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {searchTerm && (
                  <div className="flex items-center bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                    <span>Search: {searchTerm}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                  <div className="flex items-center bg-muted rounded-full pl-3 pr-1 py-1 text-sm">
                    <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => setPriceRange([0, 2000])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground text-xs"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-lg">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  We couldn't find any items matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
