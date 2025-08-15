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

    console.log('🚀 카카오맵 최종 버전 로딩 시작...');
    console.log(`📋 API 키: ${KAKAO_API_KEY.substring(0, 10)}...`);
    console.log('🌐 현재 도메인:', window.location.hostname);
    console.log('🔗 전체 URL:', window.location.href);

    // 기존 카카오맵 스크립트를 더 선택적으로 제거
    const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
    if (existingScripts.length > 0) {
      console.log(`🗑️ 기존 카카오맵 SDK 스크립트 ${existingScripts.length}개 제거`);
      existingScripts.forEach((script, index) => {
        const scriptElement = script as HTMLScriptElement;
        console.log(`   - 스크립트 ${index + 1}: ${scriptElement.src.substring(0, 80)}...`);
        script.remove();
      });
      
      // window.kakao 객체도 정리
      if (window.kakao) {
        console.log('🧹 기존 window.kakao 객체 정리');
        delete window.kakao;
      }
    }

    // 매우 간단하고 직접적인 방법
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services,clusterer`;
    
    script.onload = () => {
      console.log('📦 카카오맵 스크립트 로드 완료');
      
      // 더 안전한 대기 시간과 재시도 로직
      let retryCount = 0;
      const maxRetries = 10;
      
      const checkKakaoReady = () => {
        console.log(`🔄 카카오맵 준비 상태 확인 중... (${retryCount + 1}/${maxRetries})`);
        console.log('🔍 디버깅 정보:', {
          hasWindow: typeof window !== 'undefined',
          hasKakao: !!window.kakao,
          hasKakaoMaps: !!window.kakao?.maps,
          hasMapConstructor: !!window.kakao?.maps?.Map,
          currentDomain: window.location.hostname,
          userAgent: navigator.userAgent.substring(0, 100) + '...'
        });
        
        if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
          console.log('🎯 카카오맵 API 사용 준비 완료!');
          console.log('📚 사용 가능한 객체들:', Object.keys(window.kakao.maps));
          resolve(true);
        } else if (retryCount < maxRetries) {
          retryCount++;
          // 점진적으로 대기 시간 증가 (200ms, 300ms, 450ms, ...)
          const delay = Math.min(200 * Math.pow(1.5, retryCount), 2000);
          console.log(`⏳ ${delay}ms 후 재시도...`);
          setTimeout(checkKakaoReady, delay);
        } else {
          console.error('❌ 카카오맵 로딩 타임아웃 - 최대 재시도 횟수 초과');
          console.log('🔍 최종 상태:', {
            hasKakao: !!window.kakao,
            hasKakaoMaps: !!window.kakao?.maps,
            hasMapConstructor: !!window.kakao?.maps?.Map
          });
          resolve(false);
        }
      };
      
      // 초기 대기 시간을 1초로 증가
      setTimeout(checkKakaoReady, 1000);
    };

    script.onerror = (error) => {
      console.error('❌ 카카오맵 스크립트 로드 실패:', error);
      resolve(false);
    };

    document.head.appendChild(script);
    console.log('🌐 스크립트 태그 추가 완료');
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