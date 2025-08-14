# 냥이도감(MeowTown) 백엔드 개발 요구사항

## 프로젝트 개요
동네 길고양이를 관리하고 커뮤니티를 구성하는 플랫폼의 백엔드 API 서버

## 기술 스택 권장사항
- **언어**: Node.js (TypeScript) 또는 Python (FastAPI)
- **데이터베이스**: PostgreSQL + Redis (캐시)
- **파일 저장**: AWS S3 또는 Cloudinary
- **인증**: JWT
- **실시간**: Socket.io 또는 WebSocket

## 데이터베이스 스키마 설계

### 1. Users (사용자)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  phone_number VARCHAR(20),
  location VARCHAR(200),
  is_verified BOOLEAN DEFAULT false,
  role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Cats (고양이 정보)
```sql
CREATE TABLE cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  estimated_age VARCHAR(50),
  gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
  is_neutered BOOLEAN DEFAULT false,
  primary_image_url TEXT,
  location VARCHAR(200) NOT NULL,
  coordinates POINT, -- 위도, 경도 저장
  last_seen_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  reported_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_cats_location (location),
  INDEX idx_cats_coordinates USING GIST (coordinates),
  INDEX idx_cats_last_seen (last_seen_at),
  INDEX idx_cats_reported_by (reported_by)
);
```

### 3. Cat Images (고양이 이미지)
```sql
CREATE TABLE cat_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Cat Characteristics (고양이 특징 태그)
```sql
CREATE TABLE cat_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
  characteristic VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(cat_id, characteristic)
);
```

### 5. Sightings (목격 제보)
```sql
CREATE TABLE sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id),
  location VARCHAR(200) NOT NULL,
  coordinates POINT,
  sighting_time TIMESTAMP NOT NULL,
  notes TEXT,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_sightings_cat (cat_id),
  INDEX idx_sightings_time (sighting_time),
  INDEX idx_sightings_coordinates USING GIST (coordinates)
);
```

### 6. Community Posts (커뮤니티 게시글)
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id),
  cat_id UUID REFERENCES cats(id) ON DELETE SET NULL,
  post_type ENUM('sighting', 'help', 'update', 'general') NOT NULL,
  title VARCHAR(200),
  content TEXT NOT NULL,
  location VARCHAR(200),
  coordinates POINT,
  image_urls TEXT[], -- 다중 이미지 지원
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_posts_author (author_id),
  INDEX idx_posts_cat (cat_id),
  INDEX idx_posts_type (post_type),
  INDEX idx_posts_created (created_at)
);
```

### 7. Likes (좋아요)
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type ENUM('cat', 'post', 'comment') NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, target_type, target_id),
  INDEX idx_likes_target (target_type, target_id)
);
```

### 8. Comments (댓글)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id),
  target_type ENUM('cat', 'post') NOT NULL,
  target_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id), -- 대댓글 지원
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_comments_target (target_type, target_id),
  INDEX idx_comments_author (author_id)
);
```

### 9. Notifications (알림)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('new_sighting', 'comment', 'like', 'mention', 'cat_update') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- 관련된 고양이/게시글 ID
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_unread (user_id, is_read)
);
```

## API 엔드포인트 설계

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/verify-email` - 이메일 인증
- `POST /api/auth/forgot-password` - 비밀번호 찾기

### 사용자 API
- `GET /api/users/profile` - 내 프로필 조회
- `PUT /api/users/profile` - 프로필 수정
- `POST /api/users/avatar` - 프로필 이미지 업로드
- `GET /api/users/:id` - 다른 사용자 프로필 조회

### 고양이 관리 API
- `GET /api/cats` - 고양이 목록 (필터링, 검색, 페이징)
- `GET /api/cats/:id` - 특정 고양이 상세 정보
- `POST /api/cats` - 새 고양이 등록
- `PUT /api/cats/:id` - 고양이 정보 수정 (제보자만)
- `DELETE /api/cats/:id` - 고양이 삭제 (제보자/관리자만)
- `POST /api/cats/:id/images` - 고양이 이미지 추가
- `DELETE /api/cats/:id/images/:imageId` - 이미지 삭제
- `POST /api/cats/:id/characteristics` - 특징 태그 추가
- `DELETE /api/cats/:id/characteristics/:characteristicId` - 특징 태그 삭제

### 목격 제보 API
- `GET /api/sightings` - 목격 제보 목록
- `GET /api/sightings/:id` - 특정 제보 상세
- `POST /api/sightings` - 새 목격 제보
- `PUT /api/sightings/:id` - 제보 수정 (제보자만)
- `DELETE /api/sightings/:id` - 제보 삭제 (제보자/관리자만)
- `GET /api/cats/:id/sightings` - 특정 고양이 목격 기록

### 지도 API
- `GET /api/map/cats` - 지도용 고양이 위치 데이터
- `GET /api/map/sightings` - 지도용 최근 목격 데이터
- `GET /api/map/nearby` - 주변 고양이 검색 (좌표 기반)

### 커뮤니티 API
- `GET /api/posts` - 게시글 목록 (필터링, 정렬, 페이징)
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/posts` - 게시글 작성
- `PUT /api/posts/:id` - 게시글 수정 (작성자만)
- `DELETE /api/posts/:id` - 게시글 삭제 (작성자/관리자만)

### 상호작용 API
- `POST /api/likes` - 좋아요/취소
- `GET /api/cats/:id/likes` - 고양이 좋아요 목록
- `GET /api/posts/:id/likes` - 게시글 좋아요 목록

### 댓글 API
- `GET /api/comments` - 댓글 목록 (target_type, target_id로 필터)
- `POST /api/comments` - 댓글 작성
- `PUT /api/comments/:id` - 댓글 수정 (작성자만)
- `DELETE /api/comments/:id` - 댓글 삭제 (작성자/관리자만)

### 알림 API
- `GET /api/notifications` - 내 알림 목록
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리
- `DELETE /api/notifications/:id` - 알림 삭제

### 통계 API
- `GET /api/stats/dashboard` - 대시보드 통계
- `GET /api/stats/cats` - 고양이 통계 (지역별, 중성화율 등)
- `GET /api/stats/community` - 커뮤니티 활동 통계

### 검색 API
- `GET /api/search/cats` - 고양이 검색 (이름, 특징, 위치)
- `GET /api/search/posts` - 게시글 검색
- `GET /api/search/users` - 사용자 검색

### 파일 업로드 API
- `POST /api/upload/image` - 단일 이미지 업로드
- `POST /api/upload/images` - 다중 이미지 업로드
- `DELETE /api/upload/:fileId` - 파일 삭제

## 주요 기능 요구사항

### 1. 인증 및 권한
- JWT 기반 인증
- 이메일 인증 (선택사항)
- 역할 기반 접근 제어 (일반, 조정자, 관리자)
- API 호출 제한 (Rate Limiting)

### 2. 파일 관리
- 이미지 업로드 및 최적화 (리사이징, 압축)
- 썸네일 자동 생성
- CDN 연동 (CloudFront, CloudFlare 등)
- 파일 크기 및 형식 제한

### 3. 지리적 검색
- 좌표 기반 반경 검색
- 지역명 기반 검색
- 지도 경계 내 검색 (Bounding Box)

### 4. 검색 및 필터링
- 고양이: 이름, 특징, 위치, 성별, 중성화 여부, 마지막 목격일
- 게시글: 제목, 내용, 작성자, 게시글 유형, 작성일
- 정렬: 최신순, 인기순, 거리순, 알파벳순

### 5. 실시간 기능 (선택사항)
- 새로운 목격 제보 실시간 알림
- 댓글/좋아요 실시간 업데이트
- 온라인 사용자 표시

### 6. 통계 및 분석
- 대시보드 통계 (총 고양이 수, 이번 주 신규 등록, 활동 중인 사용자)
- 중성화율 계산 및 진행 상황
- 지역별 고양이 분포
- 사용자 활동 통계

### 7. 성능 최적화
- 데이터베이스 인덱싱
- Redis 캐싱 (자주 조회되는 데이터)
- 페이징 및 무한 스크롤
- 이미지 lazy loading

### 8. 보안
- SQL Injection 방지
- XSS 공격 방지
- CSRF 토큰
- 파일 업로드 보안
- 개인정보 암호화

### 9. 모니터링 및 로깅
- API 호출 로그
- 에러 추적 (Sentry 등)
- 성능 모니터링
- 헬스 체크 엔드포인트

## 환경 변수
```env
# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/meowtown
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# 파일 저장
AWS_S3_BUCKET=meowtown-images
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-2

