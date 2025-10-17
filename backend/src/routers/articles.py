from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/articles", response_model=List[schemas.Article])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = crud.get_articles(db, skip=skip, limit=limit)
    return articles

@router.post("/articles", response_model=schemas.Article, status_code=status.HTTP_201_CREATED)
def create_article(
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_article(db=db, article=article, user_id=current_user.id)

@router.get("/articles/{article_id}", response_model=schemas.Article)
def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.put("/articles/{article_id}", response_model=schemas.Article)
def update_article(
    article_id: int,
    article: schemas.ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    if db_article.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.update_article(db=db, article_id=article_id, article=article)

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    if db_article.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    crud.delete_article(db=db, article_id=article_id)
    return

@router.post("/articles/{article_id}/comments", response_model=schemas.Comment, status_code=status.HTTP_201_CREATED)
def create_comment_for_article(
    article_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return crud.create_comment(db=db, comment=comment, article_id=article_id, user_id=current_user.id)
