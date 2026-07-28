from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import endpoints, chat_endpoint

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# Include routers
app.include_router(endpoints.router, prefix="/api/v1")
app.include_router(chat_endpoint.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}