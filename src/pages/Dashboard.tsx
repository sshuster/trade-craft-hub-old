
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRightIcon, PlusCircle, LogOut } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { MusicItem, genres, moods } from '@/lib/data';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ChartData {
  name: string;
  count: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [items, setItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    price: 0,
    genre: genres[0],
    tempo: 'medium' as "slow" | "medium" | "fast",
    mood: moods[0],
    musicUrl: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchItems = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/music`);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error('Failed to fetch music');
        }
      } catch (error) {
        console.error('Error fetching music:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use mock data for frontend-only testing
    setItems([]);
    fetchItems();
  }, [user, navigate]);

  const generateGenreData = (items: MusicItem[]): ChartData[] => {
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

  const columnDefs: ColDef<MusicItem>[] = [
    { headerName: "Title", field: "title" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Genre", field: "genre" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Tempo", field: "tempo" as keyof MusicItem, sortable: true, filter: true },
    { headerName: "Mood", field: "mood" as keyof MusicItem, sortable: true, filter: true },
    { 
      headerName: "Price", 
      field: "price" as keyof MusicItem, 
      sortable: true, 
      filter: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}` 
    },
    { 
      headerName: "Link", 
      field: "musicUrl" as keyof MusicItem, 
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
    }
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          title: newItem.title,
          description: newItem.description,
          price: newItem.price,
          genre: newItem.genre,
          tempo: newItem.tempo,
          mood: newItem.mood,
          music_url: newItem.musicUrl,
          location: newItem.location,
          images: [], // Add images later
        }),
      });

      if (response.ok) {
        toast.success('Music track listed successfully!');
        const newItemData = await response.json();
        setItems([...items, newItemData]);
        setNewItem({
          title: '',
          price: 0,
          genre: genres[0],
          tempo: 'medium',
          mood: moods[0],
          musicUrl: '',
          location: '',
          description: '',
        });
      } else {
        console.error('Failed to list music track');
        toast.error('Failed to list music track');
      }
    } catch (error) {
      console.error('Error listing music track:', error);
      toast.error('Error listing music track');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Musician Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">My Music</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>Your current music tracks for sale</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{items.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Views</CardTitle>
                <CardDescription>Total views on your music</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">247</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Inquiries from potential buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>Your most recently listed music</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {items.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} - {item.genre}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/item/${item.id}`)}>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Music</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Track
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>List a New Music Track</DialogTitle>
                  <DialogDescription>
                    Fill out the details about the music track you want to sell.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.price.toString()}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="genre" className="text-right">
                        Genre
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newItem.genre}
                          onValueChange={(value) => setNewItem({ ...newItem, genre: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tempo" className="text-right">
                        Tempo
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newItem.tempo}
                          onValueChange={(value: "slow" | "medium" | "fast") => 
                            setNewItem({ ...newItem, tempo: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tempo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slow">Slow</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="fast">Fast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="mood" className="text-right">
                        Mood
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newItem.mood}
                          onValueChange={(value) => setNewItem({ ...newItem, mood: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                          <SelectContent>
                            {moods.map((mood) => (
                              <SelectItem key={mood} value={mood}>
                                {mood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="musicUrl" className="text-right">
                        Music URL
                      </Label>
                      <Input
                        id="musicUrl"
                        type="url"
                        value={newItem.musicUrl}
                        onChange={(e) => setNewItem({ ...newItem, musicUrl: e.target.value })}
                        className="col-span-3"
                        placeholder="https://example.com/your-music-file"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={newItem.location}
                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="col-span-3"
                        rows={4}
                        placeholder="Describe your music, suggested uses, and any licensing details"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">List Music Track</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
              rowData={items}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Music by Genre</CardTitle>
              <CardDescription>Distribution of your tracks across genres</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={generateGenreData(items)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
