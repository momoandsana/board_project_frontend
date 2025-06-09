
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import { BoardType } from '../types';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import ImagePreview from '../components/ImagePreview';
import { showToast } from '../components/Toast';

const CreatePostPage: React.FC = () => {
  const { boardType } = useParams<{ boardType: BoardType }>();
  const navigate = useNavigate();
  const { basicAuthHeader } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Added 'form' to the errors state type
  const [errors, setErrors] = useState<{ title?: string; content?: string; image?: string; form?: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({...prev, image: "Image size should not exceed 5MB."}));
        setImageFile(null);
        e.target.value = ''; // Clear the input
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors(prev => ({...prev, image: "Invalid image type. Only JPG, PNG, GIF are allowed."}));
        setImageFile(null);
        e.target.value = ''; // Clear the input
        return;
      }
      setErrors(prev => ({...prev, image: undefined})); // Clear previous image error
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };
  
  const clearImage = () => {
    setImageFile(null);
    setErrors(prev => ({...prev, image: undefined})); // Also clear image error if any
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if(fileInput) fileInput.value = ''; // Reset file input
  }


  const validateForm = (): boolean => {
    const newErrors: { title?: string; content?: string } = {}; // Local errors for this validation pass
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    
    setErrors(prev => ({ 
      ...prev, 
      title: newErrors.title, 
      content: newErrors.content 
    }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, form: undefined }));

    if (!validateForm() || !boardType || !basicAuthHeader) return;

    if (errors.image) {
        showToast('error', 'Please fix the image error before submitting.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.createPost(title, content, boardType, basicAuthHeader, imageFile);
      showToast('success', 'Post created successfully!');
      navigate(`/post/${response.id}`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create post.');
      setErrors(prev => ({...prev, form: err.message || 'An unexpected error occurred.'}));
    } finally {
      setIsLoading(false);
    }
  };
  
  const boardName = boardType === BoardType.FREE ? "Free Board" : "Notice Board";

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
      <h2 className="text-3xl font-bold text-neutral-100 mb-2">Create New Post</h2>
      <p className="text-md text-neutral-400 mb-8">Posting to: <span className="font-semibold text-neutral-100">{boardName}</span></p>
      
      {errors.form && <p className="text-status-danger text-sm text-center mb-4 p-2 bg-status-danger bg-opacity-10 rounded-md">{errors.form}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors(prev => ({...prev, title: undefined}));
          }}
          error={errors.title}
          required
          placeholder="Enter post title"
        />
        <Textarea
          label="Content"
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors(prev => ({...prev, content: undefined}));
          }}
          error={errors.content}
          required
          placeholder="Write your post content here..."
          rows={8}
        />
        <div className="mb-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-neutral-400 mb-1">
            Image (Optional, Max 5MB, JPG/PNG/GIF)
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-neutral-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-neutral-700 file:text-neutral-300
                       hover:file:bg-neutral-600 transition-colors cursor-pointer"
          />
          {errors.image && <p className="mt-1 text-xs text-status-danger">{errors.image}</p>}
          <ImagePreview file={imageFile} onClear={clearImage} />
        </div>

        <Button type="submit" isLoading={isLoading} fullWidth className="mt-4">
          Create Post
        </Button>
      </form>
    </div>
  );
};

export default CreatePostPage;