# Board Project Frontend

## Overview
This is a community board frontend built with React + Vite + TypeScript + Tailwind CSS.  
It integrates with a backend API to provide CRUD operations for posts and comments, authentication, and admin features.

## Key Features
- Sign up / Log in / Log out  
- Create, Read, Update, Delete posts  
- Write and delete comments  
- Image upload (JPG/PNG/GIF, up to 5MB)  
- Admin page: view and delete users  
- Protected Routes  
- Toast notifications  

## Tech Stack
- React 18  
- TypeScript  
- Vite  
- Tailwind CSS  
- React Router v7  
- Axios  
- Context API  
- Custom Hook (`useAuth`)  

## Installation & Running
```bash
git clone https://github.com/your-username/your-repo.git
cd board_project_frontend-main
npm install
```

### Configuration
In `src/constants.ts`, change `API_BASE_URL` to your actual backend URL:

```ts
export const API_BASE_URL = "https://your-backend-domain";
```

### Start Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure
```
board_project_frontend-main/
├ public/
│  └ index.html
├ src/
│  ├ components/       # Shared components
│  ├ pages/            # Route pages
│  ├ contexts/         # AuthContext
│  ├ hooks/            # Custom hooks
│  ├ services/         # API modules
│  ├ types.ts          # Shared type definitions
│  └ App.tsx           # Router setup
├ src/constants.ts     # API base URL
├ vite.config.ts
└ package.json
```

## Contributing
1. Fork  
2. Create a branch: `git checkout -b feature/your-feature`  
3. Commit: `git commit -m "feat: description"`  
4. Open a PR and request a review  

## License
MIT License