# 이메일 (선택)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# 기타
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://localhost:3000
```

## API 응답 형식 표준

### 성공 응답
```json
{
  "success": true,
  "data": {}, // 또는 []
  "message": "요청이 성공적으로 처리되었습니다",
  "timestamp": "2024-01-15T10:30:00Z",
  "pagination": { // 목록 조회 시에만
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "CAT_NOT_FOUND",
    "message": "해당 고양이를 찾을 수 없습니다",
    "details": "ID: cat-123",
    "field": "catId" // 유효성 검사 오류 시
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 표준 에러 코드

### 인증 관련 (4000번대)
- `AUTH_TOKEN_MISSING`: 인증 토큰이 없음
- `AUTH_TOKEN_INVALID`: 유효하지 않은 토큰
- `AUTH_TOKEN_EXPIRED`: 만료된 토큰
- `AUTH_PERMISSION_DENIED`: 권한 없음
- `AUTH_LOGIN_FAILED`: 로그인 실패

### 사용자 관련 (4100번대)
- `USER_NOT_FOUND`: 사용자를 찾을 수 없음
- `USER_EMAIL_EXISTS`: 이메일이 이미 존재
- `USER_USERNAME_EXISTS`: 사용자명이 이미 존재
- `USER_INVALID_CREDENTIALS`: 잘못된 인증 정보

### 고양이 관련 (4200번대)
- `CAT_NOT_FOUND`: 고양이를 찾을 수 없음
- `CAT_ALREADY_EXISTS`: 이미 등록된 고양이 (중복)
- `CAT_UNAUTHORIZED`: 고양이 수정/삭제 권한 없음
- `CAT_IMAGE_LIMIT_EXCEEDED`: 이미지 개수 제한 초과
- `CAT_INVALID_COORDINATES`: 유효하지 않은 좌표

### 파일 관련 (4300번대)
- `FILE_TOO_LARGE`: 파일 크기 초과
- `FILE_INVALID_TYPE`: 지원하지 않는 파일 형식
- `FILE_UPLOAD_FAILED`: 파일 업로드 실패

### 일반적인 오류 (4900-5000번대)
- `VALIDATION_ERROR`: 유효성 검사 오류
- `RATE_LIMIT_EXCEEDED`: 요청 제한 초과
- `INTERNAL_SERVER_ERROR`: 서버 내부 오류

## 상세 API 명세

### 고양이 목록 조회
```http
GET /api/cats?page=1&limit=20&location=서초구&gender=female&isNeutered=true&sortBy=lastSeen&order=desc
```

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20, 최대: 100)
- `location`: 위치 필터 (부분 매치)
- `gender`: 성별 필터 (male, female, unknown)
- `isNeutered`: 중성화 여부 (true, false)
- `characteristics`: 특징 태그 (comma-separated)
- `sortBy`: 정렬 기준 (name, lastSeen, created, likes)
- `order`: 정렬 순서 (asc, desc)
- `radius`: 반경 검색 (meters, coordinates와 함께 사용)
- `lat`, `lng`: 좌표 기반 검색

### 고양이 등록
```http
POST /api/cats
Content-Type: multipart/form-data

{
  "name": "치즈",
  "description": "오렌지 털색의 친근한 고양이",
  "estimatedAge": "2-3살",
  "gender": "male",
  "isNeutered": true,
  "location": "서초구 반포동 래미안 아파트",
  "coordinates": {
    "lat": 37.5665,
    "lng": 126.9780
  },
  "characteristics": ["치즈", "친근함", "주황털"],
  "images": [File, File] // multipart files
}
```

### 지도용 고양이 데이터
```http
GET /api/map/cats?bounds=37.5665,126.9780,37.5765,126.9880&zoom=15
```

**응답:**
```json
{
  "success": true,
  "data": {
    "cats": [
      {
        "id": "cat-123",
        "name": "치즈",
        "coordinates": {"lat": 37.5665, "lng": 126.9780},
        "lastSeen": "2024-01-15T08:00:00Z",
        "isNeutered": true,
        "primaryImage": "https://cdn.example.com/cats/cat-123-thumb.jpg",
        "reportCount": 15
      }
    ],
    "clusters": [
      {
        "coordinates": {"lat": 37.5665, "lng": 126.9780},
        "count": 5,
        "bounds": {...}
      }
    ]
  }
}
```

## 비즈니스 로직 세부사항

### 중복 고양이 등록 방지
- 같은 위치(반경 100m 이내) + 비슷한 특징 조합 시 중복 알림
- 이름 유사도 검사 (Levenshtein distance)
- 관리자가 중복 여부 최종 판단

### 목격 제보 검증
- 이전 목격 위치와 시간을 고려한 이동 가능성 검증
- 하루 최대 제보 횟수 제한 (사용자당 10회)
- 의심스러운 제보 자동 플래그 처리

### 알림 발송 조건
- 새 고양이 등록: 주변 1km 내 사용자에게 알림
- 목격 제보: 해당 고양이를 팔로우하는 사용자에게 알림
- 댓글/좋아요: 게시글 작성자에게 알림
- 중요 업데이트: 중성화 완료, 입양 등

### 이미지 처리 규칙
- 원본 이미지: 최대 5MB, 2048x2048px
- 썸네일: 300x300px, WEBP 형식
- 리스트용: 600x400px, WEBP 형식
- 불적절한 이미지 AI 검증 (Google Vision API)

### 검색 우선순위
1. 정확한 이름 매치
2. 부분 이름 매치
3. 특징 태그 매치
4. 위치 기반 거리순
5. 최근 목격순

## 성능 요구사항

### 응답 시간 목표
- 목록 조회: 200ms 이하 (95th percentile)
- 상세 조회: 100ms 이하 (95th percentile)
- 검색 요청: 300ms 이하 (95th percentile)
- 파일 업로드: 2초 이하 (10MB 기준)

### 동시성 목표
- 동시 접속자: 1,000명
- 초당 요청 처리: 500 RPS
- 데이터베이스 커넥션 풀: 20-50개

### 캐싱 전략
- 고양이 목록: 5분 캐시 (지역별)
- 사용자 프로필: 30분 캐시
- 이미지 메타데이터: 1시간 캐시
- 통계 데이터: 10분 캐시

### 데이터 제약 조건
- 사용자당 등록 고양이: 50마리 제한
- 일일 목격 제보: 20회 제한
- 이미지 업로드: 일일 100장 제한
- API 호출: 분당 100회 제한

## 유효성 검사 규칙

### 사용자 입력
```javascript
{
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    unique: true
  },
  email: {
    required: true,
    format: 'email',
    unique: true
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
}
```

### 고양이 정보
```javascript
{
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
    sanitize: true
  },
  description: {
    maxLength: 1000,
    sanitize: true
  },
  location: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  coordinates: {
    lat: { type: 'number', min: -90, max: 90 },
    lng: { type: 'number', min: -180, max: 180 }
  },
  characteristics: {
    type: 'array',
    maxItems: 10,
    items: { maxLength: 20 }
  }
}
```

## 테스트 계획

### 단위 테스트
- 모든 API 엔드포인트
- 비즈니스 로직 함수
- 데이터베이스 모델
- 유틸리티 함수

### 통합 테스트
- 인증 플로우
- 파일 업로드 플로우
- 검색 기능
- 알림 시스템

### 성능 테스트
- 부하 테스트 (Artillery.js)
- 데이터베이스 쿼리 최적화
- 메모리 누수 체크

### 보안 테스트
- SQL Injection
- XSS 공격
- 파일 업로드 공격
- 권한 체크

## 배포 및 운영

### 배포 고려사항
- Docker 컨테이너화
- CI/CD 파이프라인 (GitHub Actions)
- 데이터베이스 마이그레이션 관리
- 환경별 설정 분리 (dev, staging, prod)
- 로드 밸런싱 및 스케일링
- SSL/TLS 설정
- 데이터베이스 백업 전략

### 모니터링 설정
```javascript
// 모니터링 메트릭 예시
{
  healthCheck: '/api/health',
  metrics: {
    httpRequests: 'total_http_requests_count',
    responseTime: 'http_request_duration_ms',
    errorRate: 'error_rate_percentage',
    dbConnections: 'database_connections_active'
  },
  alerts: [
    { metric: 'errorRate', threshold: '> 5%', duration: '5m' },
    { metric: 'responseTime', threshold: '> 1000ms', duration: '2m' },
    { metric: 'dbConnections', threshold: '> 80%', duration: '1m' }
  ]
}
```

### 로깅 전략
- 구조화된 로깅 (JSON 형식)
- 로그 레벨: ERROR, WARN, INFO, DEBUG
- 민감한 정보 마스킹 (비밀번호, 토큰 등)
- 로그 로테이션 및 아카이빙

이제 이 문서로 AI가 완전한 백엔드를 구현할 수 있습니다!