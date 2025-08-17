import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft,
  MapPin, 
  Calendar,
  Heart,
  MessageSquare,
  Share2,
  Camera,
  Clock,
  Info,
  Flag,
  Edit,
  Navigation,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../contexts/ThemeContext';

interface SightingRecord {
  id: string;
  catId: string;
  type: 'sighting' | 'photo' | 'report' | 'registered';
  description: string;
  time: string;
  reporter: string;
  location?: string;
}

interface CatDetailProps {
  cat: {
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
    lat: number;
    lng: number;
    reportCount: number;
  };
  sightingRecords?: SightingRecord[];
  onBack: () => void;
  onLike: (catId: string) => void;
  onComment: (catId: string) => void;
  onShare: (catId: string) => void;
  onSightingReport?: (catId: string) => void;
}

export function CatDetail({ cat, sightingRecords = [], onBack, onLike, onComment, onShare, onSightingReport }: CatDetailProps) {
  const { theme } = useTheme();
  const genderDisplay = {
    male: '수컷',
    female: '암컷',
    unknown: '성별 미상'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 text-3xl animate-bounce" style={{ animationDelay: '0s', color: 'var(--accent-300)' }}>🌻</div>
      <div className="absolute -top-6 right-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s', color: 'var(--secondary-300)' }}>🍃</div>
      <div className="absolute top-1/4 -right-8 text-xl animate-bounce" style={{ animationDelay: '1s', color: 'var(--primary-300)' }}>🐾</div>
      
      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <Button 
          onClick={onBack}
          className="btn-earthy-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          🔙 돌아가기
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            {cat.name}
          </h1>
          <span className="text-2xl">🐱</span>
          <div className="text-lg animate-pulse" style={{color: 'var(--accent-400)'}}>✨</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cat Image */}
          <Card className="card-earthy overflow-hidden relative">
            {/* Sparkle Effects */}
            <div className="absolute top-4 left-4 opacity-60 z-10">
              <div className="sparkle" style={{ animationDelay: '0s' }}></div>
              <div className="sparkle" style={{ animationDelay: '0.3s', top: '10px', left: '15px' }}></div>
            </div>
            <div className="absolute top-4 right-4 opacity-60 z-10">
              <div className="text-2xl animate-pulse">💕</div>
            </div>
            
            <CardContent className="p-0">
              <div className="relative">
                {cat.image ? (
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-80 flex items-center justify-center" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                      : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
                  }}>
                    <div className="text-center" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>
                      <div className="text-8xl mb-4">🐱</div>
                      <div className="text-lg font-medium">아직 사진이 없어요</div>
                      <div className="text-sm">곧 귀여운 모습을 볼 수 있을 거예요!</div>
                    </div>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6" style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 179, 8, 0.1))'
                  : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{
                      color: theme === 'dark' ? '#fda4af' : '#dc2626'
                    }}>
                      {cat.name}
                      <span className="text-xl">🐱</span>
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{
                      background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7',
                      borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'
                    }}>
                      <MapPin className="w-5 h-5" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}} />
                      <span className="font-medium" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>📍 {cat.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => onLike(cat.id)}
                      className={`transition-all duration-300 hover:scale-110 gap-2 px-4 py-2 ${
                        cat.isLiked 
                          ? 'btn-earthy-success text-white shadow-lg heart-liked' 
                          : 'btn-earthy-secondary'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${cat.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{cat.likes}</span>
                      {cat.isLiked && <span className="ml-1">💕</span>}
                    </Button>
                    <Button 
                      onClick={() => onComment(cat.id)}
                      className="btn-earthy-secondary gap-2 px-4 py-2 transition-all duration-300 hover:scale-110"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">{cat.comments}</span>
                      <span className="ml-1">💬</span>
                    </Button>
                    <Button 
                      onClick={() => onShare(cat.id)}
                      className="btn-earthy-secondary w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                      : 'linear-gradient(135deg, #fef7ed, #fef9c3)',
                    borderColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : '#fbd4a0'
                  }}>
                    <span className="text-sm font-semibold" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>♂️♀️ 성별</span>
                    <span className="font-bold" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>{genderDisplay[cat.gender]}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(74, 222, 128, 0.2))'
                      : 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'
                  }}>
                    <span className="text-sm font-semibold" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>🎂 추정 나이</span>
                    <span className="font-bold" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>{cat.estimatedAge}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
                      : 'linear-gradient(135deg, #dcfce7, #fef7ed)',
                    borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'
                  }}>
                    <span className="text-sm font-semibold" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>✂️ 중성화</span>
                    <Badge className={cat.isNeutered ? 'badge-earthy-secondary' : 'badge-earthy-accent'}>
                      {cat.isNeutered ? "✅ 완료" : "⏳ 미완료"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(254, 240, 138, 0.2))'
                      : 'linear-gradient(135deg, #fed7aa, #fdba74)',
                    borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : '#fb923c'
                  }}>
                    <span className="text-sm font-semibold" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}}>👀 목격 횟수</span>
                    <span className="font-bold" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}}>{cat.reportCount}회</span>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>
                    🏷️ 특징 태그
                    <Sparkles className="w-4 h-4" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}} />
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {cat.characteristics.map((char, index) => (
                      <Badge 
                        key={char} 
                        className="border-0 transition-all duration-300 hover:scale-105 shadow-sm" style={{
                          background: theme === 'dark' 
                            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(34, 197, 94, 0.3))'
                            : 'linear-gradient(135deg, #fbd4a0, #bbf7d0)', 
                          color: theme === 'dark' ? '#fda4af' : '#c2410c'
                        }}
                      >
                        #{char}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {cat.description && (
                  <div className="p-6 rounded-xl border-2" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
                      : 'linear-gradient(135deg, #dcfce7, #fef7ed)',
                    borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'
                  }}>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>
                      📝 상세 설명
                      <span className="text-sm">💝</span>
                    </h3>
                    <p className="leading-relaxed font-medium" style={{color: theme === 'dark' ? '#86efac' : '#15803d'}}>
                      {cat.description || "이 귀여운 냥이에 대한 이야기를 들려주세요! 💕"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="card-earthy relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-60" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
                : 'linear-gradient(135deg, #dcfce7, #fef7ed)'
            }}></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>
                <div className="relative">
                  <Clock className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}} />
                </div>
                <span className="font-bold text-xl" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>
                  🕐 목격 이력
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {/* 최근 목격 정보 */}
                <div className="flex gap-4 p-5 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(74, 222, 128, 0.2))'
                    : 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'
                }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, #4ade80, #22d3ee)'
                      : 'linear-gradient(135deg, #059669, #10b981)'
                  }}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{color: theme === 'dark' ? '#86efac' : '#16a34a'}}>📅 최근 목격</p>
                    <p className="text-sm font-medium" style={{color: theme === 'dark' ? '#86efac' : '#059669'}}>⏰ {cat.lastSeen}</p>
                    <p className="text-sm font-medium" style={{color: theme === 'dark' ? '#86efac' : '#15803d'}}>📍 {cat.location}에서 목격됨</p>
                  </div>
                </div>
                
                {/* 동적 목격 이력 */}
                {sightingRecords.map((record) => {
                  const getIcon = () => {
                    switch (record.type) {
                      case 'sighting':
                        return (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{background: 'var(--gradient-primary)'}}>
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        );
                      case 'photo':
                        return (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{background: 'var(--gradient-secondary)'}}>
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        );
                      case 'registered':
                        return (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{background: 'var(--gradient-warm)'}}>
                            <Flag className="w-6 h-6 text-white" />
                          </div>
                        );
                      default:
                        return (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{background: 'var(--gradient-nature)'}}>
                            <Info className="w-6 h-6 text-white" />
                          </div>
                        );
                    }
                  };
                  
                  const getBgColor = () => {
                    switch (record.type) {
                      case 'sighting':
                        return '';
                      case 'photo':
                        return '';
                      case 'registered':
                        return '';
                      default:
                        return '';
                    }
                  };
                  
                  return (
                    <div key={record.id} className="flex gap-4 p-5 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                      background: record.type === 'sighting' 
                        ? (theme === 'dark' 
                          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                          : 'linear-gradient(135deg, #fef7ed, #fef9c3)')
                        : record.type === 'photo' 
                        ? (theme === 'dark' 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(74, 222, 128, 0.2))'
                          : 'linear-gradient(135deg, #dcfce7, #bbf7d0)')
                        : record.type === 'registered' 
                        ? (theme === 'dark' 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
                          : 'linear-gradient(135deg, #dcfce7, #fef7ed)')
                        : (theme === 'dark' 
                          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                          : 'linear-gradient(135deg, #fef7ed, #fef9c3)'),
                      borderColor: record.type === 'sighting' 
                        ? (theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : '#fbd4a0')
                        : record.type === 'photo' 
                        ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0')
                        : record.type === 'registered' 
                        ? (theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : '#fef08a')
                        : (theme === 'dark' ? 'rgba(120, 113, 108, 0.3)' : '#e7e5e4')
                    }}>
                      {getIcon()}
                      <div>
                        <p className="font-bold text-lg dark:text-gray-200">
                          {record.type === 'sighting' ? '👀 목격 신고' : 
                           record.type === 'photo' ? '📸 사진 추가' : 
                           record.type === 'registered' ? '🚩 최초 등록' : '📝 기타'}
                        </p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">⏰ {record.time}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{record.description}</p>
                        {record.reporter && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 bg-white/60 dark:bg-gray-600/60 px-2 py-1 rounded-full inline-block">
                            👤 제보자: {record.reporter}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* 기본 등록 정보 */}
                {sightingRecords.length === 0 && (
                  <div className="flex gap-4 p-5 rounded-xl border-2 hover:shadow-md transition-shadow" style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1))'
                      : 'linear-gradient(135deg, #dcfce7, #fef7ed)',
                    borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : '#fb923c'
                  }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{
                      background: theme === 'dark' 
                        ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 179, 8, 0.3))'
                        : 'linear-gradient(135deg, #fed7aa, #fdba74)'
                    }}>
                      <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}}>🚩 첫 등록</p>
                      <p className="text-sm font-medium" style={{color: theme === 'dark' ? '#fde68a' : '#ea580c'}}>📝 등록일 정보 없음</p>
                      <p className="text-sm font-medium" style={{color: theme === 'dark' ? '#fde68a' : '#9a3412'}}>👤 {cat.reportedBy.name}님이 등록했습니다</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Location */}
          <Card className="card-earthy relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-60" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
            }}></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl flex items-center gap-3" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>
                <div className="relative">
                  <MapPin className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}} />
                </div>
                <span className="font-bold" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>
                  📍 위치 정보
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="h-36 rounded-xl border-2 flex items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow" style={{
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                    : 'linear-gradient(135deg, #fef7ed, #fef9c3)',
                  borderColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : '#fbd4a0'
                }}
                     onClick={() => {
                       if (cat.lat && cat.lng) {
                         const url = `https://map.kakao.com/link/map/${encodeURIComponent(cat.location)},${cat.lat},${cat.lng}`;
                         window.open(url, '_blank');
                       } else {
                         const url = `https://map.kakao.com/link/search/${encodeURIComponent(cat.location)}`;
                         window.open(url, '_blank');
                       }
                     }}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="text-6xl absolute top-2 left-2">🗺️</div>
                    <div className="text-4xl absolute bottom-2 right-2">📍</div>
                  </div>
                  <div className="text-center relative z-10">
                    <p className="font-semibold" style={{color: theme === 'dark' ? '#fda4af' : '#dc2626'}}>🗺️ 지도 보기</p>
                    <p className="text-xs mt-1" style={{color: theme === 'dark' ? '#fda4af' : '#ea580c'}}>클릭하여 지도에서 확인</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border" style={{
                  background: theme === 'dark' ? 'rgba(249, 115, 22, 0.1)' : '#fafaf9',
                  borderColor: theme === 'dark' ? 'rgba(249, 115, 22, 0.3)' : '#fbd4a0'
                }}>
                  <p className="text-base font-bold mb-2" style={{color: theme === 'dark' ? '#fda4af' : '#c2410c'}}>📍 {cat.location}</p>
                  <p className="text-xs font-medium" style={{color: theme === 'dark' ? '#fda4af' : '#ea580c'}}>
                    🌐 상세 위치: {cat.location}
                  </p>
                </div>
                <Button 
                  className="btn-earthy-primary w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-3"
                  onClick={() => {
                    // 실제 좌표가 있으면 사용하고, 없으면 주소로 검색
                    if (cat.lat && cat.lng) {
                      const url = `https://map.kakao.com/link/to/${encodeURIComponent(cat.name + ' - ' + cat.location)},${cat.lat},${cat.lng}`;
                      window.open(url, '_blank');
                    } else {
                      // 좌표가 없으면 주소로 검색
                      const url = `https://map.kakao.com/link/search/${encodeURIComponent(cat.location)}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  🧭 길찾기
                  <span className="ml-2">🚀</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="card-earthy relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-60" style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.2))'
                : 'linear-gradient(135deg, #fef7ed, #fef9c3)'
            }}></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl flex items-center gap-3" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}}>
                <div className="relative">
                  <Edit className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}} />
                </div>
                <span className="font-bold" style={{color: theme === 'dark' ? '#fde68a' : '#c2410c'}}>
                  ⚙️ 관리 옵션
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <Button 
                className="btn-earthy-success w-full justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-3"
                onClick={() => {
                  onSightingReport?.(cat.id);
                }}
              >
                <Flag className="w-5 h-5 mr-2" />
                👀 목격 신고
                <span className="ml-2">📢</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}