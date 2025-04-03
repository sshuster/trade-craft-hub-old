
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/ItemCard";
import { getUserItems, Item, mockItems } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Search, 
  Package, 
  Heart, 
  MessageSquare, 
  Settings, 
  BarChart
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Sample chart data
const activityData = [
  { name: 'Jan', views: 40, inquiries: 24, sales: 10 },
  { name: 'Feb', views: 30, inquiries: 13, sales: 5 },
  { name: 'Mar', views: 20, inquiries: 8, sales: 3 },
  { name: 'Apr', views: 27, inquiries: 15, sales: 7 },
  { name: 'May', views: 18, inquiries: 10, sales: 4 },
  { name: 'Jun', views: 23, inquiries: 12, sales: 6 },
  { name: 'Jul', views: 34, inquiries: 20, sales: 9 },
  { name: 'Aug', views: 45, inquiries: 25, sales: 12 },
  { name: 'Sep', views: 65, inquiries: 35, sales: 18 },
  { name: 'Oct', views: 50, inquiries: 28, sales: 15 },
  { name: 'Nov', views: 43, inquiries: 22, sales: 11 },
  { name: 'Dec', views: 38, inquiries: 19, sales: 8 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 28 },
  { name: 'Home & Garden', value: 18 },
  { name: 'Sports', value: 12 },
  { name: 'Books', value: 7 },
];

interface NewItemForm {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<NewItemForm>({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  // AG-Grid column definitions
  const columnDefs = [
    { headerName: 'Title', field: 'title', sortable: true, filter: true },
    { headerName: 'Category', field: 'category', sortable: true, filter: true },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, valueFormatter: (params: any) => `$${params.value.toFixed(2)}` },
    { headerName: 'Condition', field: 'condition', sortable: true, filter: true },
    { headerName: 'Date', field: 'createdAt', sortable: true, filter: true, valueFormatter: (params: any) => new Date(params.value).toLocaleDateString() }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Get the user's items
    const items = getUserItems(user.id);
    setUserItems(items);
    setFilteredItems(items);
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(userItems);
    } else {
      const filtered = userItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, userItems]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate form
    if (!formValues.title || !formValues.description || !formValues.price || 
        !formValues.category || !formValues.condition || !formValues.location) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }

    // Create new item
    const newItem: Item = {
      id: uuidv4(),
      userId: user.id,
      title: formValues.title,
      description: formValues.description,
      price: parseFloat(formValues.price),
      category: formValues.category,
      condition: formValues.condition as any,
      location: formValues.location,
      images: ["/placeholder.svg"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to both mock data and local state
    mockItems.push(newItem);
    setUserItems(prev => [...prev, newItem]);
    setFilteredItems(prev => [...prev, newItem]);

    // Reset form and close dialog
    setFormValues({
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      location: "",
    });
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: "Your item has been listed",
    });
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.username}! Manage your listings and track your activity.
            </p>
          </div>
          <div className="flex gap-3 self-end md:self-start">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Listing</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to list your item for sale.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Title of your item"
                        value={formValues.title}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your item in detail"
                        rows={4}
                        value={formValues.description}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formValues.price}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("category", value)}
                          value={formValues.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Vehicles">Vehicles</SelectItem>
                            <SelectItem value="Books">Books</SelectItem>
                            <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
                            <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                            <SelectItem value="Art & Collectibles">Art & Collectibles</SelectItem>
                            <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                            <SelectItem value="Tools & Equipment">Tools & Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("condition", value)}
                          value={formValues.condition}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="City, State"
                          value={formValues.location}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Images</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <p className="text-muted-foreground">
                          Drag & drop images here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          (This is a demo - image upload is not functional)
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Listing</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search listings..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="listings" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              Saved Items
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Listed Items</h2>
              
              {/* AG-Grid Table View */}
              <div className="ag-theme-alpine w-full h-[400px] mb-8">
                <AgGridReact
                  rowData={filteredItems}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
              
              {/* Card View */}
              <h3 className="text-lg font-medium mb-4">Card View</h3>
              {filteredItems.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-8">
                  <div className="text-center space-y-3">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto" />
                    <h3 className="font-medium text-lg">No listings found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? "No items match your search criteria. Try a different search."
                        : "You haven't listed any items for sale yet."}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Listing
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>Views, inquiries and sales data for your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={activityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="views" stackId="1" stroke="#0f766e" fill="#0f766e" />
                        <Area type="monotone" dataKey="inquiries" stackId="2" stroke="#f59e0b" fill="#f59e0b" />
                        <Area type="monotone" dataKey="sales" stackId="3" stroke="#10b981" fill="#10b981" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Performance by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={categoryData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0f766e" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">189</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">43</div>
                  <p className="text-xs text-muted-foreground">
                    +7.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.1%</div>
                  <p className="text-xs text-muted-foreground">
                    +1.2% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Heart className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium text-lg">No saved items yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  When you save items you're interested in, they'll appear here for easy access.
                </p>
                <Button onClick={() => navigate("/browse")}>Browse Items</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium text-lg">No messages yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  When you communicate with other users about items, your conversations will appear here.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user.username} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value="********" disabled />
                </div>
                <p className="text-xs text-muted-foreground">
                  (This is a demo - account settings cannot be changed)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
