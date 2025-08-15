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

    console.log('🚀 카카오맵 최종 버전 로딩 시작...');
    console.log(`📋 API 키: ${KAKAO_API_KEY.substring(0, 10)}...`);

    // 기존 스크립트가 있다면 제거
    const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com"]');
    existingScripts.forEach((script, index) => {
      console.log(`🗑️ 기존 스크립트 ${index + 1} 제거`);
      script.remove();
    });

    // 매우 간단하고 직접적인 방법
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services,clusterer`;
    
    script.onload = () => {
      console.log('📦 카카오맵 스크립트 로드 완료');
      
      // 간단한 대기 후 확인
      setTimeout(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
          console.log('🎯 카카오맵 API 사용 준비 완료!');
          console.log('📚 사용 가능한 객체들:', Object.keys(window.kakao.maps));
          resolve(true);
        } else {
          console.error('❌ 카카오맵 객체를 찾을 수 없음');
          console.log('🔍 window.kakao:', !!window.kakao);
          console.log('🔍 window.kakao.maps:', !!window.kakao?.maps);
          resolve(false);
        }
      }, 500);
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