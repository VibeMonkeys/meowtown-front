# 카카오맵 API 설정 가이드

## 1. 카카오 개발자 콘솔 설정

### 1-1. 애플리케이션 등록
1. [카카오 개발자 콘솔](https://developers.kakao.com/console/app) 접속
2. 애플리케이션 등록 또는 기존 앱 선택
3. 플랫폼 설정에서 "Web" 플랫폼 추가

### 1-2. 도메인 등록 (중요!)
**Web 플랫폼 설정에서 다음 도메인들을 모두 추가해야 합니다:**

```
# 로컬 개발 환경
http://localhost:3000
http://localhost:3001

# Vercel 배포 도메인 (실제 배포 URL로 변경)
https://meowtown-front.vercel.app
https://meowtown-front-mjmigbma8-kimkyunghun3s-projects.vercel.app

# 기타 필요한 도메인들
```

⚠️ **주의사항**: 
- `http://`와 `https://` 모두 등록해야 함
- 포트 번호(3000, 3001)도 정확히 입력
- Vercel의 자동 생성 도메인들도 모두 등록

### 1-3. JavaScript 키 확인
1. 앱 설정 > 앱 키에서 "JavaScript 키" 복사
2. 현재 사용중인 키: `27bf445c...` (앞 8자리)

## 2. 로컬 환경 설정

`.env` 파일에 다음과 같이 설정:
```bash
REACT_APP_KAKAO_API_KEY=your_javascript_key_here
```

## 3. Vercel 환경변수 설정

### 방법 1: Vercel 대시보드에서 설정
1. [Vercel 프로젝트 대시보드](https://vercel.com/dashboard) 접속
2. meowtown-front 프로젝트 선택
3. Settings > Environment Variables
4. 새 환경변수 추가:
   - **Name**: `REACT_APP_KAKAO_API_KEY`
   - **Value**: `your_javascript_key_here`
   - **Environment**: Production, Preview, Development 모두 체크

### 방법 2: Vercel CLI로 설정
```bash
# Vercel CLI 설치 (필요시)
npm i -g vercel

# 환경변수 설정
vercel env add REACT_APP_KAKAO_API_KEY production
# 값 입력: your_javascript_key_here

# 재배포
vercel --prod
```

## 4. 문제 해결

### 4-1. "카카오맵을 불러오는 중..." 메시지만 나타나는 경우
1. 브라우저 개발자 도구(F12) > Console 탭에서 에러 메시지 확인
2. 일반적인 에러들:
   ```javascript
   // 도메인 등록 안됨
   "Uncaught Error: 등록되지 않은 도메인입니다"
   
   // API 키 문제  
   "Uncaught Error: Invalid app key"
   
   // 네트워크 문제
   "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"
   ```

### 4-2. 해결 방법
1. **도메인 에러**: 카카오 개발자 콘솔에서 현재 도메인 추가
2. **API 키 에러**: 환경변수 설정 확인 및 키 유효성 검증
3. **네트워크 에러**: 광고 차단기 해제 또는 HTTPS 사용

### 4-3. 디버깅 도구
브라우저 콘솔에서 다음 명령어로 현재 상태 확인:
```javascript
// API 키 확인
console.log('API Key:', process.env.REACT_APP_KAKAO_API_KEY?.substring(0,4) + '****');

// 현재 도메인 확인  
console.log('Current domain:', window.location.hostname);

// 카카오맵 로딩 상태 확인
console.log('Kakao loaded:', !!window.kakao?.maps?.Map);
```

## 5. 현재 상태
- ✅ 로컬 환경: API 키 설정됨
- ❓ Vercel 환경: 환경변수 설정 필요 확인
- ❓ 카카오 콘솔: Vercel 도메인 등록 필요 확인

## 다음 단계
1. Vercel에서 환경변수 설정 확인
2. 카카오 개발자 콘솔에서 Vercel 도메인 등록 확인
3. 재배포 후 테스트