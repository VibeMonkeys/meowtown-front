# 🐱 MeowTown 설정 가이드

## 환경변수 설정

카카오맵을 사용하기 위해 API 키 설정이 필요합니다.

### 1. 카카오 개발자 계정 생성
1. [카카오 개발자 사이트](https://developers.kakao.com) 접속
2. 카카오 계정으로 로그인
3. "내 애플리케이션" > "애플리케이션 추가하기"
4. 앱 이름: "MeowTown" 입력 후 저장

### 2. JavaScript 키 발급
1. 생성한 앱 선택
2. "앱 키" 탭에서 "JavaScript 키" 복사
3. "플랫폼" 탭 > "Web 플랫폼 등록"
4. 사이트 도메인: `http://localhost:3000` 추가

### 3. .env 파일 설정
프로젝트 루트에 `.env` 파일 생성:

```bash
# .env 파일
REACT_APP_KAKAO_API_KEY=발급받은_JavaScript_키_입력
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_APP_NAME=MeowTown
REACT_APP_VERSION=1.0.0
```

### 4. 실행
```bash
npm install
npm start
```

## ⚠️ 보안 주의사항

- ✅ `.env` 파일은 `.gitignore`에 포함되어 있어 GitHub에 업로드되지 않습니다
- ✅ `.env.example` 파일을 참고해서 설정하세요
- ❌ API 키를 절대 코드에 직접 작성하지 마세요

## 🗺️ 지도 기능

API 키 설정 후 다음 기능들을 사용할 수 있습니다:

- 📍 실시간 고양이 위치 표시
- 🎯 내 주변 고양이 찾기
- 🔍 고양이 클러스터링
- 🗺️ 지도 타입 전환 (일반/위성)
- 🔥 활동 빈도 히트맵
- 📱 모바일 최적화 컨트롤

## 문제해결

### Q: 지도가 표시되지 않아요
- `.env` 파일이 프로젝트 루트에 있는지 확인
- API 키가 올바른지 확인
- 개발자 도구 콘솔에서 오류 메시지 확인

### Q: 마커가 표시되지 않아요
- 고양이 데이터에 lat, lng 좌표가 있는지 확인
- 브라우저 위치 권한이 허용되어 있는지 확인

### Q: 배포 시 지도가 안 보여요
- 배포 도메인을 카카오 개발자 콘솔의 "Web 플랫폼"에 추가
- 환경변수가 배포 환경에 설정되어 있는지 확인

## 📞 지원

문제가 있으시면 GitHub Issues에 등록해주세요!