
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { MusicItem, User, mockUsers } from '@/lib/data';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { LogOut, UserX, Trash2 } from 'lucide-react';

// Define chart data interfaces
interface ChartData {
  name: string;
  value: number;
}

interface GenreData {
  name: string;
  count: number;
}

// Mock user data for admin view
const allUsers: User[] = mockUsers;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [items, setItems] = useState<MusicItem[]>([]);
  const [users, setUsers] = useState<User[]>(allUsers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    // Fetch music items from API
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/music');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error('Failed to fetch music items');
        }
      } catch (error) {
        console.error('Error fetching music items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [user, navigate]);

  // Generate pie chart data for music tempos
  const generateTempoData = (): ChartData[] => {
    const tempoCount: Record<string, number> = {
      'slow': 0,
      'medium': 0,
      'fast': 0
    };
    
    items.forEach(item => {
      tempoCount[item.tempo]++;
    });
    
    return Object.keys(tempoCount).map(tempo => ({
      name: tempo,
      value: tempoCount[tempo]
    }));
  };
  
  // Generate bar chart data for music genres
  const generateGenreData = (): GenreData[] => {
    const genreCount: Record<string, number> = {};
    
    items.forEach(item => {
      if (genreCount[item.genre]) {
        genreCount[item.genre]++;
      } else {
        genreCount[item.genre] = 1;
      }
    });
    
    return Object.keys(genreCount).map(genre => ({
      name: genre,
      count: genreCount[genre]
    }));
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Handler to delete a music item
  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/music/${itemId}`, {
        method: 'DELETE',
        headers: {
          'User-Id': user?.id || '',
          'User-Role': 'admin'
        }
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success('Music track deleted successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete music track');
      }
    } catch (error) {
      console.error('Error deleting music track:', error);
      toast.error('Failed to delete music track due to an error');
    }
  };

  // Handler to delete a user
  const handleDeleteUser = async (userId: string) => {
    // Only for demo - in a real app this would call an API
    try {
      // In a real app, you would make an API call like:
      // const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'User-Id': user?.id || '',
      //     'User-Role': 'admin'
      //   }
      // });
      
      // For mock implementation:
      if (userId === user?.id) {
        toast.error("You cannot delete your own account");
        return;
      }
      
      // Remove user from local state
      setUsers(users.filter(u => u.id !== userId));
      
      // Also remove any items associated with this user
      setItems(items.filter(item => item.userId !== userId));
      
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define item columns with proper typing
  const itemColumnDefs: ColDef<MusicItem>[] = [
    { headerName: "Title", field: "title" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Genre", field: "genre" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Tempo", field: "tempo" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Mood", field: "mood" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Price", field: "price" as keyof MusicItem, sortable: true, filter: true, width: 100 },
    { headerName: "Musician", field: "seller_username" as keyof MusicItem, sortable: true, filter: true },
    { 
      headerName: "Music URL", 
      field: "music_url" as keyof MusicItem,
      width: 120,
      cellRenderer: (params: any) => (
        <a 
          href={params.value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          Listen
        </a>
      )
    },
    {
      headerName: "Actions",
      field: "id" as keyof MusicItem,
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: (params: any) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Remove</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this music track.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteItem(params.value)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
  ];

  // Define user columns with proper typing
  const userColumnDefs: ColDef<User>[] = [
    { headerName: "Username", field: "username" as keyof User, sortable: true, filter: true },
    { headerName: "Email", field: "email" as keyof User, sortable: true, filter: true },
    { headerName: "Role", field: "role" as keyof User, sortable: true, filter: true, width: 100 },
    { headerName: "Created At", field: "createdAt" as keyof User, sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "id" as keyof User,
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: (params: any) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={params.value === user?.id}>
              <UserX size={16} className="mr-1" />
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this user account and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteUser(params.value)}>
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading admin dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="music">Manage Music</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Music Tracks</CardTitle>
                <CardDescription>All music on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{items.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Registered musicians</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New Today</CardTitle>
                <CardDescription>Today's new tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {items.filter(item => {
                    const today = new Date();
                    const itemDate = new Date(item.createdAt);
                    return (
                      itemDate.getDate() === today.getDate() &&
                      itemDate.getMonth() === today.getMonth() &&
                      itemDate.getFullYear() === today.getFullYear()
                    );
                  }).length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Music Tab */}
        <TabsContent value="music" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Music</CardTitle>
              <CardDescription>Manage all music tracks on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                  rowData={items}
                  columnDefs={itemColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="autoHeight"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage musician accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={users}
                  columnDefs={userColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="autoHeight"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Music by Genre</CardTitle>
                <CardDescription>Distribution of music across genres</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={generateGenreData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Music by Tempo</CardTitle>
                <CardDescription>Distribution of music by tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={generateTempoData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {generateTempoData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tracks`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
