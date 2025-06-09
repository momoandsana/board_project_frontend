
export interface User {
  id?: number;
  username: string;
  is_admin: boolean;
}

export interface PostSummary {
  id: number;
  title: string;
  author: string;
  created_at: string;
  views: number;
}

export interface PostDetail extends PostSummary {
  content: string;
  image: string | null; // image_path from backend
  board?: string; // board type
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
  owner_id?: number; // For deletion checks if available
  post_id?: number; // For deletion checks if available
}

export enum BoardType {
  FREE = 'free',
  NOTICE = 'notice',
}

export interface ApiErrorDetail {
  detail: string | { msg: string; type: string }[];
}

export interface AdminUser extends User {
 id: number;
}

export type ToastMessage = {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
};
    