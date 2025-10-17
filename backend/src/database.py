from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .core import settings

# データベースエンジンを作成
# connect_args は SQLite を使用する場合にのみ必要
engine = create_engine(
    settings.DATABASE_URL,
    # connect_args={"check_same_thread": False} # for SQLite
)

# データベースセッションを作成するためのクラス
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    リクエストごとにDBセッションを返すための依存性関数
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
