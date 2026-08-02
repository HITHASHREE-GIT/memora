from ultralytics import YOLO
import numpy as np
from PIL import Image

class ObjectDetector:
    def __init__(self, model_path="yolov8n.pt"):
        self.model_path = model_path
        self.detector = None

    def _load_model(self):
        """Load YOLO only when first needed."""
        if self.detector is None:
            print(f"DEBUG: Loading YOLO model '{self.model_path}'...", flush=True)
            try:
                self.detector = YOLO(self.model_path)
                print("DEBUG: YOLO loaded.", flush=True)
            except Exception as e:
                print(f"⚠️ YOLO loading error: {e}", flush=True)
                self.detector = None

    def detect_objects(self, image_path: str):
        self._load_model()

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
        try:
            img = Image.open(image_path).convert("RGB").resize((224, 224))
            img_array = np.array(img).astype("float32") / 255.0

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

            embedding = features * 20
            return embedding[:1280]

        except Exception as e:
            print(f"⚠️ Embedding generation error: {e}")
            return [0.1] * 1280


# Create object only.
# YOLO will NOT load until detect_objects() is called.
detector = ObjectDetector()