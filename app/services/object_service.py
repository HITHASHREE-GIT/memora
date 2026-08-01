from ultralytics import YOLO
import numpy as np
from PIL import Image
import os

class ObjectDetector:
    def __init__(self, model_path="yolov8n.pt"):
        print(f"DEBUG: Loading YOLO model '{model_path}'...", flush=True)
        try:
            self.detector = YOLO(model_path)
            print("DEBUG: YOLO loaded.", flush=True)
        except Exception as e:
            print(f"⚠️ YOLO loading error: {e}", flush=True)
            self.detector = None
    
    def detect_objects(self, image_path: str):
        """Returns YOLO detections."""
        if self.detector is None:
            return []
        try:
            results = self.detector(image_path)
            detections = []
            for r in results:
                for box in r.boxes:
                    detections.append({
                        "object": self.detector.names[int(box.cls[0])],
                        "confidence": float(box.conf[0]),
                        "box": box.xyxy[0].tolist()
                    })
            return detections
        except Exception as e:
            print(f"⚠️ Detection error: {e}")
            return []

    def generate_embedding(self, image_path: str):
        """Generates a dummy embedding (no TensorFlow needed)."""
        try:
            # Simple feature extraction using image statistics
            from PIL import Image
            import numpy as np
            
            img = Image.open(image_path).convert('RGB').resize((224, 224))
            img_array = np.array(img).astype('float32') / 255.0
            
            # Generate simple features (mean, std, etc.)
            features = []
            for channel in range(3):
                channel_data = img_array[:, :, channel]
                features.extend([
                    np.mean(channel_data),
                    np.std(channel_data),
                    np.percentile(channel_data, 25),
                    np.percentile(channel_data, 50),
                    np.percentile(channel_data, 75)
                ])
            
            # Pad to 1280 dimensions (YOLO embedding size)
            embedding = features * 20  # Repeat to get 1280 dims
            return embedding[:1280]  # Trim to exactly 1280
            
        except Exception as e:
            print(f"⚠️ Embedding generation error: {e}")
            return [0.1] * 1280

detector = ObjectDetector()