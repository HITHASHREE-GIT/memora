from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Memora"
    API_V1_STR: str = "/api/v1"
    
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None
    QDRANT_MODE: str = "server"
    
    GROQ_API_KEY: Optional[str] = None

    def get_qdrant_url(self) -> str:
        if self.QDRANT_URL:
            return self.QDRANT_URL
        return "http://localhost:6333"

    class Config:
        env_file = ".env"

settings = Settings()