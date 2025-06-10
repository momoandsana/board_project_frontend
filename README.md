# Board Project Frontend

## 개요
React + Vite + TypeScript + Tailwind CSS 기반 커뮤니티 게시판 프론트엔드입니다.  
백엔드 API와 연동해 게시글·댓글 CRUD, 인증, 관리자 기능을 제공합니다.

## 주요 기능
- 회원가입 / 로그인 / 로그아웃  
- 게시글 생성·조회·수정·삭제  
- 댓글 작성·삭제  
- 이미지 업로드 (JPG/PNG/GIF, 최대 5MB)  
- 관리자 페이지: 사용자 목록 조회·삭제  
- Protected Route 적용  
- 토스트 알림  

## 기술 스택
- React 18  
- TypeScript  
- Vite  
- Tailwind CSS  
- React Router v7  
- Axios  
- Context API  
- 커스텀 Hook(`useAuth`)  

## 설치 및 실행
```bash
git clone https://github.com/사용자명/리포지토리명.git
cd board_project_frontend-main
npm install
```

### 환경 설정
`src/constants.ts` 파일에서 `API_BASE_URL`을 실제 백엔드 주소로 변경하세요.

```ts
export const API_BASE_URL = "https://your-backend-domain";
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 프로젝트 구조
```
board_project_frontend-main/
├ public/
│  └ index.html
├ src/
│  ├ components/       # 공통 컴포넌트
│  ├ pages/            # 라우트 페이지
│  ├ contexts/         # AuthContext
│  ├ hooks/            # 커스텀 Hook
│  ├ services/         # API 호출 모듈
│  ├ types.ts          # 공용 타입 정의
│  └ App.tsx           # 라우터 설정
├ src/constants.ts     # API 주소 설정
├ vite.config.ts
└ package.json
```

## 기여 방법
1. Fork  
2. 브랜치 생성: `git checkout -b feature/기능명`  
3. 커밋: `git commit -m "feat: 설명"`  
4. PR 생성 및 리뷰 요청  

## 라이선스
MIT License
