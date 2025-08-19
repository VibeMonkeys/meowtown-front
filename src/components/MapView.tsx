import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
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
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SimpleKakaoMap } from './SimpleKakaoMap';
import { hasKakaoApiKey } from '../utils/kakaoMapLoader';

interface CatLocation {
  id: string;
  name: string;
  image?: string;
  lat: number;
  lng: number;
  lastSeen: string;
  reportCount: number;
  isNeutered: boolean;
  gender: 'male' | 'female' | 'unknown';
  characteristics: string[];
  description?: string;
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
  const { theme } = useTheme();
  const [selectedCat, setSelectedCat] = useState<CatLocation | null>(null);
  const [selectedCatIdForMap, setSelectedCatIdForMap] = useState<string | null>(null);
  const [sightingRecords, setSightingRecords] = useState<SightingRecord[]>([]);
  const [showRoute, setShowRoute] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  
  // 고양이에 임시 좌표와 성별 정보 추가
  const enrichedCats = cats.map((cat, index) => ({
    ...cat,
    lat: cat.lat || (37.4979 + (Math.random() - 0.5) * 0.02), // 서울 시청 근처 랜덤 좌표
    lng: cat.lng || (127.0276 + (Math.random() - 0.5) * 0.02),
    gender: cat.gender || (['male', 'female', 'unknown'][Math.floor(Math.random() * 3)] as 'male' | 'female' | 'unknown')
  }));

  const handleCatSelect = (cat: CatLocation, fromTimeline = false) => {
    setSelectedCat(cat);
    setSelectedCatIdForMap(cat.id);
    setSightingRecords(generateSightingRecords(cat.id, cat.name));
    setShowRoute(false);
    // 타임라인에서 클릭한 경우에만 지도로 전환하지 않음
    if (!fromTimeline && viewMode !== 'map') {
      setViewMode('map');
    }
  };

  const handleMapCatSelect = (catId: string) => {
    const cat = enrichedCats.find(c => c.id === catId);
    if (cat) {
      // 지도에서 클릭할 때는 모드 전환 없이 선택만 하고 상세 정보로 이동
      handleCatSelect(cat, true); // fromTimeline = true로 전달
      setViewMode('timeline');
    }
    onCatSelect(catId);
  };

