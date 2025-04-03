
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/ItemCard";
import { mockItems, Item, mockUsers, User } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  Package, 
  Users, 
  Activity,
  Shield,
  AlertTriangle
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
import { toast } from "@/hooks/use-toast";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample activity data
const activityData = [
  { name: 'Jan', newUsers: 65, newListings: 120, flaggedItems: 4 },
  { name: 'Feb', newUsers: 59, newListings: 132, flaggedItems: 6 },
  { name: 'Mar', newUsers: 80, newListings: 167, flaggedItems: 8 },
  { name: 'Apr', newUsers: 81, newListings: 144, flaggedItems: 5 },
  { name: 'May', newUsers: 56, newListings: 98, flaggedItems: 3 },
  { name: 'Jun', newUsers: 55, newListings: 87, flaggedItems: 2 },
  { name: 'Jul', newUsers: 40, newListings: 76, flaggedItems: 1 },
  { name: 'Aug', newUsers: 50, newListings: 84, flaggedItems: 3 },
  { name: 'Sep', newUsers: 65, newListings: 97, flaggedItems: 4 },
  { name: 'Oct', newUsers: 70, newListings: 113, flaggedItems: 5 },
  { name: 'Nov', newUsers: 85, newListings: 140, flaggedItems: 7 },
  { name: 'Dec', newUsers: 90, newListings: 170, flaggedItems: 9 },
];

// Sample category data
const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home & Garden', value: 200 },
  { name: 'Sports', value: 150 },
  { name: 'Books', value: 100 },
];

// Sample user role data
const userRoleData = [
  { name: 'Regular Users', value: 85 },
  { name: 'Admins', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // AG-Grid column definitions for items
  const itemColumnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Title', field: 'title', sortable: true, filter: true },
    { headerName: 'User ID', field: 'userId', sortable: true, filter: true, width: 100 },
    { headerName: 'Category', field: 'category', sortable: true, filter: true },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, valueFormatter: (params: any) => `$${params.value.toFixed(2)}` },
    { headerName: 'Condition', field: 'condition', sortable: true, filter: true },
    { headerName: 'Date', field: 'createdAt', sortable: true, filter: true, valueFormatter: (params: any) => new Date(params.value).toLocaleDateString() }
  ];

  // AG-Grid column definitions for users
  const userColumnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 100 },
    { headerName: 'Username', field: 'username', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Role', field: 'role', sortable: true, filter: true },
    { headerName: 'Created', field: 'createdAt', sortable: true, filter: true, valueFormatter: (params: any) => new Date(params.value).toLocaleDateString() }
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
      navigate("/dashboard");
      return;
    }

    // Get all items and users
    setAllItems([...mockItems]);
    setAllUsers([...mockUsers]);
    setFilteredItems([...mockItems]);
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, allItems]);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    const indexToRemove = mockItems.findIndex(item => item.id === itemToDelete);
    if (indexToRemove !== -1) {
      mockItems.splice(indexToRemove, 1);
    }

    setAllItems(mockItems.slice());
    setFilteredItems(filteredItems.filter(item => item.id !== itemToDelete));
    
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    
    toast({
      title: "Item Removed",
      description: "The item has been successfully removed",
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage the marketplace, monitor activity, and maintain platform standards.
            </p>
          </div>
          <div className="flex gap-3 self-end md:self-start">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allItems.length}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reported Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                -2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Healthy</div>
              <p className="text-xs text-muted-foreground">
                99.9% uptime this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="items" className="space-y-4">
          <TabsList>
            <TabsTrigger value="items" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">All Items</h2>
              
              {/* AG-Grid Table View */}
              <div className="ag-theme-alpine w-full h-[400px] mb-8">
                <AgGridReact
                  rowData={filteredItems}
                  columnDefs={itemColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
              
              {/* Card View */}
              <h3 className="text-lg font-medium mb-4">Items That May Need Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.slice(0, 4).map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    isAdmin={true} 
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Item</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this item? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              
              {/* AG-Grid Table View */}
              <div className="ag-theme-alpine w-full h-[400px]">
                <AgGridReact
                  rowData={allUsers}
                  columnDefs={userColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>New users, listings, and reported items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="newUsers" stroke="#0f766e" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="newListings" stroke="#f97316" />
                        <Line type="monotone" dataKey="flaggedItems" stroke="#ef4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Items by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>Distribution of user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userRoleData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#0f766e" />
                          <Cell fill="#f97316" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Listings</CardTitle>
                  <CardDescription>New listings per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={activityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newListings" fill="#0f766e" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reported Items</CardTitle>
                <CardDescription>Items flagged by users for review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center border rounded-md">
                  <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No items currently flagged</h3>
                  <p className="text-muted-foreground">
                    When users report items that violate our terms, they will appear here for review.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage platform security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Button variant="outline" disabled>Enabled</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Content Moderation</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered content scanning for policy violations
                      </p>
                    </div>
                    <Button variant="outline" disabled>Enabled</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Activity Logs</h3>
                      <p className="text-sm text-muted-foreground">
                        Keep detailed logs of all admin actions
                      </p>
                    </div>
                    <Button variant="outline" disabled>Enabled</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  (This is a demo - security settings cannot be changed)
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

export default AdminDashboard;
