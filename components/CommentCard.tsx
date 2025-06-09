
import React from 'react';
import { Comment as CommentType, User } from '../types';
import Button from './Button';

interface CommentCardProps {
  comment: CommentType;
  currentUser: User | null;
  onDelete: (commentId: number) => void;
  isDeleting: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, currentUser, onDelete, isDeleting }) => {
  const canDelete = currentUser && (currentUser.is_admin || currentUser.username === comment.author);

  return (
    <div className="bg-neutral-800 p-4 rounded-lg shadow mb-4 border border-neutral-700">
      <p className="text-neutral-200 mb-2">{comment.content}</p>
      <div className="flex justify-between items-center text-xs text-neutral-400">
        <div>
          <span>By: <span className="font-medium text-neutral-200">{comment.author}</span></span>
          <span className="mx-1">•</span>
          <span>{new Date(comment.created_at).toLocaleString()}</span>
        </div>
        {canDelete && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(comment.id)}
            isLoading={isDeleting}
            className="text-xs"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;