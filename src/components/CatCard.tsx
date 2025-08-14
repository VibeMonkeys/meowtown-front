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
  image?: string;
  location: string;
  lastSeen: string;
  description: string;
  characteristics: string[];
  reportedBy: {
    name: string;
    avatar?: string;
  };
  likes: number;
  isLiked: boolean;
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
  onClick?: (catId: string) => void;
}

export function CatCard({ cat, onLike, onComment, onShare, onClick }: CatCardProps) {
  // 백엔드에서 받은 isLiked 상태를 사용
  const isLiked = cat.isLiked;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(cat.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment?.(cat.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(cat.id);
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="card-cute overflow-hidden cursor-pointer group relative"
      onClick={() => onClick?.(cat.id)}
    >
      {/* Sparkle Effect */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="sparkle" style={{ animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ animationDelay: '0.3s', top: '10px', left: '15px' }}></div>
        <div className="sparkle" style={{ animationDelay: '0.6s', top: '5px', left: '25px' }}></div>
      </div>
      
      <div className="relative">
        {cat.image ? (
          <ImageWithFallback
            src={cat.image}
            alt={cat.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-pink-400">
              <div className="text-6xl mb-2">🐱</div>
              <div className="text-sm font-medium">사진 준비중</div>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {cat.isNeutered && (
            <Badge className="badge-cute badge-neutered shadow-lg">
              <span className="mr-1">✂️</span>
              중성화 완료
            </Badge>
          )}
          <Badge className={`badge-cute shadow-lg ${
            cat.gender === 'male' ? 'badge-gender-male' : 
            cat.gender === 'female' ? 'badge-gender-female' : 
            'badge-gender-unknown'
          }`}>
            <span className="mr-1">
              {cat.gender === 'male' ? '♂️' : cat.gender === 'female' ? '♀️' : '❓'}
            </span>
            {cat.gender === 'male' ? '수컷' : cat.gender === 'female' ? '암컷' : '성별미상'}
          </Badge>
        </div>

        {/* Heart Shape Decoration */}
        <div className="absolute top-3 left-3 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
          <div className="text-white text-lg drop-shadow-lg">💕</div>
        </div>
      </div>

      <CardContent className="p-5 bg-gradient-to-br from-white to-pink-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            {cat.name}
            <span className="text-sm">🐱</span>
          </h3>
          <span className="text-sm font-medium text-pink-500 bg-pink-100 px-2 py-1 rounded-full">
            {cat.estimatedAge}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {cat.description || "이 귀여운 냥이에 대한 이야기를 들려주세요! 💝"}
        </p>

        <div className="flex items-center gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{cat.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{cat.lastSeen}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {cat.characteristics.map((char, index) => (
            <Badge key={index} className="text-xs bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 border-0 hover:from-pink-300 hover:to-purple-300 transition-colors">
              #{char}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-orange-50 to-pink-50 p-2 rounded-lg">
          <Avatar className="w-7 h-7 border-2 border-orange-200">
            <AvatarImage src={cat.reportedBy.avatar} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 font-bold">
              {cat.reportedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-orange-700 font-medium">제보자: {cat.reportedBy.name}</span>
          <span className="ml-auto text-orange-400">👤</span>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 bg-gradient-to-r from-pink-25 to-purple-25 flex items-center justify-between border-t border-pink-100">
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            className={`btn-cute transition-all duration-300 hover:scale-110 gap-2 px-4 py-2 ${
              isLiked 
                ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg heart-liked' 
                : 'bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-red-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{cat.likes}</span>
            {isLiked && <span className="ml-1">💕</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleComment}
            className="btn-cute bg-white/80 hover:bg-blue-50 text-gray-600 hover:text-blue-500 border border-blue-200 gap-2 px-4 py-2 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{cat.comments}</span>
            <span className="ml-1">💬</span>
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="btn-cute bg-white/80 hover:bg-green-50 text-gray-600 hover:text-green-500 border border-green-200 w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}