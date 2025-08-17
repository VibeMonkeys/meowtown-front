import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MapPin, Calendar, MessageCircle, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
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


  return (
    <Card 
      className="card-earthy overflow-hidden cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{'--tw-ring-color': 'var(--primary-500)'} as React.CSSProperties}
      onClick={() => onClick?.(cat.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(cat.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${cat.name} 상세 정보 보기. ${cat.location}에서 목격된 ${cat.gender === 'male' ? '수컷' : cat.gender === 'female' ? '암컷' : '성별 미상'} 고양이${cat.isNeutered ? ', 중성화 완료' : ''}`}
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
          <div className="w-full h-48 flex items-center justify-center" style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
              : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
          }}>
            <div className="text-center" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>
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
            <Badge className="badge-earthy-secondary shadow-lg text-xs font-semibold px-3 py-1.5">
              <span className="mr-1.5">✂️</span>
              중성화 완료
            </Badge>
          )}
          <Badge className={`shadow-lg text-sm font-bold px-3 py-2 ${
            cat.gender === 'male' ? 'badge-earthy-primary' : 
            cat.gender === 'female' ? 'badge-earthy-accent' : 
            'badge-earthy-secondary'
          }`}>
            <span className="mr-2 text-base">
              {cat.gender === 'male' ? '♂️' : cat.gender === 'female' ? '♀️' : '❓'}
            </span>
            <span className="font-bold">
              {cat.gender === 'male' ? '수컷' : cat.gender === 'female' ? '암컷' : '성별미상'}
            </span>
          </Badge>
        </div>

        {/* Heart Shape Decoration */}
        <div className="absolute top-3 left-3 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
          <div className="text-white text-lg drop-shadow-lg">💕</div>
        </div>
      </div>

      <CardContent className="p-5" style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 179, 8, 0.1))'
          : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
      }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg flex items-center gap-2" style={{
            color: theme === 'dark' ? '#fda4af' : '#dc2626'
          }}>
            {cat.name}
            <span className="text-sm">🐱</span>
          </h3>
          <span className="text-sm font-medium px-2 py-1 rounded-full" style={{
            color: theme === 'dark' ? '#fda4af' : '#dc2626',
            background: theme === 'dark' ? 'rgba(249, 115, 22, 0.2)' : '#fdebd0'
          }}>
            {cat.estimatedAge}
          </span>
        </div>

        <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{color: 'var(--text-neutral-soft)'}}>
          {cat.description || "이 귀여운 냥이에 대한 이야기를 들려주세요! 💝"}
        </p>

        <div className="flex items-center gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{
            color: theme === 'dark' ? '#86efac' : '#16a34a',
            background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7'
          }}>
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{cat.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{
            color: theme === 'dark' ? '#fde68a' : '#c2410c',
            background: theme === 'dark' ? 'rgba(251, 191, 36, 0.2)' : '#fed7aa'
          }}>
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{cat.lastSeen}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {cat.characteristics.map((char, index) => (
            <Badge key={index} className="text-xs border-0 transition-colors" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(34, 197, 94, 0.3))'
                : 'linear-gradient(135deg, #fbd4a0, #bbf7d0)', 
              color: theme === 'dark' ? '#fda4af' : '#c2410c'
            }}>
              #{char}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm p-2 rounded-lg" style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
            : 'linear-gradient(135deg, #dcfce7, #fef7ed)'
        }}>
          <Avatar className="w-7 h-7 border-2" style={{
            borderColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.5)' : '#fbd4a0'
          }}>
            <AvatarImage src={cat.reportedBy.avatar} />
            <AvatarFallback className="text-xs font-bold" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                : 'linear-gradient(135deg, #fef7ed, #fef9c3)', 
              color: theme === 'dark' ? '#fda4af' : '#c2410c'
            }}>
              {cat.reportedBy.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium" style={{
            color: theme === 'dark' ? '#fda4af' : '#dc2626'
          }}>제보자: {cat.reportedBy.name}</span>
          <span className="ml-auto" style={{
            color: theme === 'dark' ? '#fda4af' : '#f97316'
          }}>👤</span>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 flex items-center justify-between border-t" style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 179, 8, 0.1))'
          : 'linear-gradient(135deg, #fef7ed, #fef9c3)',
        borderColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : '#fbd4a0'
      }}>
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            className={`transition-all duration-300 hover:scale-110 gap-2.5 px-5 py-2.5 min-h-[44px] text-sm font-bold ${
              isLiked 
                ? 'text-white shadow-lg heart-liked' 
                : 'bg-white hover:text-red-600 border-2 hover:border-red-300'
            }`}
            style={isLiked 
              ? {background: theme === 'dark' ? 'linear-gradient(135deg, #4ade80, #22d3ee)' : 'linear-gradient(135deg, #059669, #10b981)'} 
              : {borderColor: '#ef4444', color: theme === 'dark' ? '#f3f4f6' : '#57534e'}
            }
            aria-label={isLiked ? `${cat.name} 좋아요 취소 (현재 ${cat.likes}개)` : `${cat.name} 좋아요 (현재 ${cat.likes}개)`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="font-bold text-base">{cat.likes}</span>
            {isLiked && <span className="ml-1 text-sm" aria-hidden="true">💕</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleComment}
            className="bg-white gap-2.5 px-5 py-2.5 transition-all duration-300 hover:scale-110 min-h-[44px] text-sm font-bold border-2"
            style={{
              color: theme === 'dark' ? '#f3f4f6' : '#57534e', 
              borderColor: theme === 'dark' ? '#fde047' : '#fde047'
            }}
            aria-label={`${cat.name} 댓글 작성 (현재 ${cat.comments}개)`}
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span className="font-bold text-base">{cat.comments}</span>
            <span className="ml-1 text-sm" aria-hidden="true">💬</span>
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="bg-white min-w-[48px] min-h-[44px] rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 border-2"
          style={{
            color: theme === 'dark' ? '#f3f4f6' : '#57534e', 
            borderColor: theme === 'dark' ? '#86efac' : '#86efac'
          }}
          aria-label={`${cat.name} 정보 공유하기`}
        >
          <Share2 className="w-5 h-5" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}