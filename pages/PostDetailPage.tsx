
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { PostDetail as PostDetailType, Comment as CommentType } from '../types';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import CommentCard from '../components/CommentCard';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../constants';
import { showToast } from '../components/Toast';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, basicAuthHeader } = useAuth();

  const [post, setPost] = useState<PostDetailType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const [commentToDelete, setCommentToDelete] = useState<CommentType | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);


  const fetchPostAndComments = useCallback(async () => {
    if (!postId) return;
    setIsLoadingPost(true);
    setIsLoadingComments(true);
    setError(null);
    try {
      const postData = await apiService.getPostDetail(Number(postId));
      setPost(postData);
      const commentsData = await apiService.getComments(Number(postId));
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load post details.');
      showToast('error', err.message || 'Failed to load post details.');
      navigate('/'); // Or to an error page
    } finally {
      setIsLoadingPost(false);
      setIsLoadingComments(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId || !basicAuthHeader) return;
    setIsSubmittingComment(true);
    try {
      await apiService.addComment(Number(postId), newComment, basicAuthHeader);
      setNewComment('');
      // Refetch comments to show the new one
      const commentsData = await apiService.getComments(Number(postId));
      setComments(commentsData);
      showToast('success', 'Comment added successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !basicAuthHeader) return;
    setIsDeletingPost(true);
    try {
      await apiService.deletePost(post.id, basicAuthHeader);
      showToast('success', 'Post deleted successfully.');
      navigate(`/board/${post.board || 'free'}`); // Navigate back to board
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete post.');
    } finally {
      setIsDeletingPost(false);
      setIsDeletePostModalOpen(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete || !basicAuthHeader || !postId) return;
    setIsDeletingComment(true);
    try {
      await apiService.deleteComment(commentToDelete.id, basicAuthHeader);
      setComments(prevComments => prevComments.filter(c => c.id !== commentToDelete.id));
      showToast('success', 'Comment deleted successfully.');
    } catch (err: any)
     {
      showToast('error', err.message || 'Failed to delete comment.');
    } finally {
      setIsDeletingComment(false);
      setCommentToDelete(null);
    }
  };


  if (isLoadingPost) return <LoadingSpinner message="Loading post..." />;
  if (error) return <div className="text-center text-status-danger p-4 bg-status-danger bg-opacity-10 rounded-md">{error}</div>;
  if (!post) return <div className="text-center text-neutral-400 p-4">Post not found.</div>;

  const canDeletePost = user && (user.is_admin || user.username === post.author);

  return (
    <div className="bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto border border-neutral-700">
      <article>
        <header className="mb-6 pb-4 border-b border-neutral-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-3">{post.title}</h1>
          <div className="text-sm text-neutral-400">
            <span>By <Link to="#" className="font-medium text-neutral-300 hover:underline">{post.author}</Link></span>
            <span className="mx-2">•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.views} views</span>
          </div>
          {canDeletePost && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => setIsDeletePostModalOpen(true)} 
              className="mt-4 float-right"
              isLoading={isDeletingPost}
            >
              Delete Post
            </Button>
          )}
        </header>

        {post.image && (
          <div className="mb-6 flex justify-center bg-neutral-900 p-4 rounded-md">
            <img 
              src={post.image} 
              alt={post.title} 
              className="max-h-[500px] w-auto rounded-lg shadow-md" 
            />
          </div>
        )}
        <div className="prose prose-lg prose-invert max-w-none text-neutral-300 prose-strong:text-neutral-100 prose-headings:text-white prose-a:text-neutral-300 hover:prose-a:text-white prose-code:text-neutral-300 prose-pre:bg-neutral-900 prose-blockquote:border-neutral-600 prose-hr:border-neutral-700" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </article>

      <section className="mt-10 pt-6 border-t border-neutral-700">
        <h2 className="text-2xl font-semibold text-neutral-100 mb-6">Comments ({comments.length})</h2>
        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-8 p-4 bg-neutral-900 rounded-lg shadow border border-neutral-700">
            <Textarea
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
              rows={3}
            />
            <Button type="submit" isLoading={isSubmittingComment} className="mt-2">
              Post Comment
            </Button>
          </form>
        )}
        {!user && (
          <p className="mb-8 text-neutral-400">
            <Link to="/login" className="text-neutral-300 hover:underline">Log in</Link> or <Link to="/signup" className="text-neutral-300 hover:underline">Sign up</Link> to post a comment.
          </p>
        )}

        {isLoadingComments ? (
          <LoadingSpinner message="Loading comments..." />
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard 
                key={comment.id} 
                comment={comment} 
                currentUser={user}
                onDelete={() => setCommentToDelete(comment)}
                isDeleting={isDeletingComment && commentToDelete?.id === comment.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </section>

      {/* Delete Post Modal */}
      <Modal
        isOpen={isDeletePostModalOpen}
        onClose={() => setIsDeletePostModalOpen(false)}
        title="Confirm Delete Post"
      >
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setIsDeletePostModalOpen(false)} disabled={isDeletingPost}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost} isLoading={isDeletingPost}>
            Yes, Delete Post
          </Button>
        </div>
      </Modal>

      {/* Delete Comment Modal */}
      <Modal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Confirm Delete Comment"
      >
        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
         <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setCommentToDelete(null)} disabled={isDeletingComment}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteComment} isLoading={isDeletingComment}>
            Yes, Delete Comment
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PostDetailPage;