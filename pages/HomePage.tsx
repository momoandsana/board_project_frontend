import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BoardType } from '../types';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-10 px-4 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-100 mb-6">
        Welcome to <span className="text-white">My</span>
        <span className="text-neutral-300">Page</span>!
      </h1>
      <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
        This page was built with ChatGPT(backend) and Google AI Studio (frontend)
      </p>

      {user ? (
        <p className="text-xl text-neutral-100 mb-8">
          Hello, <span className="font-semibold text-white">{user.username}</span>! What would you like to do today?
        </p>
      ) : (
        <p className="text-xl text-neutral-100 mb-8">
          Join the conversation!{' '}
          <Link to="/signup" className="text-neutral-300 hover:text-white hover:underline font-semibold">Sign up</Link> or{' '}
          <Link to="/login" className="text-neutral-300 hover:text-white hover:underline font-semibold">Log in</Link> to get started.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100 mb-3">Free Board</h2>
            <p className="text-neutral-400">
              Open discussions on any topic. Share your ideas, ask questions, or just chat!
            </p>
          </div>
          <div className="mt-6">
            <Link to={`/board/${BoardType.FREE}`}>
              <Button variant="primary" size="lg" fullWidth>Go to Free Board</Button>
            </Link>
          </div>
        </div>

        <div className="bg-neutral-900 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100 mb-3">Notice Board</h2>
            <p className="text-neutral-400">
              Stay updated with official announcements, news, and important information.
            </p>
          </div>
          <div className="mt-6">
            <Link to={`/board/${BoardType.NOTICE}`}>
              <Button variant="secondary" size="lg" fullWidth>Go to Notice Board</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
