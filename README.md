\# 🧠 MEMORA - AI Memory Assistant



> An AI-powered external memory assistant for Alzheimer's and Dementia patients



\---



\## 📋 PROBLEM STATEMENT



\### Problem Title

\*\*Memory Loss and Social Disconnection in Alzheimer's and Dementia Patients\*\*



\### What Does This Problem Aim to Solve?

Alzheimer's and Dementia patients struggle to recognize faces, remember names, recall past interactions, and locate important objects. This leads to social isolation, confusion, anxiety, and loss of dignity. Caregivers also face burnout trying to provide constant support and reassurance.



\### Why Did Your Team Choose This?

According to the World Health Organization, over \*\*55 million people\*\* worldwide live with dementia, and this number is projected to reach \*\*78 million by 2030\*\*. The emotional and social impact on patients and caregivers is immense. We wanted to create a compassionate, technology-driven solution that restores dignity, reduces caregiver burden, and helps patients feel connected to their loved ones.



\---



\## 🌍 REAL-WORLD PROBLEM ALIGNMENT



\### Who Faces This Issue?

\- \*\*Alzheimer's and Dementia Patients\*\*: Struggle with memory loss, face recognition, and daily tasks

\- \*\*Family Members\*\*: Emotional distress seeing loved ones forget them

\- \*\*Caregivers\*\*: High burnout rates due to constant supervision and reassurance

\- \*\*Healthcare Providers\*\*: Need better tools for memory care

\- \*\*Elderly Population\*\*: Growing demographic with memory challenges



\### What's the Current Gap in the System?

\- No personalized memory assistant for daily use

\- Existing solutions are expensive and complex

\- No integration of face recognition, voice, and AI chat

\- Caregivers lack real-time data on patient's memory health

\- No affordable, accessible solution for Indian families



\### How Does Your Proposed Solution Fill That Gap Practically?

\*\*Memora\*\* provides a \*\*free, AI-powered memory assistant\*\* that:

\- \*\*Recognizes faces\*\* instantly and announces who is visiting

\- \*\*Remembers relationships\*\* and past interactions

\- \*\*Helps find objects\*\* like keys, medicine, and glasses

\- \*\*Speaks in a warm, human-like voice\*\* 

\- \*\*Tracks memory health\*\* and provides analytics to caregivers

\- \*\*Works offline\*\* with local data storage



\### Connection to Existing Schemes

\- Aligns with \*\*India's National Programme for Health Care of the Elderly (NPHCE)\*\*

\- Supports \*\*WHO's Global Dementia Observatory\*\* goals

\- Contributes to \*\*UN Sustainable Development Goal 3\*\* (Good Health and Well-being)



\---



\## 💡 PROPOSED SOLUTION



\### What Are You Building?

\*\*Memora\*\* is a multimodal AI agent designed to act as an external memory for Alzheimer's and Dementia patients. It uses \*\*face recognition, vector search, and LLMs\*\* to identify people, objects, and provide context-aware conversations.



\### Key Features



| Feature | Description |

|---------|-------------|

| 🤖 \*\*Face Recognition\*\* | Instantly identify family members and friends with voice announcements |

| 😊 \*\*Emotion Detection\*\* | Detect patient's mood (happy, sad, neutral) to provide empathetic responses |

| 🎤 \*\*Voice Input \& Output\*\* | Patients can speak to Memora; Memora speaks back in a warm voice |

| 💬 \*\*AI Chat\*\* | Context-aware conversations that remember past interactions |

| 👨‍👩‍👧‍👦 \*\*Family Gallery\*\* | Photos and details of loved ones with last seen timestamps |

| 📸 \*\*Photo Upload\*\* | Upload old photos and let AI recognize people |

| 📊 \*\*Memory Health Score\*\* | Track patient's memory health with visual analytics |

| 🔔 \*\*Smart Reminders\*\* | Medicine and appointment reminders |

| 🌍 \*\*Multi-Language Support\*\* | Hindi, Tamil, Telugu, Kannada, and English |

| 👨‍👩‍👧‍👦 \*\*Caregiver Dashboard\*\* | Easy enrollment of people and objects |



\### What Makes It Different or Innovative?



