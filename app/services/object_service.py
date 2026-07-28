from ultralytics import YOLO
import numpy as np
import os
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.models import Model

_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        base = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
        _embedding_model = Model(inputs=base.input, outputs=base.output)
    return _embedding_model

class ObjectDetector:
    def __init__(self):
        self.detector = YOLO('yolov8n.pt')
    
    def detect_objects(self, image_path: str):
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

    def generate_embedding(self, image_path: str):
        model = get_embedding_model()
        img = keras_image.load_img(image_path, target_size=(224, 224))
        x = keras_image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        embedding = model.predict(x, verbose=0)
        return embedding[0].tolist()

detector = ObjectDetector()