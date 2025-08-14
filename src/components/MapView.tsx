import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Clock,
  Heart,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CatLocation {
  id: string;
  name: string;
  image?: string;
  lat: number;
  lng: number;
  lastSeen: string;
  reportCount: number;
  isNeutered: boolean;
  characteristics: string[];
}

interface MapViewProps {
  cats: CatLocation[];
  onCatSelect: (catId: string) => void;
}

// 목격 기록 타입
interface SightingRecord {
  id: string;
  catId: string;
  location: string;
  time: string;
  date: string;
  reporter: string;
  notes?: string;
}

// 샘플 목격 기록 생성
const generateSightingRecords = (catId: string, catName: string): SightingRecord[] => {
  const locations = [
    '공원 입구', '편의점 앞', '아파트 놀이터', '주차장', '꽃밭 근처',
    '벤치 아래', '쓰레기통 옆', '나무 그늘', '계단 위', '담장 위'
  ];
  
  const records: SightingRecord[] = [];
  const days = Math.floor(Math.random() * 7) + 3; // 3-10일간의 기록
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dailySightings = Math.floor(Math.random() * 3) + 1; // 하루 1-3번 목격
    
    for (let j = 0; j < dailySightings; j++) {
      records.push({
        id: `${catId}-${i}-${j}`,
        catId,
        location: locations[Math.floor(Math.random() * locations.length)],
        time: `${Math.floor(Math.random() * 12) + 7}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        date: date.toLocaleDateString('ko-KR'),
        reporter: `주민${Math.floor(Math.random() * 50) + 1}`,
        notes: Math.random() > 0.5 ? '건강해 보임' : undefined
      });
    }
  }
  
  return records.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

export function MapView({ cats, onCatSelect }: MapViewProps) {
  const [selectedCat, setSelectedCat] = useState<CatLocation | null>(null);
  const [sightingRecords, setSightingRecords] = useState<SightingRecord[]>([]);
  const [showRoute, setShowRoute] = useState(false);

  const handleCatSelect = (cat: CatLocation) => {
    setSelectedCat(cat);
    setSightingRecords(generateSightingRecords(cat.id, cat.name));
    setShowRoute(false);
  };

  const handleShowRoute = () => {
    setShowRoute(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <span className="text-5xl">🗺️</span>
            고양이 이동 경로
            <span className="text-3xl">🐾</span>
          </h2>
          <p className="text-pink-400 mt-3 text-xl font-medium">우리 동네 고양이들의 활동 패턴을 확인해보세요 💕✨</p>
          <div className="absolute -top-4 -right-12 text-yellow-400 text-3xl animate-bounce">✨</div>
          <div className="absolute -bottom-2 -left-8 text-pink-400 text-2xl animate-pulse">💕</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cat List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-pink-50 to-purple-50 p-4">
            <h3 className="font-bold text-lg text-pink-600 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              활동 중인 고양이들
              <Badge className="bg-pink-500 text-white ml-auto">{cats.length}</Badge>
            </h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ec4899 #fce7f3' }}>
              {cats.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCatSelect(cat)}
                  className={`card-cute p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedCat?.id === cat.id 
                      ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300' 
                      : 'bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2 border-pink-200"
                      />
                      {cat.reportCount > 5 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-pink-700">{cat.name}</h4>
                      <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {cat.lastSeen}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-pink-100 text-pink-600 text-xs">
                          목격 {cat.reportCount}회
                        </Badge>
                        {cat.isNeutered && (
                          <Badge className="bg-green-100 text-green-600 text-xs">
                            중성화
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Map / Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {selectedCat ? (
            <>
              {/* Selected Cat Info */}
              <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50 p-6">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={selectedCat.image}
                    alt={selectedCat.name}
                    width={100}
                    height={100}
                    className="rounded-xl object-cover border-2 border-pink-200 shadow-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-pink-600 mb-2">
                      {selectedCat.name}
                    </h3>
                    <p className="text-purple-600 mb-3">최근 활동 패턴 분석</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-pink-100 rounded-lg p-3">
                        <p className="text-xs text-pink-500 mb-1">주요 활동 시간</p>
                        <p className="font-bold text-pink-700">오전 7-9시</p>
                      </div>
                      <div className="bg-purple-100 rounded-lg p-3">
                        <p className="text-xs text-purple-500 mb-1">자주 목격되는 장소</p>
                        <p className="font-bold text-purple-700">공원 입구</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="btn-cute btn-cute-primary"
                        onClick={handleShowRoute}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        이동 경로 보기
                      </Button>
                      <Button 
                        className="btn-cute bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 hover:from-pink-200 hover:to-purple-200"
                        onClick={() => onCatSelect(selectedCat.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        상세 정보
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movement Timeline */}
              <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-purple-50 p-6">
                <h4 className="font-bold text-lg text-purple-600 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  최근 목격 기록
                  <Sparkles className="w-4 h-4 text-yellow-400 ml-auto animate-pulse" />
                </h4>

                {showRoute && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-pink-600">이동 경로 시각화</span>
                      <Badge className="bg-green-500 text-white">실시간</Badge>
                    </div>
                    <div className="relative h-32 bg-white rounded-lg overflow-hidden">
                      {/* 간단한 경로 시각화 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          {sightingRecords.slice(0, 5).map((record, idx) => (
                            <div key={record.id} className="relative">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                                idx === 0 ? 'from-pink-400 to-pink-500' : 'from-purple-300 to-purple-400'
                              } flex items-center justify-center shadow-md`}>
                                <MapPin className="w-4 h-4 text-white" />
                              </div>
                              {idx < 4 && (
                                <div className="absolute top-4 left-8 w-12 h-0.5 bg-purple-300"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a855f7 #f3e8ff' }}>
                  {sightingRecords.map((record, idx) => (
                    <div 
                      key={record.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        idx === 0 
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 shadow-md' 
                          : 'bg-gradient-to-r from-purple-200 to-purple-300'
                      }`}>
                        <MapPin className={`w-5 h-5 ${idx === 0 ? 'text-white' : 'text-purple-600'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-purple-700">{record.location}</p>
                          <Badge className="bg-purple-100 text-purple-600 text-xs">
                            {record.time}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {record.date} · {record.reporter}님이 목격
                        </p>
                        {record.notes && (
                          <p className="text-xs text-green-600 mt-1 bg-green-50 inline-block px-2 py-1 rounded-full">
                            💚 {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-center text-purple-600 font-medium">
                    📍 이 고양이는 주로 <span className="font-bold">공원 주변</span>에서 활동해요
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="card-cute border-0 shadow-cute bg-gradient-to-br from-white to-pink-50 p-12 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-pink-600 mb-3">
                고양이를 선택해주세요
              </h3>
              <p className="text-purple-500">
                왼쪽 목록에서 고양이를 선택하면<br />
                이동 경로와 활동 패턴을 확인할 수 있어요 🐾
              </p>
              
              <div className="flex justify-center gap-4 mt-6">
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🐱</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐾</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>💕</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}