| Aspect | Memora | Traditional Solutions |

|--------|--------|----------------------|

| \*\*Cost\*\* | 🟢 Free/Open Source | 🔴 Expensive proprietary |

| \*\*Voice\*\* | 🟢 Natural voice input/output | 🔴 Text-only or robotic |

| \*\*Emotion\*\* | 🟢 Detects patient mood | 🔴 No emotion awareness |

| \*\*Local Data\*\* | 🟢 Privacy-focused (local storage) | 🔴 Cloud-dependent |

| \*\*Accessibility\*\* | 🟢 Designed for elderly (large buttons, voice) | 🔴 Complex interfaces |

| \*\*Caregiver Tools\*\* | 🟢 Real-time analytics dashboard | 🔴 Limited or none |



\---



\## 🏗️ TECH STACK \& ARCHITECTURE



\### Tech Stack



| Category | Technology | Purpose |

|----------|------------|---------|

| \*\*Frontend\*\* | React.js + Vite | User interface |

| \*\*Frontend UI\*\* | Tailwind CSS + Framer Motion | Styling and animations |

| \*\*Backend\*\* | FastAPI (Python) | API server |

| \*\*Database\*\* | Qdrant | Vector database for face/semantic search |

| \*\*Face Recognition\*\* | FaceNet (Keras) | Face embeddings |

| \*\*Object Detection\*\* | YOLOv8 | Object recognition |

| \*\*LLM\*\* | Groq (Llama 3.1-8B) | AI chat responses |

| \*\*Speech-to-Text\*\* | Whisper | Voice input |

| \*\*Text-to-Speech\*\* | Edge TTS | Voice output |

| \*\*Emotion Detection\*\* | DeepFace | Mood detection |

| \*\*Authentication\*\* | JWT + localStorage | User login |



\### APIs \& Libraries



