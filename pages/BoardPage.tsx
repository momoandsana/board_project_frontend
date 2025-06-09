
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { PostSummary, BoardType as BoardTypeEnum } from '../types';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/Toast';

const BoardPage: React.FC = () => {
  const { boardType } = useParams<{ boardType: BoardTypeEnum }>();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    if (!boardType) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getPosts(boardType);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts.');
      showToast('error', err.message || 'Failed to fetch posts.');
    } finally {
      setIsLoading(false);
    }
  }, [boardType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const boardTitle = boardType === BoardTypeEnum.FREE ? 'Free Board' : 'Notice Board';

  if (isLoading) return <LoadingSpinner message={`Loading ${boardTitle}...`} />;
  
  return (
    <div className="bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-neutral-700">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-700">
        <h2 className="text-3xl font-bold text-neutral-100">{boardTitle}</h2>
        {user && (
          <Link to={`/post/create/${boardType}`}>
            <Button variant="primary">Create New Post</Button>
          </Link>
        )}
      </div>

      {error && <div className="text-center text-status-danger p-4 bg-status-danger bg-opacity-10 rounded-md mb-6">{error}</div>}

      {posts.length === 0 && !isLoading && !error && (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-neutral-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
          <p className="text-xl text-neutral-400">No posts found in this board yet.</p>
          {user && (
            <p className="text-neutral-500 mt-2">
              Be the first to <Link to={`/post/create/${boardType}`} className="text-neutral-300 hover:underline">create one</Link>!
            </p>
          )}
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardPage;