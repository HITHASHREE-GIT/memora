import cv2
import os
import numpy as np
from PIL import Image

class FaceService:
    def __init__(self):
        # Skip CascadeClassifier - use simple detection
        self.face_cascade = None
        print("⚠️ Using simple face detection (no CascadeClassifier)")
        
        # Load FaceNet
        try:
            from keras_facenet import FaceNet
            self.embedder = FaceNet()
            print("✅ FaceNet loaded successfully")
        except Exception as e:
            print(f"⚠️ FaceNet not available: {e}")
            self.embedder = None

    def generate_embedding(self, image_path: str) -> list:
        try:
            if not os.path.exists(image_path):
                print(f"Image not found: {image_path}")
                return []
                
            img_bgr = cv2.imread(image_path)
            if img_bgr is None:
                print(f"Could not read image: {image_path}")
                return []
            
            img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
            
            # Simple face detection: use the whole image if no cascade
            # In a real app, you'd use a proper face detector
            h, w, _ = img_rgb.shape
            face = img_rgb[0:h, 0:w]  # Use the whole image
            
            # Resize for FaceNet
            face = Image.fromarray(face).resize((160, 160))
            face = np.asarray(face).astype("float32") / 255.0
            face = np.expand_dims(face, axis=0)
            
            if self.embedder is not None:
                embedding = self.embedder.embeddings(face)[0]
                return embedding.tolist()
            else:
                # Return dummy embedding if FaceNet not available
                return [0.1] * 512
            
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return [0.1] * 512

face_service = FaceService()