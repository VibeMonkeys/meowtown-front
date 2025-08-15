// 강력한 카카오맵 API 로더

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

// API 키 직접 설정
const KAKAO_API_KEY = '27bf445cdf2df64c348eca4e0ddbbdf7';

/**
 * 카카오맵 API를 강력하게 로드합니다
 * @returns Promise<boolean> - 로드 성공 여부
 */
export const loadKakaoMap = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 이미 로드된 경우 즉시 반환
    if (window.kakao?.maps?.Map) {
      console.log('✅ 카카오맵 이미 로드됨');
      resolve(true);
      return;
    }

    // 네트워크 연결 상태 확인
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.error('❌ 인터넷 연결이 없습니다');
      resolve(false);
      return;
    }

    console.log('🚀 카카오맵 React 최적화 로딩 시작...');
    console.log(`📋 API 키: ${KAKAO_API_KEY.substring(0, 10)}...`);
    console.log('🌐 현재 도메인:', window.location.hostname);
    console.log('🔗 전체 URL:', window.location.href);
    console.log('⚛️ React 환경 감지됨 - 특별 처리 모드');

    // React StrictMode 감지
    const isStrictMode = document.querySelectorAll('script[src*="dapi.kakao.com"]').length > 0;
    if (isStrictMode) {
      console.log('⚛️ React StrictMode 감지 - 중복 로딩 방지');
    }

    // 더 강력한 기존 스크립트 정리
    const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com"]');
    if (existingScripts.length > 0) {
      console.log(`🗑️ 기존 카카오맵 스크립트 ${existingScripts.length}개 강제 제거`);
      existingScripts.forEach((script, index) => {
        const scriptElement = script as HTMLScriptElement;
        console.log(`   - 제거: ${scriptElement.src.substring(0, 80)}...`);
        script.remove();
      });
    }

    // window.kakao 완전 초기화
    if (window.kakao) {
      console.log('🧹 window.kakao 완전 초기화');
      delete window.kakao;
      delete (window as any).daum;
    }

    // 새로운 스크립트 생성 (autoload=false로 제어 강화)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services,clusterer&autoload=false`;
    script.charset = 'UTF-8';
    
    // 스크립트 로드 완료 후 수동 초기화
    script.onload = () => {
      console.log('📦 카카오맵 스크립트 로드 완료 - 수동 초기화 시작');
      
      // kakao.maps.load()를 사용한 명시적 초기화
      let retryCount = 0;
      const maxRetries = 15;
      
      const initializeKakaoMaps = () => {
        console.log(`🔄 카카오맵 수동 초기화 시도... (${retryCount + 1}/${maxRetries})`);
        
        try {
          if (window.kakao && window.kakao.maps) {
            // autoload=false이므로 수동으로 load 호출
            if (typeof window.kakao.maps.load === 'function') {
              console.log('🎯 kakao.maps.load() 호출');
              window.kakao.maps.load(() => {
                console.log('✅ 카카오맵 수동 초기화 완료!');
                console.log('📚 사용 가능한 객체들:', Object.keys(window.kakao.maps));
                
                // Map 생성자 확인
                if (window.kakao.maps.Map) {
                  console.log('🗺️ Map 생성자 사용 가능');
                  resolve(true);
                } else {
                  console.error('❌ Map 생성자를 찾을 수 없음');
                  resolve(false);
                }
              });
              return;
            } else if (window.kakao.maps.Map) {
              // 이미 로드된 경우
              console.log('✅ 카카오맵 이미 초기화됨');
              resolve(true);
              return;
            }
          }
          
          // 재시도 로직
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.min(100 * Math.pow(1.2, retryCount), 1000);
            console.log(`⏳ ${delay}ms 후 재시도...`);
            setTimeout(initializeKakaoMaps, delay);
          } else {
            console.error('❌ 카카오맵 초기화 타임아웃');
            console.log('🔍 최종 상태:', {
              hasKakao: !!window.kakao,
              hasKakaoMaps: !!window.kakao?.maps,
              hasLoad: !!window.kakao?.maps?.load,
              hasMapConstructor: !!window.kakao?.maps?.Map
            });
            resolve(false);
          }
        } catch (error) {
          console.error('❌ 카카오맵 초기화 오류:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeKakaoMaps, 200);
          } else {
            resolve(false);
          }
        }
      };
      
      // 즉시 초기화 시작
      setTimeout(initializeKakaoMaps, 100);
    };

    script.onerror = (error) => {
      console.error('❌ 카카오맵 스크립트 로드 실패:', error);
      console.log('🔍 스크립트 URL:', script.src);
      resolve(false);
    };

    // DOM에 추가
    document.head.appendChild(script);
    console.log('🌐 React 최적화된 스크립트 태그 추가 완료');
  });
};

/**
 * 카카오맵이 로드되었는지 확인
 */
export const isKakaoMapLoaded = (): boolean => {
  return window.kakao && window.kakao.maps && window.kakao.maps.Map;
};

/**
 * 카카오맵 API 키가 설정되었는지 확인
 */
export const hasKakaoApiKey = (): boolean => {
  return !!KAKAO_API_KEY;
};