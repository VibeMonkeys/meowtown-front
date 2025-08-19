// 간단하고 확실한 카카오맵 API 로더

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

// API 키를 환경변수에서 가져오기
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY || '27bf445cdf2df64c348eca4e0ddbbdf7';

/**
 * 카카오맵 API를 로드합니다 (단순하고 확실한 방식)
 * @returns Promise<boolean> - 로드 성공 여부
 */
export const loadKakaoMap = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // API 키가 없는 경우
    if (!KAKAO_API_KEY) {
      console.error('❌ 카카오맵 API 키가 설정되지 않았습니다.');
      console.error('💡 .env 파일에 REACT_APP_KAKAO_API_KEY를 설정하거나, 배포 환경에서 환경변수를 설정해주세요.');
      resolve(false);
      return;
    }

    // 이미 완전히 로드된 경우
    if (window.kakao?.maps?.Map && typeof window.kakao.maps.Map === 'function') {
      console.log('✅ 카카오맵 이미 로드됨');
      resolve(true);
      return;
    }

    console.log('🚀 카카오맵 로딩 시작...');
    console.log(`📋 API 키 앞 4자리: ${KAKAO_API_KEY.substring(0, 4)}****`);
    console.log(`🌐 현재 도메인: ${window.location.hostname}`);

    // 기존 스크립트 제거
    const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com"]');
    existingScripts.forEach(script => script.remove());

    // window.kakao 초기화
    if (window.kakao) {
      delete window.kakao;
    }

    // 새 스크립트 생성 (autoload=false로 수동 로드)
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services,clusterer`;
    
    let checkCount = 0;
    const maxChecks = 100; // 10초간 체크 (더 길게)
    
    script.onload = () => {
      console.log('📦 카카오맵 스크립트 로드 완료');
      
      // autoload=false이므로 수동으로 kakao.maps.load 호출
      if (window.kakao && window.kakao.maps) {
        console.log('🔧 kakao.maps.load 수동 호출');
        window.kakao.maps.load(() => {
          console.log('✅ 카카오맵 수동 로드 완료');
          if (window.kakao?.maps?.Map && typeof window.kakao.maps.Map === 'function') {
            console.log('✅ 카카오맵 Map 생성자 확인됨');
            resolve(true);
          } else {
            console.error('❌ Map 생성자를 찾을 수 없음');
            resolve(false);
          }
        });
      } else {
        // kakao 객체가 없으면 주기적으로 확인
        const checkInterval = setInterval(() => {
          checkCount++;
          
          if (window.kakao?.maps) {
            console.log('🔧 kakao.maps 발견, 수동 로드 시도');
            clearInterval(checkInterval);
            window.kakao.maps.load(() => {
              console.log('✅ 카카오맵 수동 로드 완료');
              resolve(true);
            });
          } else if (checkCount >= maxChecks) {
            console.error('❌ 카카오맵 초기화 타임아웃');
            console.log('🔍 현재 상태:', {
              hasKakao: !!window.kakao,
              hasKakaoMaps: !!window.kakao?.maps,
              hasMapConstructor: !!window.kakao?.maps?.Map,
              mapType: typeof window.kakao?.maps?.Map
            });
            clearInterval(checkInterval);
            resolve(false);
          } else {
            console.log(`🔄 카카오맵 초기화 대기... (${checkCount}/${maxChecks})`);
          }
        }, 100);
      }
    };

    script.onerror = (error) => {
      console.error('❌ 카카오맵 스크립트 로드 실패:', error);
      console.error('🔍 가능한 원인:');
      console.error('  1. 카카오 개발자 콘솔에서 현재 도메인이 등록되지 않음');
      console.error('  2. API 키가 유효하지 않음');
      console.error('  3. 네트워크 연결 문제');
      console.error(`🌐 현재 URL: ${window.location.href}`);
      resolve(false);
    };

    // DOM에 추가
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