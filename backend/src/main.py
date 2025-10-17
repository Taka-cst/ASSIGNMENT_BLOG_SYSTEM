from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, users, articles

# データベーステーブルを作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog System API",
    description="17CFP Blog System Backend API",
    version="1.0.0",
)

# CORS (Cross-Origin Resource Sharing) の設定
# フロントエンドからのリクエストを許可する
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーターを登録
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(articles.router, prefix="/api/v1", tags=["Articles"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Blog System API"}