```python

\# Backend Libraries

fastapi==0.125.0          # Web framework

uvicorn==0.38.0           # ASGI server

qdrant-client==1.16.2     # Vector database

groq==1.0.0               # LLM API

sentence-transformers==5.2.0  # Text embeddings

ultralytics               # YOLO object detection

keras\_facenet             # Face recognition

openai-whisper            # Speech-to-text

edge-tts                  # Text-to-speech

Pillow==12.0.0            # Image processing

numpy==2.3.5              # Numerical operations

opencv-python-headless    # Computer vision

deepface                  # Emotion detection



// Frontend Dependencies

{

&#x20; "react": "^19.2.0",

&#x20; "react-dom": "^19.2.0",

&#x20; "vite": "^7.2.4",

&#x20; "axios": "^1.13.2",

&#x20; "framer-motion": "^12.27.5",

&#x20; "lucide-react": "^0.562.0",

&#x20; "tailwindcss": "^3.4.17",

&#x20; "@react-three/fiber": "^9.5.0",

&#x20; "@react-three/drei": "^10.7.7"

}



┌─────────────────────────────────────────────────────────────────────────────────────┐

│                                                                                     │

│                              USER INTERFACE LAYER                                   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                        FRONTEND (React + Vite)                              │   │

│  │                         http://localhost:5173                               │   │

│  │                                                                             │   │

│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │

│  │   │   PATIENT   │  │   FAMILY    │  │    SCAN     │  │    CHAT     │      │   │

│  │   │    VIEW     │  │   GALLERY   │  │    VIEW     │  │    VIEW     │      │   │

│  │   │   (Home)    │  │             │  │             │  │             │      │   │

│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │

│  │                                                                             │   │

│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │

│  │   │  CAREGIVER  │  │  ANALYTICS  │  │   PHOTO     │  │    LOGIN    │      │   │

│  │   │  DASHBOARD  │  │  DASHBOARD  │  │   UPLOAD    │  │    VIEW     │      │   │

│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │                    COMPONENTS \& SERVICES                           │   │   │

│  │   │  AvatarCanvas  │  CameraView  │  ChatInterface  │  AudioRecorder   │   │   │

│  │   │  MemoryScore   │  PhotoUpload │  SideNav       │  ProfessionalUI   │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                          │                                          │

│                                          │ HTTPS / WebSocket                        │

│                                          ▼                                          │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                        API GATEWAY LAYER                                    │   │

│  │                                                                             │   │

│  │  ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │  │                                                                     │   │   │

│  │  │                        FASTAPI (Python)                             │   │   │

│  │  │                         http://localhost:8000                       │   │   │

│  │  │                                                                     │   │   │

│  │  │   ┌─────────────────────────────────────────────────────────────┐   │   │   │

│  │  │   │                     API ENDPOINTS                           │   │   │   │

│  │  │   │                                                             │   │   │   │

│  │  │   │  POST /recognize/person    - Face Recognition              │   │   │   │

│  │  │   │  POST /remember/person     - Enroll Person                 │   │   │   │

│  │  │   │  POST /remember/patient    - Enroll Patient                │   │   │   │

│  │  │   │  POST /remember/object     - Enroll Object                 │   │   │   │

│  │  │   │  POST /find/object         - Find Object                   │   │   │   │

│  │  │   │  POST /chat/query          - AI Chat Query                 │   │   │   │

│  │  │   │  GET  /debug/names         - List Stored Names             │   │   │   │

│  │  │   │                                                             │   │   │   │

│  │  │   └─────────────────────────────────────────────────────────────┘   │   │   │

│  │  │                                                                     │   │   │

│  │  └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                          │                                          │

│                                          ▼                                          │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                        SERVICE LAYER                                        │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────┐  ┌─────────────────────────┐                 │   │

│  │   │     AI SERVICES         │  │     ML SERVICES         │                 │   │

│  │   │                         │  │                         │                 │   │

│  │   │  ┌───────────────────┐  │  │  ┌───────────────────┐  │                 │   │

│  │   │  │    Face Service   │  │  │  │   Object Service  │  │                 │   │

│  │   │  │    (FaceNet)      │  │  │  │    (YOLOv8)       │  │                 │   │

│  │   │  │  512-dim vectors  │  │  │  │  1280-dim vectors │  │                 │   │

│  │   │  └───────────────────┘  │  │  └───────────────────┘  │                 │   │

│  │   │                         │  │                         │                 │   │

│  │   │  ┌───────────────────┐  │  │  ┌───────────────────┐  │                 │   │

│  │   │  │    LLM Service    │  │  │  │  Emotion Service  │  │                 │   │

│  │   │  │    (Groq)         │  │  │  │   (DeepFace)      │  │                 │   │

│  │   │  │   Llama 3.1-8B    │  │  │  │  Mood Detection  │  │                 │   │

│  │   │  └───────────────────┘  │  │  └───────────────────┘  │                 │   │

│  │   └─────────────────────────┘  └─────────────────────────┘                 │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────┐  ┌─────────────────────────┐                 │   │

│  │   │    VOICE SERVICES       │  │    MEMORY SERVICES      │                 │   │

│  │   │                         │  │                         │                 │   │

│  │   │  ┌───────────────────┐  │  │  ┌───────────────────┐  │                 │   │

│  │   │  │   Voice Service   │  │  │  │  Memory Service   │  │                 │   │

│  │   │  │   (Whisper)       │  │  │  │   (Qdrant)        │  │                 │   │

│  │   │  │  Speech-to-Text   │  │  │  │  Vector Search    │  │                 │   │

│  │   │  └───────────────────┘  │  │  └───────────────────┘  │                 │   │

│  │   │                         │  │                         │                 │   │

│  │   │  ┌───────────────────┐  │  │  ┌───────────────────┐  │                 │   │

│  │   │  │    TTS Service    │  │  │  │    Semantic       │  │                 │   │

│  │   │  │   (Edge TTS)      │  │  │  │    Memory         │  │                 │   │

│  │   │  │  Text-to-Speech   │  │  │  │  (Sentence-T)     │  │                 │   │

│  │   │  └───────────────────┘  │  │  │  384-dim vectors  │  │                 │   │

│  │   └─────────────────────────┘  │  └───────────────────┘  │                 │   │

│  │                                 └─────────────────────────┘                 │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────┐  ┌─────────────────────────┐                 │   │

│  │   │   CONTEXT SERVICES      │  │   AVATAR SERVICES       │                 │   │

│  │   │                         │  │                         │                 │   │

│  │   │  ┌───────────────────┐  │  │  ┌───────────────────┐  │                 │   │

│  │   │  │  Conversation     │  │  │  │  Avatar Service   │  │                 │   │

│  │   │  │  Service          │  │  │  │  (Ready Player    │  │                 │   │

│  │   │  │  Context Manager  │  │  │  │   Me)             │  │                 │   │

│  │   │  └───────────────────┘  │  │  └───────────────────┘  │                 │   │

│  │   └─────────────────────────┘  └─────────────────────────┘                 │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                          │                                          │

│                                          ▼                                          │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                        DATA LAYER                                           │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │                                                                     │   │   │

│  │   │                        QDRANT VECTOR DATABASE                       │   │   │

│  │   │                                                                     │   │   │

│  │   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │   │   │

│  │   │   │    faces    │  │  patients   │  │   objects   │  │  text\_    │ │   │   │

│  │   │   │   (512d)    │  │   (512d)    │  │  (1280d)    │  │knowledge  │ │   │   │

│  │   │   │             │  │             │  │             │  │  (384d)    │ │   │   │

│  │   │   │  Face       │  │  Patient    │  │  Object     │  │  Semantic  │ │   │   │

│  │   │   │  Embeddings │  │  Embeddings │  │  Embeddings │  │  Text      │ │   │   │

│  │   │   └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │   │   │

│  │   │                                                                     │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                          │                                          │

│                                          ▼                                          │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                        EXTERNAL APIs \& SERVICES                             │   │

│  │                                                                             │   │

│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │

│  │   │    Groq     │  │   Ready     │  │  Hugging    │  │  Microsoft  │      │   │

│  │   │    API      │  │  Player Me  │  │  Face Hub   │  │   Edge TTS  │      │   │

│  │   │  (Llama 3)  │  │  (Avatar)   │  │  (Models)   │  │  (Voice)    │      │   │

│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

└─────────────────────────────────────────────────────────────────────────────────────┘







┌─────────────────────────────────────────────────────────────────────────────────────┐

│                                                                                     │

│                    COMPONENT INTERACTIONS                                           │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                              FRONTEND                                       │   │

│  │                                                                             │   │

│  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │   │

│  │   │   App.jsx   │────▶│  Professional│────▶│   Pages     │                  │   │

│  │   │   (Main)    │     │     UI      │     │             │                  │   │

│  │   └─────────────┘     └─────────────┘     └─────────────┘                  │   │

│  │         │                   │                   │                           │   │

│  │         ▼                   ▼                   ▼                           │   │

│  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │   │

│  │   │  Components │     │   Services  │     │  State      │                  │   │

│  │   │             │     │             │     │  Management │                  │   │

│  │   │ • Avatar    │     │ • API Calls │     │             │                  │   │

│  │   │ • Camera    │     │ • Axios     │     │ • useState  │                  │   │

│  │   │ • Chat      │     │ • Handlers  │     │ • useEffect │                  │   │

│  │   │ • Forms     │     │             │     │             │                  │   │

│  │   └─────────────┘     └─────────────┘     └─────────────┘                  │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                        │                                           │

│                                        ▼                                           │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                              BACKEND                                       │   │

│  │                                                                             │   │

│  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │   │

│  │   │   main.py   │────▶│   Routes    │────▶│  Services   │                  │   │

│  │   │  (FastAPI)  │     │             │     │             │                  │   │

│  │   └─────────────┘     └─────────────┘     └─────────────┘                  │   │

│  │         │                   │                   │                           │   │

│  │         ▼                   ▼                   ▼                           │   │

│  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │   │

│  │   │   Core      │     │   Models    │     │   Utils     │                  │   │

│  │   │             │     │             │     │             │                  │   │

│  │   │ • Config    │     │ • Schemas   │     │ • Helpers   │                  │   │

│  │   │ • Settings  │     │ • Pydantic  │     │ • Encoders  │                  │   │

│  │   └─────────────┘     └─────────────┘     └─────────────┘                  │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

└─────────────────────────────────────────────────────────────────────────────────────┘





┌─────────────────────────────────────────────────────────────────────────────────────┐

│                                                                                     │

│                          DEPLOYMENT ARCHITECTURE                                   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                         PRODUCTION ENVIRONMENT                              │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │                                                                     │   │   │

│  │   │                    FRONTEND (Vercel/Netlify)                        │   │   │

│  │   │                    https://memora.vercel.app                        │   │   │

│  │   │                                                                     │   │   │

│  │   │              React SPA (Vite Build)                                 │   │   │

│  │   │                                                                     │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                    │                                          │   │

│  │                                    │ API Calls                                │   │

│  │                                    ▼                                          │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │                                                                     │   │   │

│  │   │                    BACKEND (Render/Heroku)                          │   │   │

│  │   │                    https://memora-api.onrender.com                  │   │   │

│  │   │                                                                     │   │   │

│  │   │              FastAPI + Gunicorn + Uvicorn                          │   │   │

│  │   │                                                                     │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                    │                                          │   │

│  │                                    │                                          │   │

│  │   ┌──────────────────────────────┐│┌──────────────────────────────────────┐ │   │

│  │   │                              │││                                      │ │   │

│  │   │    Qdrant Cloud              │││        Groq API                     │ │   │

│  │   │    (Vector Database)         │││        (LLM Service)                │ │   │

│  │   │                              │││                                      │ │   │

│  │   │    https://qdrant.tech       │││        https://console.groq.com     │ │   │

│  │   │                              │││                                      │ │   │

│  │   └──────────────────────────────┘│└──────────────────────────────────────┘ │   │

│  │                                    │                                          │   │

│  │   ┌──────────────────────────────┐│┌──────────────────────────────────────┐ │   │

│  │   │                              │││                                      │ │   │

│  │   │    Hugging Face Hub          │││        Ready Player Me              │ │   │

│  │   │    (ML Models)               │││        (Avatar Service)             │ │   │

│  │   │                              │││                                      │ │   │

│  │   │    https://huggingface.co    │││        https://readyplayer.me       │ │   │

│  │   │                              │││                                      │ │   │

│  │   └──────────────────────────────┘│└──────────────────────────────────────┘ │   │

│  │                                    │                                          │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │                         DEVELOPMENT ENVIRONMENT                            │   │

│  │                                                                             │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │                                                                     │   │   │

│  │   │                    LOCAL DEVELOPMENT                               │   │   │

│  │   │                                                                     │   │   │

│  │   │   ┌─────────────┐              ┌─────────────┐                     │   │   │

│  │   │   │  Frontend   │──────────────│   Backend   │                     │   │   │

│  │   │   │ localhost:  │              │ localhost:  │                     │   │   │

│  │   │   │    5173     │              │    8000     │                     │   │   │

│  │   │   └─────────────┘              └─────────────┘                     │   │   │

│  │   │         │                            │                              │   │   │

│  │   │         │                            │                              │   │   │

│  │   │         ▼                            ▼                              │   │   │

│  │   │   ┌─────────────┐              ┌─────────────┐                     │   │   │

│  │   │   │   Vite      │              │   Uvicorn   │                     │   │   │

│  │   │   │   Dev       │              │   Dev       │                     │   │   │

│  │   │   │   Server    │              │   Server    │                     │   │   │

│  │   │   └─────────────┘              └─────────────┘                     │   │   │

│  │   │                                                                     │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

└─────────────────────────────────────────────────────────────────────────────────────┘





┌─────────────────────────────────────────────────────────────────────────────────────┐

│                                                                                     │

│                         QDRANT COLLECTIONS                                         │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   COLLECTION: faces                                                         │   │

│  │   Vector Size: 512                                                          │   │

│  │   Distance: Cosine                                                          │   │

│  │                                                                             │   │

│  │   Payload:                                                                  │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │  person\_id: str     │  name: str        │  relation: str           │   │   │

│  │   │  notes: str         │  age: int         │  image\_base64: str       │   │   │

│  │   │  audio\_base64: str  │  avatar\_url: str  │  timestamp: str          │   │   │

│  │   │  last\_seen: str     │  type: str        │  emotion: str            │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   COLLECTION: patients                                                      │   │

│  │   Vector Size: 512                                                          │   │

│  │   Distance: Cosine                                                          │   │

│  │                                                                             │   │

│  │   Payload:                                                                  │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │  person\_id: str     │  name: str        │  relation: str           │   │   │

│  │   │  notes: str         │  age: int         │  image\_base64: str       │   │   │

│  │   │  audio\_base64: str  │  avatar\_url: str  │  timestamp: str          │   │   │

│  │   │  type: str                                                          │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   COLLECTION: objects                                                       │   │

│  │   Vector Size: 1280                                                         │   │

│  │   Distance: Cosine                                                          │   │

│  │                                                                             │   │

│  │   Payload:                                                                  │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │  │  object\_id: str     │  name: str        │  type: str                │   │   │

│  │  │  notes: str         │  location: str    │  category: str            │   │   │

│  │  │  image\_base64: str  │  timestamp: str   │  filename: str            │   │   │

│  │  └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   COLLECTION: text\_knowledge                                                │   │

│  │   Vector Size: 384                                                          │   │

│  │   Distance: Cosine                                                          │   │

│  │                                                                             │   │

│  │   Payload:                                                                  │   │

│  │   ┌─────────────────────────────────────────────────────────────────────┐   │   │

│  │   │  text: str          │  name: str        │  relation: str           │   │   │

│  │   │  type: str          │  timestamp: str                               │   │   │

│  │   └─────────────────────────────────────────────────────────────────────┘   │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

└─────────────────────────────────────────────────────────────────────────────────────┘





┌─────────────────────────────────────────────────────────────────────────────────────┐

│                                                                                     │

│                           API ENDPOINTS                                             │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   METHOD    ENDPOINT                  DESCRIPTION                           │   │

│  │   ────────  ────────────────────────  ────────────────────────────────────  │   │

│  │   POST      /api/v1/recognize/person  Face Recognition                      │   │

│  │   POST      /api/v1/remember/person   Enroll Person                         │   │

│  │   POST      /api/v1/remember/patient  Enroll Patient (Caregiver)           │   │

│  │   POST      /api/v1/remember/object   Enroll Object                         │   │

│  │   POST      /api/v1/find/object       Find Object                           │   │

│  │   POST      /api/v1/chat/query        AI Chat Query                         │   │

│  │   GET       /api/v1/debug/names       List All Stored Names                 │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

│  ┌─────────────────────────────────────────────────────────────────────────────┐   │

│  │                                                                             │   │

│  │   CHAT ENDPOINT - Request/Response Example                                  │   │

│  │                                                                             │   │

│  │   Request:                                                                  │   │

│  │   POST /api/v1/chat/query                                                   │   │

│  │   {                                                                         │   │

│  │     "text": "Who is John?"                                                  │   │

│  │   }                                                                         │   │

│  │                                                                             │   │

│  │   Response:                                                                 │   │

│  │   {                                                                         │   │

│  │     "status": "found",                                                      │   │

│  │     "text": "John is your son. He visited yesterday.",                     │   │

│  │     "person": {                                                             │   │

│  │       "name": "John",                                                       │   │

│  │       "relation": "Son",                                                    │   │

│  │       "notes": "Visited with flowers"                                      │   │

│  │     }                                                                       │   │

│  │   }                                                                         │   │

│  │                                                                             │   │

│  └─────────────────────────────────────────────────────────────────────────────┘   │

│                                                                                     │

└─────────────────────────────────────────────────────────────────────────────────────┘

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
2.Fill in your actual API keys in .env:

    Get Qdrant API key from Qdrant Cloud

    Get Groq API key from Groq Console
3.    Never commit .env to Git!

text


---

## 🔍 Check for Exposed Keys Before Pushing

### Scan for API Keys in Your Code:

```cmd
# Search for Qdrant API keys in your files
findstr /S /I "qdrant" *.py *.env *.txt

# Search for Groq API keys
findstr /S /I "gsk_" *.py *.env *.txt
findstr /S /I "groq" *.py *.env *.txt

# Look for hardcoded keys
findstr /S /I "API_KEY = " *.py
findstr /S /I "api_key = " *.py





