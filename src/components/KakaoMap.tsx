import { useEffect, useRef, useState } from 'react';
import { loadKakaoMap, hasKakaoApiKey } from '../utils/kakaoMapLoader';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  MapPin, 
  Navigation, 
  Locate,
  Plus,
  Minus,
  Layers,
  Filter,
  Heart,
  Clock,
  TrendingUp,
  Eye,
  Sparkles
} from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
    handleCatDetail?: (catId: string) => void;
  }
}

interface CatMarker {
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

interface KakaoMapProps {
  cats: CatMarker[];
  onCatSelect: (catId: string) => void;
  className?: string;
}

// 귀여운 고양이 마커 SVG 생성
const createCatMarkerSVG = (cat: CatMarker, isSelected: boolean = false) => {
  const color = cat.gender === 'female' ? '#ec4899' : cat.gender === 'male' ? '#3b82f6' : '#9ca3af';
  const size = isSelected ? 48 : 40;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="${color}" stroke="white" stroke-width="3" filter="url(#shadow)"/>
      <text x="${size/2}" y="${size/2 + 6}" text-anchor="middle" font-size="${size/2}" fill="white">🐱</text>
      ${cat.reportCount > 5 ? `<circle cx="${size - 8}" cy="8" r="6" fill="#10b981" stroke="white" stroke-width="2"/>` : ''}
    </svg>
  `;
};

export function KakaoMap({ cats, onCatSelect, className = '' }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const clusterer = useRef<any>(null);
  const infoWindow = useRef<any>(null);
  
  const [selectedCat, setSelectedCat] = useState<CatMarker | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRadius, setNearbyRadius] = useState<number>(1000); // 미터 단위
  const [filterNeutered, setFilterNeutered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 강력한 카카오맵 초기화
  useEffect(() => {
    let isMounted = true; // 컴포넌트 마운트 상태 추적
    
    const initializeMap = async () => {
      if (!mapContainer.current) {
        console.warn('⚠️ 맵 컨테이너가 준비되지 않음');
        return;
      }

      console.log('🚀 강력한 카카오맵 초기화 시작...');
      setIsLoading(true);

      try {
        // 1단계: API 로드
        const loaded = await loadKakaoMap();
        if (!loaded || !isMounted) {
          console.error('❌ 카카오맵 API 로드 실패 또는 컴포넌트 언마운트');
          if (isMounted) setIsLoading(false);
          return;
        }

        // 2단계: 객체 확인 및 재시도
        let retryCount = 0;
        const waitForKakao = () => {
          if (!isMounted) return;
          
          if (window.kakao?.maps?.Map && mapContainer.current) {
            console.log('🎯 카카오맵 객체 확인 완료, 지도 생성 시작...');
            initMap();
          } else if (retryCount < 30) {
            retryCount++;
            console.log(`⏳ 카카오맵 객체 대기 중... (${retryCount}/30)`);
            setTimeout(waitForKakao, 200);
          } else {
            console.error('❌ 카카오맵 객체 대기 타임아웃');
            if (isMounted) setIsLoading(false);
          }
        };

        // 3단계: 즉시 시작
        waitForKakao();

      } catch (error) {
        console.error('❌ 카카오맵 초기화 전체 오류:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    const initMap = () => {
      if (!window.kakao?.maps?.Map || !mapContainer.current) {
        console.error('❌ 카카오맵 API 또는 컨테이너가 준비되지 않음');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🎯 지도 생성 시작...');
        const { kakao } = window;
        
        // 지도 옵션
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청
          level: 5,
          maxLevel: 8,
          minLevel: 2
        };
        
        // 지도 생성
        const map = new kakao.maps.Map(mapContainer.current, options);
        mapInstance.current = map;
        
        console.log('🗺️ 지도 객체 생성 성공!');
        console.log('📍 지도 중심:', map.getCenter().toString());
    
    // 지도 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    
    // 마커 클러스터러 생성
    clusterer.current = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 6,
      calculator: [10, 30, 50], // 클러스터 개수 구간
      styles: [
        { // 10개 미만
          width: '40px', height: '40px',
          background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
          borderRadius: '50%',
          color: '#ec4899',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '41px',
          border: '2px solid #ec4899'
        },
        { // 10~30개
          width: '50px', height: '50px',
          background: 'linear-gradient(135deg, #fbcfe8, #f9a8d4)',
          borderRadius: '50%',
          color: '#be185d',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '51px',
          border: '3px solid #ec4899'
        },
        { // 30개 이상
          width: '60px', height: '60px',
          background: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
          borderRadius: '50%',
          color: '#831843',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '61px',
          border: '3px solid #be185d'
        }
      ]
    });
    
    // 정보창 생성
    infoWindow.current = new kakao.maps.InfoWindow({
      removable: true,
      zIndex: 100
    });
    
        setIsLoading(false);
        console.log('🎉 카카오맵 초기화 완료!');
        
        // 사용자 위치 가져오기
        getCurrentLocation();
      } catch (error) {
        console.error('❌ 지도 생성 오류:', error);
        setIsLoading(false);
      }
    };

    // 초기화 시작
    initializeMap();
    
    // 클린업
    return () => {
      isMounted = false; // 언마운트 표시
      
      try {
        markers.current.forEach(marker => marker?.setMap?.(null));
        markers.current = [];
        if (clusterer.current?.clear) {
          clusterer.current.clear();
        }
        if (infoWindow.current?.close) {
          infoWindow.current.close();
        }
      } catch (error) {
        console.warn('클린업 중 오류:', error);
      }
    };
  }, []);

  // 고양이 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !window.kakao) return;
    
    const { kakao } = window;
    
    // 기존 마커 제거
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    if (clusterer.current) {
      clusterer.current.clear();
    }
    
    // 필터링된 고양이 목록
    const filteredCats = cats.filter(cat => {
      if (filterNeutered !== null && cat.isNeutered !== filterNeutered) {
        return false;
      }
      return true;
    });
    
    // 새 마커 생성
    const newMarkers = filteredCats.map(cat => {
      const markerImage = new kakao.maps.MarkerImage(
        'data:image/svg+xml;base64,' + btoa(createCatMarkerSVG(cat, selectedCat?.id === cat.id)),
        new kakao.maps.Size(40, 40),
        { offset: new kakao.maps.Point(20, 40) }
      );
      
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(cat.lat, cat.lng),
        image: markerImage,
        title: cat.name,
        clickable: true
      });
      
      // 마커 클릭 이벤트
      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedCat(cat);
        
        // 정보창 내용
        const content = `
          <div style="padding: 15px; min-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="display: flex; gap: 12px; align-items: start;">
              ${cat.image ? `
                <img src="${cat.image}" alt="${cat.name}" 
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; border: 2px solid #ec4899;">
              ` : `
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #fce7f3, #fbcfe8); 
                  border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 30px;">
                  🐱
                </div>
              `}
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; color: #ec4899; font-size: 18px; font-weight: bold;">
                  ${cat.name}
                </h3>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                  ${cat.isNeutered ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">중성화</span>' : ''}
                  <span style="background: ${cat.gender === 'female' ? '#ec4899' : cat.gender === 'male' ? '#3b82f6' : '#9ca3af'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                    ${cat.gender === 'female' ? '♀️암컷' : cat.gender === 'male' ? '♂️수컷' : '성별모름'}
                  </span>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                  <span style="color: #ec4899;">👁️</span> 목격 ${cat.reportCount}회
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                  <span style="color: #a855f7;">🕐</span> ${cat.lastSeen}
                </p>
                <button onclick="window.handleCatDetail('${cat.id}')" 
                  style="margin-top: 8px; background: linear-gradient(135deg, #ec4899, #a855f7); 
                    color: white; border: none; padding: 6px 12px; border-radius: 20px; 
                    font-size: 12px; cursor: pointer; width: 100%;">
                  상세 정보 보기 →
                </button>
              </div>
            </div>
          </div>
        `;
        
        infoWindow.current.setContent(content);
        infoWindow.current.open(mapInstance.current, marker);
      });
      
      // 마우스 오버 이벤트
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        const hoverImage = new kakao.maps.MarkerImage(
          'data:image/svg+xml;base64,' + btoa(createCatMarkerSVG(cat, true)),
          new kakao.maps.Size(48, 48),
          { offset: new kakao.maps.Point(24, 48) }
        );
        marker.setImage(hoverImage);
      });
      
      kakao.maps.event.addListener(marker, 'mouseout', () => {
        if (selectedCat?.id !== cat.id) {
          const normalImage = new kakao.maps.MarkerImage(
            'data:image/svg+xml;base64,' + btoa(createCatMarkerSVG(cat, false)),
            new kakao.maps.Size(40, 40),
            { offset: new kakao.maps.Point(20, 40) }
          );
          marker.setImage(normalImage);
        }
      });
      
      return marker;
    });
    
    markers.current = newMarkers;
    
    // 클러스터러에 마커 추가
    if (clusterer.current) {
      clusterer.current.addMarkers(newMarkers);
    }
    
    // 전역 함수로 상세 정보 핸들러 등록
    window.handleCatDetail = (catId: string) => {
      onCatSelect(catId);
    };
  }, [cats, filterNeutered, selectedCat]);

  // 사용자 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // 사용자 위치로 지도 이동
          if (mapInstance.current && window.kakao) {
            const { kakao } = window;
            const moveLatLng = new kakao.maps.LatLng(latitude, longitude);
            mapInstance.current.setCenter(moveLatLng);
            
            // 사용자 위치 마커 추가
            const userMarker = new kakao.maps.Marker({
              position: moveLatLng,
              map: mapInstance.current,
              image: new kakao.maps.MarkerImage(
                'data:image/svg+xml;base64,' + btoa(`
                  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="10" fill="#3b82f6" stroke="white" stroke-width="3" opacity="0.8"/>
                    <circle cx="15" cy="15" r="5" fill="white"/>
                  </svg>
                `),
                new kakao.maps.Size(30, 30),
                { offset: new kakao.maps.Point(15, 15) }
              ),
              zIndex: 10
            });
            
            // 펄스 애니메이션 효과
            const pulseCircle = new kakao.maps.Circle({
              center: moveLatLng,
              radius: 50,
              strokeWeight: 2,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              fillColor: '#3b82f6',
              fillOpacity: 0.2
            });
            pulseCircle.setMap(mapInstance.current);
          }
        },
        (error) => {
          console.warn('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    }
  };

  // 근처 고양이 찾기
  const findNearbyCats = () => {
    if (!userLocation || !mapInstance.current || !window.kakao) return;
    
    const { kakao } = window;
    
    // 반경 원 그리기
    const circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: nearbyRadius,
      strokeWeight: 3,
      strokeColor: '#ec4899',
      strokeOpacity: 0.7,
      strokeStyle: 'dashed',
      fillColor: '#fce7f3',
      fillOpacity: 0.3
    });
    
    circle.setMap(mapInstance.current);
    
    // 3초 후 원 제거
    setTimeout(() => {
      circle.setMap(null);
    }, 3000);
    
    // 반경 내 고양이 필터링
    const nearbyCats = cats.filter(cat => {
      const distance = getDistance(userLocation.lat, userLocation.lng, cat.lat, cat.lng);
      return distance <= nearbyRadius;
    });
    
    // 알림
    if (nearbyCats.length > 0) {
      alert(`🐱 ${nearbyRadius}m 반경 내에 ${nearbyCats.length}마리의 고양이가 있습니다!`);
    } else {
      alert(`😿 ${nearbyRadius}m 반경 내에 고양이가 없습니다. 범위를 넓혀보세요!`);
    }
  };

  // 두 지점 간 거리 계산 (미터)
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  };

  // 지도 타입 변경
  const changeMapType = () => {
    if (!mapInstance.current || !window.kakao) return;
    
    const { kakao } = window;
    const types = {
      roadmap: kakao.maps.MapTypeId.ROADMAP,
      satellite: kakao.maps.MapTypeId.HYBRID,
      hybrid: kakao.maps.MapTypeId.HYBRID
    };
    
    const nextType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    mapInstance.current.setMapTypeId(types[nextType]);
    setMapType(nextType);
  };

  // 히트맵 토글
  const toggleHeatmap = () => {
    if (!mapInstance.current || !window.kakao) return;
    
    const { kakao } = window;
    
    if (!showHeatmap) {
      // 히트맵 표시 (오버레이로 구현)
      cats.forEach(cat => {
        const heatCircle = new kakao.maps.Circle({
          center: new kakao.maps.LatLng(cat.lat, cat.lng),
          radius: 200 + (cat.reportCount * 20), // 목격 횟수에 따라 크기 조절
          strokeWeight: 0,
          fillColor: '#ec4899',
          fillOpacity: Math.min(0.5, cat.reportCount * 0.05)
        });
        heatCircle.setMap(mapInstance.current);
      });
    } else {
      // 히트맵 제거 (실제로는 더 정교한 관리 필요)
      window.location.reload(); // 임시 해결책
    }
    
    setShowHeatmap(!showHeatmap);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-300">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl animate-spin mr-2">🌍</div>
            <div className="text-6xl animate-bounce">🐱</div>
          </div>
          <p className="text-pink-600 font-semibold text-lg">카카오맵을 불러오는 중...</p>
          <p className="text-purple-500 text-sm mt-2">고양이들의 위치를 표시하고 있어요 🐾</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 지도 컨트롤 패널 */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {/* 필터 패널 */}
        <Card className="card-cute p-3 bg-white/95 backdrop-blur">
          <div className="space-y-2">
            <h3 className="font-bold text-pink-600 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" />
              필터
            </h3>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => setFilterNeutered(filterNeutered === null ? true : filterNeutered === true ? false : null)}
                className={`btn-cute text-xs ${
                  filterNeutered === true ? 'btn-cute-primary' : 
                  filterNeutered === false ? 'bg-orange-500 text-white' : 
                  'btn-cute-secondary'
                }`}
              >
                {filterNeutered === true ? '✂️ 중성화 완료' : 
                 filterNeutered === false ? '⏳ 중성화 미완료' : 
                 '전체 보기'}
              </Button>
            </div>
          </div>
        </Card>

        {/* 지도 타입 전환 */}
        <Card className="card-cute p-3 bg-white/95 backdrop-blur">
          <div className="space-y-2">
            <Button
              size="sm"
              onClick={changeMapType}
              className="btn-cute btn-cute-secondary w-full text-xs"
            >
              <Layers className="w-3 h-3 mr-1" />
              {mapType === 'roadmap' ? '위성 지도' : '일반 지도'}
            </Button>
            <Button
              size="sm"
              onClick={toggleHeatmap}
              className={`btn-cute w-full text-xs ${showHeatmap ? 'btn-cute-primary' : 'btn-cute-secondary'}`}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              히트맵
            </Button>
          </div>
        </Card>
      </div>

      {/* 우측 상단 내 위치 버튼 */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Button
          onClick={getCurrentLocation}
          className="btn-cute btn-cute-primary shadow-lg"
          size="sm"
        >
          <Locate className="w-4 h-4 mr-2" />
          내 위치
        </Button>
        
        {userLocation && (
          <div className="flex gap-2">
            <select 
              value={nearbyRadius}
              onChange={(e) => setNearbyRadius(Number(e.target.value))}
              className="input-cute text-xs px-2 py-1"
            >
              <option value={500}>500m</option>
              <option value={1000}>1km</option>
              <option value={2000}>2km</option>
              <option value={5000}>5km</option>
            </select>
            <Button
              onClick={findNearbyCats}
              className="btn-cute bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              주변 고양이
            </Button>
          </div>
        )}
      </div>

      {/* 하단 정보 패널 */}
      {selectedCat && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="card-cute bg-white/95 backdrop-blur p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedCat.image ? (
                  <img 
                    src={selectedCat.image} 
                    alt={selectedCat.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-pink-300"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
                    🐱
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-pink-600 text-lg flex items-center gap-2">
                    {selectedCat.name}
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-pink-100 text-pink-600 text-xs">
                      목격 {selectedCat.reportCount}회
                    </Badge>
                    {selectedCat.isNeutered && (
                      <Badge className="bg-green-100 text-green-600 text-xs">
                        중성화
                      </Badge>
                    )}
                    <Badge className={`text-xs ${
                      selectedCat.gender === 'female' ? 'bg-pink-100 text-pink-600' :
                      selectedCat.gender === 'male' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedCat.gender === 'female' ? '♀️암컷' :
                       selectedCat.gender === 'male' ? '♂️수컷' : '성별모름'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onCatSelect(selectedCat.id)}
                  className="btn-cute btn-cute-primary"
                  size="sm"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  상세정보
                </Button>
                <Button
                  onClick={() => setSelectedCat(null)}
                  variant="ghost"
                  size="sm"
                  className="btn-cute"
                >
                  ✕
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 지도 컨테이너 */}
      <div 
        ref={mapContainer} 
        className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl"
      />

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="card-cute bg-white/90 backdrop-blur p-3">
          <h4 className="font-bold text-pink-600 text-xs mb-2">범례</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span>암컷</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>수컷</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>성별 미상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>자주 목격됨</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}