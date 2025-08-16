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
  const genderDisplay = {
    male: '수컷',
    female: '암컷',
    unknown: '성별 미상'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 text-3xl text-pink-300 animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
      <div className="absolute -top-6 right-8 text-2xl text-purple-300 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute top-1/4 -right-8 text-xl text-yellow-300 animate-bounce" style={{ animationDelay: '1s' }}>🐾</div>
      
      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <Button 
          onClick={onBack}
          className="btn-cute btn-cute-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          🔙 돌아가기
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent">
            {cat.name}
          </h1>
          <span className="text-2xl">🐱</span>
          <div className="text-yellow-400 text-lg animate-pulse">✨</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cat Image */}
          <Card className="card-cute border-2 border-pink-200 dark:border-pink-600 overflow-hidden relative bg-white dark:bg-gray-800">
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
                  <div className="w-full h-80 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center text-pink-400">
                      <div className="text-8xl mb-4">🐱</div>
                      <div className="text-lg font-medium">아직 사진이 없어요</div>
                      <div className="text-sm">곧 귀여운 모습을 볼 수 있을 거예요!</div>
                    </div>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-white to-pink-25 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                      {cat.name}
                      <span className="text-xl">🐱</span>
                    </h2>
                    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-600">
                      <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      <span className="text-purple-600 dark:text-purple-300 font-medium">📍 {cat.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => onLike(cat.id)}
                      className={`btn-cute transition-all duration-300 hover:scale-110 gap-2 px-4 py-2 ${
                        cat.isLiked 
                          ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg heart-liked' 
                          : 'bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-red-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${cat.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{cat.likes}</span>
                      {cat.isLiked && <span className="ml-1">💕</span>}
                    </Button>
                    <Button 
                      onClick={() => onComment(cat.id)}
                      className="btn-cute bg-white/80 dark:bg-gray-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 border border-blue-200 dark:border-blue-600 gap-2 px-4 py-2 transition-all duration-300 hover:scale-110"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">{cat.comments}</span>
                      <span className="ml-1">💬</span>
                    </Button>
                    <Button 
                      onClick={() => onShare(cat.id)}
                      className="btn-cute bg-white/80 dark:bg-gray-700/80 hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 border border-green-200 dark:border-green-600 w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-600 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">♂️♀️ 성별</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">{genderDisplay[cat.gender]}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-600 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">🎂 추정 나이</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{cat.estimatedAge}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-600 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">✂️ 중성화</span>
                    <Badge className={cat.isNeutered ? 'badge-neutered' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-600'}>
                      {cat.isNeutered ? "✅ 완료" : "⏳ 미완료"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border-2 border-yellow-200 dark:border-yellow-600 hover:shadow-md transition-shadow">
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">👀 목격 횟수</span>
                    <span className="font-bold text-yellow-700 dark:text-yellow-300">{cat.reportCount}회</span>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                    🏷️ 특징 태그
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {cat.characteristics.map((char, index) => (
                      <Badge 
                        key={char} 
                        className="bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800/50 dark:to-purple-800/50 text-purple-700 dark:text-purple-300 border-0 hover:from-pink-300 hover:to-purple-300 dark:hover:from-pink-700/70 dark:hover:to-purple-700/70 transition-all duration-300 hover:scale-105 shadow-sm"
                      >
                        #{char}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {cat.description && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-600">
                    <h3 className="font-bold text-lg text-purple-600 dark:text-purple-300 mb-3 flex items-center gap-2">
                      📝 상세 설명
                      <span className="text-sm">💝</span>
                    </h3>
                    <p className="text-purple-700 dark:text-purple-200 leading-relaxed font-medium">
                      {cat.description || "이 귀여운 냥이에 대한 이야기를 들려주세요! 💕"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="card-cute border-2 border-blue-200 dark:border-blue-600 relative overflow-hidden bg-white dark:bg-gray-800">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-60"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <div className="relative">
                  <Clock className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-bold text-xl">
                  🕐 목격 이력
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {/* 최근 목격 정보 */}
                <div className="flex gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-600 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">📅 최근 목격</p>
                    <p className="text-sm text-green-500 dark:text-green-300 font-medium">⏰ {cat.lastSeen}</p>
                    <p className="text-sm text-green-700 dark:text-green-200 font-medium">📍 {cat.location}에서 목격됨</p>
                  </div>
                </div>
                
                {/* 동적 목격 이력 */}
                {sightingRecords.map((record) => {
                  const getIcon = () => {
                    switch (record.type) {
                      case 'sighting':
                        return (
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-md">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        );
                      case 'photo':
                        return (
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        );
                      case 'registered':
                        return (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                            <Flag className="w-6 h-6 text-white" />
                          </div>
                        );
                      default:
                        return (
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full flex items-center justify-center shadow-md">
                            <Info className="w-6 h-6 text-white" />
                          </div>
                        );
                    }
                  };
                  
                  const getBgColor = () => {
                    switch (record.type) {
                      case 'sighting':
                        return 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-600';
                      case 'photo':
                        return 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-600';
                      case 'registered':
                        return 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-600';
                      default:
                        return 'from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-200 dark:border-gray-600';
                    }
                  };
                  
                  return (
                    <div key={record.id} className={`flex gap-4 p-5 bg-gradient-to-r ${getBgColor()} rounded-xl border-2 hover:shadow-md transition-shadow`}>
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
                  <div className="flex gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-600 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">🚩 첫 등록</p>
                      <p className="text-sm text-blue-500 dark:text-blue-300 font-medium">📝 등록일 정보 없음</p>
                      <p className="text-sm text-blue-700 dark:text-blue-200 font-medium">👤 {cat.reportedBy.name}님이 등록했습니다</p>
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
          <Card className="card-cute border-2 border-purple-200 dark:border-purple-600 relative overflow-hidden bg-white dark:bg-gray-800">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-60"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <div className="relative">
                  <MapPin className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
                </div>
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-bold">
                  📍 위치 정보
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="h-36 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 rounded-xl border-2 border-purple-200 dark:border-purple-600 flex items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
                    <p className="text-purple-600 dark:text-purple-300 font-semibold">🗺️ 지도 보기</p>
                    <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">클릭하여 지도에서 확인</p>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-700/80 p-4 rounded-xl border border-purple-200 dark:border-purple-600">
                  <p className="text-base font-bold text-purple-700 dark:text-purple-300 mb-2">📍 {cat.location}</p>
                  <p className="text-xs text-purple-500 dark:text-purple-400 font-medium">
                    🌐 상세 위치: {cat.location}
                  </p>
                </div>
                <Button 
                  className="btn-cute btn-cute-primary w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-3"
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
          <Card className="card-cute border-2 border-yellow-200 dark:border-yellow-600 relative overflow-hidden bg-white dark:bg-gray-800">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 opacity-60"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl text-yellow-600 dark:text-yellow-400 flex items-center gap-3">
                <div className="relative">
                  <Edit className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
                </div>
                <span className="bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent font-bold">
                  ⚙️ 관리 옵션
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <Button 
                className="btn-cute bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-600 dark:hover:from-green-600 dark:hover:to-emerald-700 text-white w-full justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 py-3"
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