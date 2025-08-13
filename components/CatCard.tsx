import { useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MapPin, Calendar, MessageCircle, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CatData {
  id: string;
  name: string;
  image: string;
  location: string;
  lastSeen: string;
  description: string;
  characteristics: string[];
  reportedBy: {
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  isNeutered: boolean;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
}

interface CatCardProps {
  cat: CatData;
  onLike?: (catId: string) => void;
  onComment?: (catId: string) => void;
  onShare?: (catId: string) => void;
}

export function CatCard({ cat, onLike, onComment, onShare }: CatCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(cat.id);
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <ImageWithFallback
          src={cat.image}
          alt={cat.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {cat.isNeutered && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              중성화 완료
            </Badge>
          )}
          <Badge className={getGenderColor(cat.gender)}>
            {cat.gender === 'male' ? '수컷' : cat.gender === 'female' ? '암컷' : '성별미상'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{cat.name}</h3>
          <span className="text-sm text-muted-foreground">{cat.estimatedAge}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {cat.description}
        </p>

        <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{cat.location}</span>
        </div>

        <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>마지막 목격: {cat.lastSeen}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {cat.characteristics.map((char, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{char}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Avatar className="w-6 h-6">
            <AvatarImage src={cat.reportedBy.avatar} />
            <AvatarFallback className="text-xs">
              {cat.reportedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">제보자: {cat.reportedBy.name}</span>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 bg-muted/30 flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            className={`gap-1 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {cat.likes + (isLiked ? 1 : 0)}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onComment?.(cat.id)}
            className="gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            {cat.comments}
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onShare?.(cat.id)}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}