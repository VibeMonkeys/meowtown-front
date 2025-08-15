import { useEffect, useRef, useState } from 'react';
import { loadKakaoMap } from '../utils/kakaoMapLoader';

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
}

interface SimpleKakaoMapProps {
  cats: CatMarker[];
  onCatSelect: (catId: string) => void;
  className?: string;
}

export function SimpleKakaoMap({ cats, onCatSelect, className = '' }: SimpleKakaoMapProps) {
  console.log('🗺️ SimpleKakaoMap 컴포넌트 렌더링됨!');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // 지도 생성
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
          level: 3
        };

        mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options);
        console.log('✅ 지도 생성 완료!');

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
    };
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    // 기존 마커 제거 (간단한 방식)
    
    // 새 마커 추가
    cats.forEach(cat => {
      const position = new window.kakao.maps.LatLng(cat.lat, cat.lng);
      const marker = new window.kakao.maps.Marker({
        position: position,
        title: cat.name
      });

      marker.setMap(mapInstance.current);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onCatSelect(cat.id);
      });
    });
  }, [cats, onCatSelect]);

  return (
    <div className={`${className} relative`}>
      {/* 실제 지도 컨테이너 (항상 렌더링) */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      
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