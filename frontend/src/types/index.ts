// backend/src/schemas.py に対応する型定義

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: User;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: User;
  comments: Comment[];
}
