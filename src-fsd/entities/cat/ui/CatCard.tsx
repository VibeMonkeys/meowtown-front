import React from 'react';
import { Heart, MessageSquare, Share2, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shared/ui/avatar';
import type { Cat } from '../../../shared/types';
import { CatModel } from '../model/catModel';

interface CatCardProps {
  cat: Cat;
  onLike?: (catId: string) => void;
  onComment?: (catId: string) => void;
  onShare?: (catId: string) => void;
  onClick?: (catId: string) => void;
  className?: string;
}

export function CatCard({ 
  cat, 
  onLike, 
  onComment, 
  onShare, 
  onClick,
  className = '' 
}: CatCardProps) {
  const catModel = new CatModel(cat);

  const handleCardClick = () => {
    if (onClick) {
      onClick(cat.id);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(cat.id);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComment) {
      onComment(cat.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(cat.id);
    }
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={handleCardClick}
    >
      {/* 고양이 이미지 */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={cat.image} 
          alt={cat.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* 중성화 상태 배지 */}
        {cat.isNeutered && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 text-xs"
          >
            중성화됨
          </Badge>
        )}
        
        {/* 성별 표시 */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={cat.gender === 'male' ? 'default' : cat.gender === 'female' ? 'destructive' : 'outline'}
            className="text-xs"
          >
            {catModel.getGenderLabel()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* 고양이 이름과 나이 */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{cat.name}</h3>
          {cat.estimatedAge && (
            <Badge variant="outline" className="text-xs">
              {cat.estimatedAge}
            </Badge>
          )}
        </div>

        {/* 위치 정보 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{cat.location}</span>
        </div>

        {/* 마지막 목격 시간 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <Clock className="w-4 h-4" />
          <span>{catModel.getFormattedLastSeen()}</span>
        </div>

        {/* 설명 */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {cat.description}
        </p>

        {/* 특성 태그들 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cat.characteristics.slice(0, 3).map((characteristic, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs"
            >
              {characteristic}
            </Badge>
          ))}
          {cat.characteristics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{cat.characteristics.length - 3}
            </Badge>
          )}
        </div>

        {/* 제보자 정보 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="w-6 h-6">
            <AvatarImage src={cat.reportedBy.avatar} />
            <AvatarFallback className="text-xs">
              {cat.reportedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{cat.reportedBy.name}</span>
          <span>·</span>
          <span>{cat.reportCount}회 제보</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-8 px-2 hover:text-red-500"
            >
              <Heart className="w-4 h-4 mr-1" />
              {cat.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="h-8 px-2"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {cat.comments}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}