  const handleShowRoute = () => {
    setShowRoute(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-4xl font-bold flex items-center gap-3" style={{color: theme === 'dark' ? '#fda4af' : '#991b1b'}}>
            <span className="text-5xl">🗺️</span>
            고양이 지도
            <span className="text-3xl">🐾</span>
          </h2>
          <p className="mt-3 text-xl font-medium" style={{color: 'var(--text-primary-soft)'}}>우리 동네 고양이들의 실시간 위치를 확인해보세요 🌻🍃</p>
          <div className="absolute -top-4 -right-12 text-yellow-400 text-3xl animate-bounce">✨</div>
          <div className="absolute -bottom-2 -left-8 text-2xl animate-pulse" style={{color: 'var(--primary-400)'}}>🐾</div>
        </div>
        
        {/* 뷰 모드 선택 */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setViewMode('map')}
            className={`btn-cute ${viewMode === 'map' ? 'btn-cute-primary' : 'btn-cute-secondary'}`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            실시간 지도
          </Button>
          <Button
            onClick={() => setViewMode('timeline')}
            className={`btn-cute ${viewMode === 'timeline' ? 'btn-cute-primary' : 'btn-cute-secondary'}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            활동 패턴
          </Button>
        </div>
      </div>

      {/* 카카오맵 상태 정보 */}
      {(() => {
        const hasKey = hasKakaoApiKey();
        const apiKey = process.env.REACT_APP_KAKAO_API_KEY;
        
        return (
          <div className={`card-cute border-2 p-4 mb-6 ${hasKey ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-6 h-6 ${hasKey ? 'text-green-600' : 'text-yellow-600'}`} />
              <div className="flex-1">
                <h3 className={`font-bold ${hasKey ? 'text-green-700' : 'text-yellow-700'}`}>
                  {hasKey ? '카카오맵 API 설정됨' : '카카오맵 API 키 설정 필요'}
                </h3>
                
                <div className={`text-sm mt-1 space-y-1 ${hasKey ? 'text-green-600' : 'text-yellow-600'}`}>
                  <p>
                    <strong>환경변수:</strong> {apiKey ? `${apiKey.substring(0, 4)}****` : '없음'}
                  </p>
                  <p>
                    <strong>현재 도메인:</strong> {window.location.hostname}
                  </p>
                  <p>
                    <strong>현재 URL:</strong> {window.location.href}
                  </p>
                  
                  {!hasKey && (
                    <p className="mt-2">
                      ⚠️ 카카오맵을 사용하려면 환경변수를 설정해주세요.<br />
                      현재는 활동 패턴만 확인하실 수 있습니다.
                    </p>
                  )}
                  
                  {hasKey && (
                    <p className="mt-2">
                      ✅ API 키가 설정되었습니다. 지도가 로드되지 않으면 카카오 개발자 콘솔에서 현재 도메인 등록을 확인해주세요.
                    </p>
                  )}
                </div>
                
                <details className="mt-3">
                  <summary className={`text-xs cursor-pointer ${hasKey ? 'text-green-500' : 'text-yellow-500'}`}>
                    🔧 디버깅 정보 (클릭하여 펼치기)
                  </summary>
                  <div className={`mt-2 p-3 rounded text-xs font-mono ${hasKey ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <p>window.kakao 존재: {!!window.kakao ? '✅ 예' : '❌ 아니오'}</p>
                    <p>window.kakao.maps 존재: {!!(window.kakao && window.kakao.maps) ? '✅ 예' : '❌ 아니오'}</p>
                    <p>window.kakao.maps.Map 존재: {!!(window.kakao && window.kakao.maps && window.kakao.maps.Map) ? '✅ 예' : '❌ 아니오'}</p>
                    <p>User Agent: {navigator.userAgent}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        );
      })()}

      {viewMode === 'map' ? (
        /* 실제 지도 뷰 - API 키가 있을 때만 표시 */
        !hasKakaoApiKey() ? (
          <div className="card-cute p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-3">지도 기능 준비중</h3>
            <p className="text-blue-600 mb-6">
              보안상의 이유로 지도 기능은 현재 비활성화되어 있습니다.<br />
              고양이들의 활동 패턴은 아래 '활동 패턴' 탭에서 확인하실 수 있어요! 🐱
            </p>
            <button 
              onClick={() => setViewMode('timeline')}
              className="btn-cute btn-cute-primary"
            >
              📊 활동 패턴 보기
            </button>
          </div>
        ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 고양이 리스트 */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card-earthy p-4" style={{background: 'var(--gradient-warm)'}}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{color: 'var(--text-primary-soft)'}}>
                <MapPin className="w-5 h-5" />
                고양이 목록
                <Badge className="ml-auto" style={{background: 'var(--gradient-primary)', color: 'white'}}>{enrichedCats.length}</Badge>
              </h3>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ec4899 #fce7f3' }}>
                {enrichedCats.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      // 지도 모드에서는 지도에 위치만 표시하고 모드 전환 없음
                      setSelectedCatIdForMap(cat.id);
                      setSelectedCat(cat);
                      setSightingRecords(generateSightingRecords(cat.id, cat.name));
                    }}
                    className={`card-cute p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedCatIdForMap === cat.id 
                        ? 'border-2 animate-pulse' 
                        : 'bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`text-2xl p-2 rounded-full ${
                        cat.isNeutered ? 'badge-earthy-secondary' : 'badge-earthy-accent'
                      }`}>🐱</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate" style={{color: 'var(--text-primary-soft)'}}>{cat.name}</h4>
                        <p className="text-xs flex items-center gap-1 mt-1" style={{color: 'var(--text-secondary-soft)'}}>
                          <Clock className="w-3 h-3" />
                          {cat.lastSeen}
                        </p>
                      </div>
                      {selectedCatIdForMap === cat.id && (
                        <div className="animate-bounce" style={{color: 'var(--primary-500)'}}>
                          📍
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 rounded-lg" style={{background: 'var(--gradient-warm)'}}>
                <p className="text-xs text-center font-medium" style={{color: 'var(--text-secondary-soft)'}}>
                  👉 고양이를 클릭하면 지도에서 위치를 확인할 수 있어요!
                </p>
              </div>
            </div>
          </div>
          
          {/* 지도 */}
          <div className="lg:col-span-3 space-y-4">
            <SimpleKakaoMap 
              cats={enrichedCats}
              onCatSelect={handleMapCatSelect}
              selectedCatId={selectedCatIdForMap || undefined}
              className="w-full h-[600px]"
            />
          
            {/* 지도 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card-earthy p-4 text-center" style={{background: 'var(--gradient-warm)'}}>
                <div className="text-2xl mb-2">🐱</div>
                <div className="text-2xl font-bold" style={{color: 'var(--text-primary-soft)'}}>{enrichedCats.length}</div>
                <div className="text-sm" style={{color: 'var(--text-neutral-soft)'}}>등록된 고양이</div>
              </div>
              <div className="card-earthy p-4 text-center" style={{background: 'var(--gradient-nature)'}}>
                <div className="text-2xl mb-2">✂️</div>
                <div className="text-2xl font-bold" style={{color: 'var(--text-secondary-soft)'}}>
                  {enrichedCats.filter(cat => cat.isNeutered).length}
                </div>
                <div className="text-sm" style={{color: 'var(--text-secondary-soft)'}}>중성화 완료</div>
              </div>
              <div className="card-earthy p-4 text-center" style={{background: 'var(--gradient-secondary)'}}>
                <div className="text-2xl mb-2">👁️</div>
                <div className="text-2xl font-bold" style={{color: 'var(--text-secondary-soft)'}}>
                  {enrichedCats.reduce((sum, cat) => sum + cat.reportCount, 0)}
                </div>
                <div className="text-sm" style={{color: 'var(--text-secondary-soft)'}}>총 목격 횟수</div>
              </div>
              <div className="card-earthy p-4 text-center" style={{background: 'var(--gradient-warm)'}}>
                <div className="text-2xl mb-2">📍</div>
                <div className="text-2xl font-bold" style={{color: 'var(--text-primary-soft)'}}>5</div>
                <div className="text-sm" style={{color: 'var(--text-neutral-soft)'}}>활동 지역</div>
              </div>
            </div>
          </div>
        </div>
        )
      ) : (
        /* 기존 타임라인 뷰 */
        <div className="grid lg:grid-cols-3 gap-6">
        {/* Cat List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-earthy p-4" style={{background: 'var(--gradient-warm)'}}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{color: 'var(--text-primary-soft)'}}>
              <Activity className="w-5 h-5" />
              활동 중인 고양이들
              <Badge className="ml-auto" style={{background: 'var(--gradient-secondary)', color: 'white'}}>{cats.length}</Badge>
            </h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--primary-400) var(--primary-100)' }}>
              {enrichedCats.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCatSelect(cat, true)} // fromTimeline = true로 전달
                  className={`card-cute p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedCat?.id === cat.id 
                      ? 'border-2 shadow-lg' 
                      : 'bg-white'
                  }`}
                  style={{
                    background: selectedCat?.id === cat.id ? 'var(--gradient-warm)' : 'white',
                    borderColor: selectedCat?.id === cat.id ? 'var(--primary-300)' : 'transparent',
                    boxShadow: selectedCat?.id === cat.id ? '0 0 0 4px var(--primary-200)' : undefined
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    if (selectedCat?.id !== cat.id) {
                      e.currentTarget.style.background = 'var(--primary-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCat?.id !== cat.id) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2" style={{borderColor: 'var(--primary-200)'}}
                      />
                      {cat.reportCount > 5 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold" style={{color: 'var(--text-primary-soft)'}}>{cat.name}</h4>
                      <p className="text-xs flex items-center gap-1 mt-1" style={{color: 'var(--text-secondary-soft)'}}>
                        <Clock className="w-3 h-3" />
                        {cat.lastSeen}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="text-xs" style={{background: 'var(--primary-100)', color: 'var(--text-primary-soft)'}}>
                          목격 {cat.reportCount}회
                        </Badge>
                        {cat.isNeutered && (
                          <Badge className="text-xs" style={{background: 'var(--secondary-100)', color: 'var(--text-secondary-soft)'}}>
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
              <div className="card-earthy p-6" style={{background: 'var(--gradient-warm)'}}>
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={selectedCat?.image}
                    alt={selectedCat?.name || ''}
                    width={100}
                    height={100}
                    className="rounded-xl object-cover border-2 border-pink-200 shadow-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary-soft)'}}>
                      {selectedCat?.name}
                    </h3>
                    <p className="mb-3" style={{color: 'var(--text-secondary-soft)'}}>최근 활동 패턴 분석</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-3" style={{background: 'var(--primary-100)'}}>
                        <p className="text-xs mb-1" style={{color: 'var(--text-primary-soft)'}}>주요 활동 시간</p>
                        <p className="font-bold" style={{color: 'var(--text-primary-soft)'}}>오전 7-9시</p>
                      </div>
                      <div className="rounded-lg p-3" style={{background: 'var(--secondary-100)'}}>
                        <p className="text-xs mb-1" style={{color: 'var(--text-secondary-soft)'}}>자주 목격되는 장소</p>
                        <p className="font-bold" style={{color: 'var(--text-secondary-soft)'}}>공원 입구</p>
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
                        className="btn-cute" style={{background: 'var(--gradient-secondary)', color: 'var(--text-secondary-soft)'}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--gradient-primary)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--gradient-secondary)';
                          e.currentTarget.style.color = 'var(--text-secondary-soft)';
                        }}
                        onClick={() => selectedCat && onCatSelect(selectedCat.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        상세 정보
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movement Timeline */}
              <div className="card-earthy p-6" style={{background: 'var(--gradient-nature)'}}>
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2" style={{color: 'var(--text-secondary-soft)'}}>
                  <Calendar className="w-5 h-5" />
                  최근 목격 기록
                  <Sparkles className="w-4 h-4 ml-auto animate-pulse" style={{color: 'var(--accent-400)'}} />
                </h4>

                {showRoute && (
                  <div className="mb-6 p-4 rounded-xl" style={{background: 'var(--gradient-warm)'}}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold" style={{color: 'var(--text-primary-soft)'}}>이동 경로 시각화</span>
                      <Badge className="text-white" style={{background: 'var(--gradient-secondary)'}}>실시간</Badge>
                    </div>
                    <div className="relative h-32 bg-white rounded-lg overflow-hidden">
                      {/* 간단한 경로 시각화 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          {sightingRecords.slice(0, 5).map((record, idx) => (
                            <div key={record.id} className="relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md`} style={{
                                background: idx === 0 ? 'var(--gradient-primary)' : 'var(--gradient-secondary)'
                              }}>
                                <MapPin className="w-4 h-4 text-white" />
                              </div>
                              {idx < 4 && (
                                <div className="absolute top-4 left-8 w-12 h-0.5" style={{background: 'var(--secondary-300)'}}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--secondary-400) var(--secondary-100)' }}>
                  {sightingRecords.map((record, idx) => (
                    <div 
                      key={record.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg transition-all duration-300" 
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-50)'; }} 
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        idx === 0 
                          ? 'shadow-md' 
                          : ''
                      }`} style={{
                        background: idx === 0 ? 'var(--gradient-primary)' : 'var(--gradient-secondary)'
                      }}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold" style={{color: 'var(--text-secondary-soft)'}}>{record.location}</p>
                          <Badge className="text-xs" style={{background: 'var(--secondary-100)', color: 'var(--text-secondary-soft)'}}>
                            {record.time}
                          </Badge>
                        </div>
                        <p className="text-xs mt-1" style={{color: 'var(--text-neutral-soft)'}}>
                          {record.date} · {record.reporter}님이 목격
                        </p>
                        {record.notes && (
                          <p className="text-xs mt-1 inline-block px-2 py-1 rounded-full" style={{color: 'var(--text-secondary-soft)', background: 'var(--secondary-50)'}}>
                            💚 {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg" style={{background: 'var(--gradient-warm)'}}>
                  <p className="text-sm text-center font-medium" style={{color: 'var(--text-secondary-soft)'}}>
                    📍 이 고양이는 주로 <span className="font-bold">공원 주변</span>에서 활동해요
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="card-earthy p-12 text-center" style={{background: 'var(--gradient-warm)'}}>
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-3" style={{color: 'var(--text-primary-soft)'}}>
                고양이를 선택해주세요
              </h3>
              <p style={{color: 'var(--text-secondary-soft)'}}>
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
      )}
    </div>
  );
}