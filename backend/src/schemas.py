from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Comment Schemas ---
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    author: User

    class Config:
        from_attributes = True

# --- Article Schemas ---
class ArticleBase(BaseModel):
    title: str
    content: str

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    author: User
    comments: List[Comment] = []

    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
