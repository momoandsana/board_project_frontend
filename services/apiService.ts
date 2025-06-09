
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants';
import { User, PostSummary, PostDetail, Comment, AdminUser, ApiErrorDetail, BoardType } from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Utility to handle API errors
const handleError = (error: AxiosError<ApiErrorDetail>): Promise<never> => {
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data);
    // Try to extract a meaningful message
    let message = `Error: ${error.response.status}`;
    if (error.response.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        message = error.response.data.detail;
      } else if (Array.isArray(error.response.data.detail) && error.response.data.detail.length > 0) {
        message = error.response.data.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
      } else {
        message = JSON.stringify(error.response.data.detail);
      }
    }
    // Throw an error object that includes the response for further handling if needed
    return Promise.reject({ ...error, message }); 
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return Promise.reject({ ...error, message: 'Network error. Please check your connection.' });
  } else {
    console.error('Error:', error.message);
    return Promise.reject({ ...error, message: error.message });
  }
};


// --- User API ---
const signup = async (username: string, password: string): Promise<{ success: boolean; username: string }> => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  try {
    const response = await apiClient.post('/signup', formData);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const login = async (authHeader: string): Promise<{ success: boolean; user: User | null }> => {
  try {
    const response = await apiClient.post('/login', {}, {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const deleteMyAccount = async (authHeader: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete('/users/me', {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

// --- Admin API ---
const listUsers = async (authHeader: string): Promise<AdminUser[]> => {
  try {
    const response = await apiClient.get('/admin/users', {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const deleteUserByAdmin = async (userId: number, authHeader: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`, {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

// --- Post API ---
const createPost = async (
  title: string, 
  content: string, 
  board: BoardType, 
  authHeader: string, 
  image?: File | null
): Promise<{ id: number }> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('board', board);
  if (image) {
    formData.append('file', image);
  }
  try {
    const response = await apiClient.post('/posts', formData, {
      headers: { 
        Authorization: authHeader,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const getPosts = async (board: BoardType): Promise<PostSummary[]> => {
  try {
    const response = await apiClient.get('/posts', { params: { board } });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const getPostDetail = async (postId: number): Promise<PostDetail> => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    // Construct full image URL
    if (response.data.image) {
      response.data.image = `${API_BASE_URL}/${response.data.image}`;
    }
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const deletePost = async (postId: number, authHeader: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete(`/posts/${postId}`, {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

// --- Comment API ---
const addComment = async (
  postId: number, 
  content: string, 
  authHeader: string
): Promise<{ id: number }> => {
  const formData = new FormData();
  formData.append('content', content);
  try {
    const response = await apiClient.post(`/posts/${postId}/comments`, formData, {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const getComments = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const deleteComment = async (commentId: number, authHeader: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`, {
      headers: { Authorization: authHeader }
    });
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError<ApiErrorDetail>);
  }
};

const apiService = {
  signup,
  login,
  deleteMyAccount,
  listUsers,
  deleteUserByAdmin,
  createPost,
  getPosts,
  getPostDetail,
  deletePost,
  addComment,
  getComments,
  deleteComment,
};

export default apiService;
    