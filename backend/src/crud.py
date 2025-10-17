from sqlalchemy.orm import Session
from . import models, schemas, security

# --- User CRUD ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Article CRUD ---
def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Article).offset(skip).limit(limit).all()

def get_article(db: Session, article_id: int):
    return db.query(models.Article).filter(models.Article.id == article_id).first()

def create_article(db: Session, article: schemas.ArticleCreate, user_id: int):
    db_article = models.Article(**article.model_dump(), author_id=user_id)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(db: Session, article_id: int, article: schemas.ArticleUpdate):
    db_article = get_article(db, article_id)
    if db_article:
        db_article.title = article.title
        db_article.content = article.content
        db.commit()
        db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = get_article(db, article_id)
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article

# --- Comment CRUD ---
def create_comment(db: Session, comment: schemas.CommentCreate, article_id: int, user_id: int):
    db_comment = models.Comment(**comment.model_dump(), article_id=article_id, author_id=user_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
