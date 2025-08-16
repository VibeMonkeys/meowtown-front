import { useEffect, useRef, useState, useCallback } from 'react';
import { loadKakaoMap } from '../utils/kakaoMapLoader';
import { MapPin, Navigation } from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface CatMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lastSeen: string;
  reportCount: number;
  isNeutered?: boolean;
  image?: string;
}

interface SimpleKakaoMapProps {
  cats: CatMarker[];
  onCatSelect: (catId: string) => void;
  className?: string;
  fetchCatsFromApi?: boolean;
  selectedCatId?: string;
}

export function SimpleKakaoMap({ cats: propCats, onCatSelect, className = '', fetchCatsFromApi = true, selectedCatId }: SimpleKakaoMapProps) {
  console.log('🗺️ SimpleKakaoMap 컴포넌트 렌더링됨!');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const currentLocationMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const customOverlayRef = useRef<Map<string, any>>(new Map());
  const clustererRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cats, setCats] = useState<CatMarker[]>(propCats);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);

  // 백엔드에서 고양이 데이터 가져오기
  const fetchCats = useCallback(async () => {
    if (!fetchCatsFromApi) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/cats');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCats(data.data);
        console.log('✅ 고양이 데이터 로드:', data.data.length, '마리');
      }
    } catch (err) {
      console.error('❌ 고양이 데이터 로드 실패:', err);
    }
  }, [fetchCatsFromApi]);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation이 지원되지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(pos);
        console.log('📍 현재 위치:', pos);
        
        // 지도 중심을 현재 위치로 이동
        if (mapInstance.current) {
          const moveLatLon = new window.kakao.maps.LatLng(pos.lat, pos.lng);
          mapInstance.current.panTo(moveLatLon);
          
          // 현재 위치 마커 추가/업데이트
          updateCurrentLocationMarker(pos);
        }
      },
      (error) => {
        console.error('❌ 위치 정보를 가져올 수 없습니다:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, []);

  // 현재 위치 마커 업데이트
  const updateCurrentLocationMarker = (position: { lat: number; lng: number }) => {
    if (!window.kakao?.maps || !mapInstance.current) return;

    // 기존 마커 제거
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    // 커스텀 마커 이미지 생성 (파란색 원)
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    // 새 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      map: mapInstance.current,
      image: markerImage,
      title: '현재 위치',
      zIndex: 999
    });

    currentLocationMarkerRef.current = marker;
  };

  // 간단한 지도 초기화
  useEffect(() => {
    console.log('📍 useEffect 실행됨, mapContainer:', !!mapContainer.current);
    let isMounted = true;

    const initMap = async () => {
      console.log('🔍 initMap 호출됨, mapContainer.current:', !!mapContainer.current);
      if (!mapContainer.current) {
        console.warn('⚠️ mapContainer가 준비되지 않음, 500ms 후 재시도...');
        setTimeout(initMap, 500);
        return;
      }

      console.log('🚀 간단한 카카오맵 시작...');
      setIsLoading(true);
      setError(null);

      try {
        // API 로드
        const loaded = await loadKakaoMap();
        if (!loaded || !isMounted) {
          throw new Error('카카오맵 API 로드 실패');
        }

        // 지도 생성 (초기 위치는 서울시청, 현재 위치로 이동 예정)
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 4
        };

        mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options);
        console.log('✅ 지도 생성 완료!');
        
        // 인포윈도우 생성
        infoWindowRef.current = new window.kakao.maps.InfoWindow({
          zIndex: 1,
          removable: true
        });

        // 데이터 가져오기
        await fetchCats();
        
        // 현재 위치 가져오기
        getCurrentLocation();

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('❌ 지도 초기화 실패:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : '알 수 없는 오류');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      // 마커들 정리
      markersRef.current.forEach(marker => marker.setMap(null));
      customOverlayRef.current.forEach(overlay => overlay.setMap(null));
      markersRef.current.clear();
      customOverlayRef.current.clear();
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
    };
  }, [fetchCats, getCurrentLocation]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    console.log('🐱 마커 업데이트, 고양이 수:', cats.length);

    // 기존 마커 및 오버레이 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    customOverlayRef.current.forEach(overlay => overlay.setMap(null));
    markersRef.current.clear();
    customOverlayRef.current.clear();

    // 새 마커 추가
    cats.forEach(cat => {
      const position = new window.kakao.maps.LatLng(cat.lat, cat.lng);
      
      // 커스텀 마커 컨텐츠 생성 (고양이 이모지와 이름)
      const content = document.createElement('div');
      content.innerHTML = `
        <div style="
          position: relative;
          display: inline-block;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          <div style="
            background: ${cat.isNeutered ? '#10b981' : '#ec4899'};
            color: white;
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            border: 3px solid white;
            transition: all 0.3s;
          " 
          class="cat-marker"
          data-cat-id="${cat.id}">
            🐱
          </div>
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            margin-top: 5px;
            display: ${hoveredCatId === cat.id || selectedCatId === cat.id ? 'block' : 'none'};
          " class="cat-label">
            ${cat.name}
          </div>
        </div>
      `;

      // 커스텀 오버레이 생성
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        zIndex: selectedCatId === cat.id ? 999 : 1
      });

      customOverlay.setMap(mapInstance.current);
      customOverlayRef.current.set(cat.id, customOverlay);

      // 마커 클릭 이벤트
      content.addEventListener('click', () => {
        // 인포윈도우 내용 생성
        const infoContent = `
          <div style="padding:15px;min-width:250px;">
            ${cat.image ? `<img src="${cat.image}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:10px;">` : ''}
            <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:bold;">${cat.name}</h3>
            <p style="margin:5px 0;font-size:13px;color:#666;">📍 최근 목격: ${cat.lastSeen}</p>
            <p style="margin:5px 0;font-size:13px;color:#666;">👁️ 목격 횟수: ${cat.reportCount}회</p>
            ${cat.isNeutered ? '<span style="background:#10b981;color:white;padding:3px 8px;border-radius:4px;font-size:12px;">✂️ 중성화 완료</span>' : '<span style="background:#fbbf24;color:white;padding:3px 8px;border-radius:4px;font-size:12px;">⚠️ 중성화 필요</span>'}
            <div style="margin-top:12px;">
              <button onclick="window.selectCat('${cat.id}')" style="background:linear-gradient(135deg,#ec4899,#8b5cf6);color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;width:100%;">🔍 상세정보 보기</button>
            </div>
          </div>
        `;
        
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.setPosition(position);
        infoWindowRef.current.open(mapInstance.current);
        onCatSelect(cat.id);
      });

      // 마커 호버 이벤트
      content.addEventListener('mouseenter', () => {
        const label = content.querySelector('.cat-label') as HTMLElement;
        const marker = content.querySelector('.cat-marker') as HTMLElement;
        if (label) label.style.display = 'block';
        if (marker) {
          marker.style.transform = 'scale(1.2)';
          marker.style.zIndex = '1000';
        }
        setHoveredCatId(cat.id);
      });

      content.addEventListener('mouseleave', () => {
        if (selectedCatId !== cat.id) {
          const label = content.querySelector('.cat-label') as HTMLElement;
          const marker = content.querySelector('.cat-marker') as HTMLElement;
          if (label) label.style.display = 'none';
          if (marker) {
            marker.style.transform = 'scale(1)';
            marker.style.zIndex = '1';
          }
        }
        setHoveredCatId(null);
      });
    });
    
    // 전역 함수로 고양이 선택 핸들러 등록
    (window as any).selectCat = (catId: string) => {
      onCatSelect(catId);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [cats, onCatSelect, hoveredCatId, selectedCatId]);

  // 5초마다 데이터 새로고침 (실시간 업데이트)
  useEffect(() => {
    if (!fetchCatsFromApi) return;
    
    const interval = setInterval(() => {
      fetchCats();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchCats, fetchCatsFromApi]);

  // 선택된 고양이로 지도 이동
  useEffect(() => {
    if (!selectedCatId || !mapInstance.current || !window.kakao?.maps) return;
    
    const selectedCat = cats.find(cat => cat.id === selectedCatId);
    if (selectedCat) {
      const moveLatLon = new window.kakao.maps.LatLng(selectedCat.lat, selectedCat.lng);
      mapInstance.current.setLevel(3);
      mapInstance.current.panTo(moveLatLon);
      
      // 선택된 마커 강조
      const overlay = customOverlayRef.current.get(selectedCatId);
      if (overlay) {
        overlay.setZIndex(999);
        const content = overlay.getContent();
        const marker = content.querySelector('.cat-marker');
        const label = content.querySelector('.cat-label');
        if (marker) {
          marker.style.transform = 'scale(1.3)';
          marker.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.8)';
        }
        if (label) {
          label.style.display = 'block';
        }
      }
    }
  }, [selectedCatId, cats]);

  return (
    <div className={`${className} relative`}>
      {/* 실제 지도 컨테이너 (항상 렌더링) */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      
      {/* 현재 위치 버튼 */}
      {!isLoading && !error && (
        <button
          onClick={getCurrentLocation}
          className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
          title="현재 위치로 이동"
        >
          <Navigation className="w-5 h-5 text-blue-500" />
        </button>
      )}
      
      {/* 범례 */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg z-10">
          <div className="text-xs font-semibold mb-2">범례</div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">🐱</div>
              <span>일반 고양이</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🐱</div>
              <span>중성화 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>내 위치</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 고양이 수 표시 */}
      {!isLoading && !error && cats.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg z-10">
          <div className="text-sm font-semibold text-pink-600">
            🐱 {cats.length}마리 발견
          </div>
        </div>
      )}
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-gray-600">카카오맵 로딩 중...</div>
          </div>
        </div>
      )}
      
      {/* 에러 오버레이 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 z-10">
          <div className="text-center text-red-600">
            <div className="text-2xl mb-2">❌</div>
            <div>지도 로드 실패: {error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              새로고침
            </button>
          </div>
        </div>
      )}
    </div>
  );
}