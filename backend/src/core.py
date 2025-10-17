import os
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    環境変数を管理するための設定クラス
    """
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    """
    設定クラスのインスタンスを返す関数
    lru_cacheデコレータにより、初回以降はキャッシュされたインスタンスを返す
    """
    return Settings()

settings = get_settings()
