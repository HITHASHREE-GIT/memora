# 🧠 Memora - Multimodal AI Memory Assistant

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46C3A4?style=for-the-badge&logo=render&logoColor=white)](https://memora-api-6wym.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.125.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Qdrant](https://img.shields.io/badge/Qdrant-1.16.2-FF6B6B?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech)

**Memora** is a multimodal AI assistant that combines **face recognition**, **object detection**, **semantic memory**, and **natural language processing** to create an intelligent system that can see, remember, and interact naturally with users.

## 🌐 Live Demo

🔗 **Production URL:** [https://memora-api-6wym.onrender.com](https://memora-api-6wym.onrender.com)

---

## ✨ Key Features

### 👁️ Computer Vision
- **Face Detection** - Detect faces in images using OpenCV
- **Face Recognition** - Identify and remember faces using FaceNet embeddings
- **Object Detection** - Detect objects using YOLOv8
- **Image Processing** - Upload and process images

### 🧠 Memory System
- **Face Memory** - Store face embeddings with metadata for recognition
- **Object Memory** - Store object embeddings for future reference
- **Person Memory** - Store detailed information about people
- **Semantic Memory** - Store and search text by meaning using embeddings

### 💬 AI & Language
- **Groq AI Integration** - Powered by Groq's high-performance LLM
- **Context-Aware Chat** - Conversations with memory recall
- **Semantic Search** - Find information by meaning, not just keywords

### 🔊 Audio
- **Text-to-Speech** - Convert text responses to speech using Edge TTS
- **Audio Generation** - Generate audio files from text

### 🎨 Avatar Generation
- **3D Avatar Creation** - Generate avatars from photos using Ready Player Me API

---

## 🏗️ Architecture
## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                          │
│                   (Frontend - React.js)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (FastAPI)                      │
│                  https://memora-api-6wym.onrender.com          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Vision       │   │   Language    │   │   Memory      │
│  Services     │   │   Services    │   │   Services    │
│               │   │               │   │               │
│ • Face        │   │ • Groq AI    │   │ • Qdrant      │
│ • YOLO        │   │ • TTS        │   │   Database    │
│ • OpenCV      │   │ • Avatar     │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Backend Framework** | FastAPI | 0.125.0 |
| **Language** | Python | 3.14 |
| **LLM Provider** | Groq AI | 1.0.0 |
| **Vector Database** | Qdrant | 1.16.2 |
| **Face Recognition** | Keras-FaceNet | 0.3.2 |
| **Object Detection** | Ultralytics YOLO | 8.4.115 |
| **Text Embeddings** | Sentence-Transformers | 5.2.0 |
| **Text-to-Speech** | Edge TTS | 7.2.8 |
| **Computer Vision** | OpenCV | 5.0.0 |
| **Deployment** | Render | - |

---

## 📁 Project Structure

## 📁 Project Structure

```
memora/
├── app/
│   ├── api/
│   │   ├── endpoints.py         # Main API endpoints
│   │   └── chat_endpoint.py     # Chat endpoints
│   ├── core/
│   │   └── config.py            # Configuration & env vars
│   ├── models/
│   │   └── schemas.py           # Pydantic models
│   ├── services/
│   │   ├── face_service.py      # Face detection & recognition
│   │   ├── object_service.py    # Object detection (YOLO)
│   │   ├── memory_service.py    # Memory storage (Qdrant)
│   │   ├── semantic_memory.py   # Semantic memory
│   │   ├── llm_service.py       # Groq AI integration
│   │   ├── tts_service.py       # Text-to-speech
│   │   ├── avatar_service.py    # Avatar generation
│   │   └── conversation_service.py # Conversation management
│   ├── utils/
│   │   └── memory_optimizer.py  # Memory optimization
│   └── main.py                  # Application entry point
├── static/                       # Static files (HTML, CSS, JS)
│   └── index.html               # Welcome page
├── frontend/                     # React frontend source
├── qdrant_storage/              # Local Qdrant storage
├── requirements.txt             # Python dependencies
├── render.yaml                  # Render deployment config
├── .env.example                 # Environment variables template
└── README.md                    # This file
```


---

## 🚀 Getting Started

### Prerequisites

- Python 3.14+
- Git
- Groq API Key ([Get it here](https://console.groq.com))

### Local Development Setup

#### Step 1: Clone the Repository

```bash
git clone https://github.com/HITHASHREE-GIT/memora.git
cd memora

Step 2: Create a Virtual Environment
bash

python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate

Step 3: Install Dependencies
bash

pip install -r requirements.txt

Step 4: Set Up Environment Variables
bash

# On Windows:
copy .env.example .env

# On Linux/Mac:
cp .env.example .env

Edit .env and add your API keys:
env

# Qdrant - Use local mode for development
QDRANT_MODE=local
QDRANT_PATH=qdrant_storage

# Groq AI API Key
GROQ_API_KEY=your_groq_api_key_here

# Memory Optimization
OMP_NUM_THREADS=1
MKL_NUM_THREADS=1
TOKENIZERS_PARALLELISM=false
PYTHONUNBUFFERED=1

Step 5: Create Static Folder
bash

# On Windows:
mkdir static
echo Memora Static Files > static\index.html

# On Linux/Mac:
mkdir static
echo "Memora Static Files" > static/index.html

Step 6: Run the Application

For Local Development (with auto-reload):
bash

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

For Production:
bash

uvicorn app.main:app --host 0.0.0.0 --port 8000

Step 7: Access the Application
Endpoint	URL
API Root	http://localhost:8000
API Documentation	http://localhost:8000/docs
Alternative Docs	http://localhost:8000/redoc
Health Check	http://localhost:8000/health
Static Files	http://localhost:8000/static/index.html
API Endpoints	http://localhost:8000/api/v1/
## 📊 API Endpoints

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/chat` | Send a chat message |
| `POST` | `/api/v1/chat/stream` | Stream chat response |
| `GET` | `/api/v1/chat/history/{conversation_id}` | Get conversation history |


🔧 Environment Variables
Variable	Description	Default	Required
QDRANT_MODE	Qdrant mode: local or server	local	✅
QDRANT_PATH	Path for local Qdrant storage	qdrant_storage	❌
QDRANT_URL	Qdrant server URL (for cloud mode)	-	For server
QDRANT_API_KEY	Qdrant API key (for cloud mode)	-	For server
GROQ_API_KEY	Groq AI API key	-	✅
OMP_NUM_THREADS	CPU thread limit	1	❌
MKL_NUM_THREADS	Math library thread limit	1	❌
TOKENIZERS_PARALLELISM	Tokenizer parallelization	false	❌
PYTHONUNBUFFERED	Unbuffered Python output	1	❌
🚀 Deployment on Render
Prerequisites

    GitHub account

    Render account

Deployment Steps
Step 1: Push Code to GitHub
bash

git add .
git commit -m "Initial commit"
git push origin master

Step 2: Deploy on Render

    Go to Render Dashboard

    Click "New +" → "Web Service"

    Connect your GitHub repository

    Configure the service:

Setting	Value
Name	memora
Environment	Python
Build Command	pip install -r requirements.txt
Start Command	uvicorn app.main:app --host 0.0.0.0 --port 10000
Plan	Free (or Professional for more RAM)

    Add environment variables:

env

QDRANT_MODE=local
GROQ_API_KEY=your_groq_api_key_here
OMP_NUM_THREADS=1
MKL_NUM_THREADS=1
TOKENIZERS_PARALLELISM=false
PYTHONUNBUFFERED=1

    Click "Create Web Service"

Step 3: Wait for Deployment

Deployment takes 2-5 minutes. You'll see the URL when complete.
🧠 How Memora Works
Face Recognition Flow
text

1. User uploads an image
   └─→ API: POST /api/v1/upload

2. OpenCV detects faces
   └─→ Uses Haar Cascade

3. FaceNet generates face embedding (512-dim vector)
   └─→ Converts face image to unique fingerprint

4. Qdrant searches for similar faces
   └─→ Vector similarity search (Cosine distance)

5. Returns recognition result
   └─→ "I recognize Sarah! She's your sister."

Chat with Memory Flow
text

1. User sends a message
   └─→ "Tell me about Sarah"

2. Semantic Memory searches for context
   └─→ Converts query to embedding
   └─→ Searches Qdrant for relevant memories

3. Groq AI processes query with context
   └─→ Generates response with memory context

4. Response sent to user
   └─→ AI-generated response

5. New information stored
   └─→ If user shares new info, stored in memory

Object Detection Flow
text

1. User uploads image
   └─→ API: POST /api/v1/detect/objects

2. YOLO detects objects
   └─→ Identifies objects with confidence scores

3. Results returned to user
   └─→ "Detected: dog (95%), ball (87%), person (65%)"

4. Object embedding stored in Qdrant
   └─→ For future reference and search

🗄️ Qdrant Collections

Your app uses these vector collections:
Collection	Vector Size	Purpose
faces	512	Store face embeddings for recognition
objects	1280	Store object embeddings from YOLO
patients	512	Store person information and embeddings
text_knowledge	384	Store text embeddings for semantic search
🛠️ Troubleshooting
Common Issues and Solutions
Issue	Solution
"Directory 'static' does not exist"	Create static folder: mkdir static and add index.html
Qdrant 404 error	Switch to local mode: QDRANT_MODE=local
Out of Memory (status 137)	Upgrade Render plan or implement lazy loading
FaceNet import error	TensorFlow missing - app falls back to dummy mode
CascadeClassifier error	OpenCV version issue - app falls back gracefully
Module not found	Check requirements.txt and reinstall: pip install -r requirements.txt
Useful Debug Commands
bash

# Check application logs (Render CLI)
render logs memora

# Test health endpoint
curl https://memora-api-6wym.onrender.com/health

# Reset Qdrant storage (local)
rm -rf qdrant_storage/

# Check Python version
python --version

# Check installed packages
pip list | grep qdrant

📝 Environment Setup Checklist

    □

    Python 3.14+ installed
    □

    Virtual environment created and activated
    □

    All dependencies installed from requirements.txt
    □

    .env file created with API keys
    □

    Static folder created with index.html
    □

    App running locally on port 8000
    □

    API docs accessible at /docs
    □

    GitHub repository created
    □

    Deployed on Render
    □

    Environment variables set on Render

🤝 Contributing

    Fork the repository

    Create a feature branch:
    bash

    git checkout -b feature/amazing-feature

    Commit your changes:
    bash

    git commit -m 'Add amazing feature'

    Push to the branch:
    bash

    git push origin feature/amazing-feature

    Open a Pull Request

📝 License

This project is for educational purposes. All rights reserved.
🙏 Acknowledgments

    FastAPI - Modern Python web framework

    Qdrant - High-performance vector database

    Groq - Fast AI inference

    Ultralytics - YOLO object detection

    Render - Cloud deployment platform

    OpenCV - Computer vision library

    HuggingFace - Sentence Transformers

📞 Support

    Issues: GitHub Issues

    Live Demo: https://memora-api-6wym.onrender.com

    API Docs: /docs on your deployed app

🎯 Future Roadmap

    □

    Real-time video processing
    □

    Emotion detection
    □

    User authentication
    □

    Multi-tenant support
    □

    Mobile app integration
    □

    WhatsApp/Telegram bot
    □

    Advanced analytics dashboard
    □

    Voice input support

📊 System Requirements
Component	Minimum	Recommended
RAM	512 MB	2 GB+
CPU	1 core	2+ cores
Storage	1 GB	5 GB+
Python	3.14	3.14
Internet	Required	Required
🔗 Quick Links

    🌐 Live Demo: https://memora-api-6wym.onrender.com

    🐙 GitHub: https://github.com/HITHASHREE-GIT/memora

    📚 API Docs: /docs on your deployed app

    🏥 Health Check: /health on your deployed app

Made with ❤️ by Hithashree

Thank you for checking out Memora! 🚀
text







