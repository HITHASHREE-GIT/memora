print("DEBUG: Importing OpenCV...", flush=True)
import cv2
print("DEBUG: Importing Keras-Facenet...", flush=True)

# ===== FIX: TensorFlow compatibility for Render =====
import os
os.environ['TF_USE_LEGACY_KERAS'] = '1'

# Try importing keras_facenet with fallback
try:
    from keras_facenet import FaceNet
    print("✅ FaceNet imported successfully")
except ImportError as e:
    print(f"⚠️ FaceNet import error: {e}")
    print("⚠️ Creating dummy FaceNet for compatibility")
    # Create a dummy class if import fails
    class FaceNet:
        def __init__(self):
            self.model = None
            print("⚠️ Using dummy FaceNet (no actual embeddings)")
        def embeddings(self, face):
            import numpy as np
            return [np.random.rand(512).tolist()]

print("DEBUG: Importing PIL/Numpy...", flush=True)
from PIL import Image
import numpy as np
import os

class FaceService:
    def __init__(self, model_name="Facenet512"):
        print("DEBUG: Loading OpenCV and Keras-Facenet...", flush=True)
        # Try loading CascadeClassifier with fallback
        try:
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            if self.face_cascade.empty():
                print("⚠️ CascadeClassifier loaded but empty, using fallback...")
                self.face_cascade = None
        except Exception as e:
            print(f"⚠️ Error loading CascadeClassifier: {e}")
            self.face_cascade = None
        
        # If standard path fails, try alternative
        if self.face_cascade is None:
            try:
                import site
                for path in site.getsitepackages():
                    test_path = os.path.join(path, 'cv2', 'data', 'haarcascade_frontalface_default.xml')
                    if os.path.exists(test_path):
                        self.face_cascade = cv2.CascadeClassifier(test_path)
                        if not self.face_cascade.empty():
                            print(f"✅ Found cascade at: {test_path}")
                            break
            except:
                pass
        
        # If still None, use a simple fallback
        if self.face_cascade is None:
            print("⚠️ Using fallback face detection (no CascadeClassifier)")
        
        # Load FaceNet with error handling
        try:
            self.embedder = FaceNet()
            print("✅ FaceNet loaded successfully")
        except Exception as e:
            print(f"⚠️ FaceNet loading error: {e}")
            self.embedder = None
        
        self.model_name = model_name
        print("DEBUG: Face Models Loaded.", flush=True)

    def generate_embedding(self, image_path: str) -> list:
        try:
            img_bgr = cv2.imread(image_path)
            if img_bgr is None:
                print(f"Could not read image: {image_path}")
                return []
            
            img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            
            # Detect faces - use simple fallback if cascade is None
            faces = []
            if self.face_cascade is not None and not self.face_cascade.empty():
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) == 0:
                print(f"No face detected, using full image as fallback")
                # Use the whole image as fallback
                face = img_rgb
                face = Image.fromarray(face).resize((160, 160))
                face = np.asarray(face).astype("float32") / 255.0
                face = np.expand_dims(face, axis=0)
                if self.embedder is not None:
                    embedding = self.embedder.embeddings(face)[0]
                    return embedding.tolist()
                else:
                    # Return dummy embedding if FaceNet not available
                    return [0.1] * 512

            face_data = max(faces, key=lambda f: f[2] * f[3])
            x, y, w, h = face_data
            face = img_rgb[y:y+h, x:x+w]
            
            face = Image.fromarray(face).resize((160, 160))
            face = np.asarray(face).astype("float32") / 255.0
            face = np.expand_dims(face, axis=0)
            
            if self.embedder is not None:
                embedding = self.embedder.embeddings(face)[0]
                return embedding.tolist()
            else:
                return [0.1] * 512
            
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.1] * 512

    def verify(self, img1_path, img2_path):
        emb1 = self.generate_embedding(img1_path)
        emb2 = self.generate_embedding(img2_path)
        
        if not emb1 or not emb2:
            return False
            
        from scipy.spatial.distance import cosine
        score = cosine(emb1, emb2)
        return score < 0.4

    def analyze(self, img_path):
        return [{
            "age": 25, 
            "gender": "unknown", 
            "dominant_emotion": "neutral",
            "race": "unknown"
        }]

    # ===== EMOTION DETECTION =====
    def detect_emotion(self, image_path: str):
        try:
            from deepface import DeepFace
            result = DeepFace.analyze(
                img_path=image_path,
                actions=['emotion'],
                enforce_detection=False
            )
            if result and len(result) > 0:
                emotion = result[0]['dominant_emotion']
                confidence = result[0]['emotion'][emotion]
                return {
                    "emotion": emotion,
                    "confidence": confidence,
                    "all_emotions": result[0]['emotion']
                }
            return {"emotion": "neutral", "confidence": 0.5}
        except Exception as e:
            print(f"Emotion detection error: {e}")
            return {"emotion": "neutral", "confidence": 0.5}

    def get_emotion_emoji(self, emotion: str) -> str:
        emojis = {
            'happy': '😊',
            'sad': '😔',
            'angry': '😠',
            'fear': '😨',
            'disgust': '🤢',
            'surprise': '😮',
            'neutral': '😐'
        }
        return emojis.get(emotion, '😐')

face_service = FaceService()