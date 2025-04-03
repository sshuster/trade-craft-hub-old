
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item } from "@/lib/data";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export function ItemCard({ item, onDelete, showActions = true, isAdmin = false }: ItemCardProps) {
  const navigate = useNavigate();
  
  // Format price to 2 decimal places and add commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.price);
  
  // Format the date to a more readable format
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Truncate description if it's too long
  const truncatedDescription = item.description.length > 120 
    ? item.description.substring(0, 120) + '...' 
    : item.description;

  return (
    <Card className="overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={item.images[0] || "/placeholder.svg"}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge 
          className="absolute top-2 right-2"
          variant={item.condition === 'new' ? 'default' : 'secondary'}
        >
          {item.condition}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
            <CardDescription className="text-xs">{formattedDate} • {item.location}</CardDescription>
          </div>
          <div className="text-xl font-bold text-primary">{formattedPrice}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Badge className="mb-2" variant="outline">{item.category}</Badge>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{truncatedDescription}</p>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="px-2">
              <Heart className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <MessageCircle className="h-4 w-4 mr-1" /> Chat
            </Button>
          </div>
          <Button size="sm" onClick={() => navigate(`/item/${item.id}`)}>
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
        </CardFooter>
      )}
      {isAdmin && onDelete && (
        <CardFooter className="pt-0">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={() => onDelete(item.id)}
          >
            Remove Item
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
