
import React from 'react';
import { Link } from 'react-router-dom';
import { PostSummary } from '../types';

interface PostCardProps {
  post: PostSummary;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-neutral-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out border border-neutral-700">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-100 hover:text-white transition-colors mb-2">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className="text-sm text-neutral-400 mb-3 space-x-3">
          <span>By: <span className="font-medium text-neutral-200">{post.author}</span></span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <span>Views: {post.views}</span>
        </div>
        <Link to={`/post/${post.id}`} className="inline-block mt-2 text-sm text-neutral-300 hover:text-white font-medium transition-colors">
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PostCard;