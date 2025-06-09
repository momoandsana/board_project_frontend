
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import AdminUsersPage from './pages/AdminUsersPage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { ToastContainer } from './components/Toast';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
          
          <Route path="/board/:boardType" element={<BoardPage />} />
          <Route path="/post/create/:boardType" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-neutral-950 text-neutral-400 text-center p-4">
        <p>&copy; {new Date().getFullYear()} CommunityHub. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default App;