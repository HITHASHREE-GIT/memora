from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from app.core.config import settings
import uuid
import difflib

class MemoryService:
    def __init__(self):
        if settings.QDRANT_MODE == "local":
            self.client = QdrantClient(path="qdrant_storage")
        else:
            self.client = QdrantClient(
                url=settings.get_qdrant_url(),
                api_key=settings.QDRANT_API_KEY
            )
        self._ensure_collections()

    def _ensure_collections(self):
        # Faces collection
        try:
            self.client.get_collection("faces")
        except Exception:
            self.client.recreate_collection(
                collection_name="faces",
                vectors_config=VectorParams(size=512, distance=Distance.COSINE)
            )

        # Objects collection
        try:
            self.client.get_collection("objects")
        except Exception:
            self.client.recreate_collection(
                collection_name="objects",
                vectors_config=VectorParams(size=1280, distance=Distance.COSINE)
            )

        # Patients collection
        try:
            self.client.get_collection("patients")
        except Exception:
            self.client.recreate_collection(
                collection_name="patients",
                vectors_config=VectorParams(size=512, distance=Distance.COSINE)
            )

    def store_face_memory(self, person_id: str, embedding: list, metadata: dict):
        point_id = str(uuid.uuid4())
        self.client.upsert(
            collection_name="faces",
            points=[PointStruct(id=point_id, vector=embedding, payload={"person_id": person_id, **metadata})],
            wait=True
        )
        return point_id

    def store_patient_memory(self, person_id: str, embedding: list, metadata: dict):
        point_id = str(uuid.uuid4())
        self.client.upsert(
            collection_name="patients",
            points=[PointStruct(id=point_id, vector=embedding, payload={"person_id": person_id, **metadata})],
            wait=True
        )
        return point_id

    def search_face(self, embedding: list, limit=1):
        res1 = self.client.query_points(collection_name="faces", query=embedding, limit=limit).points
        res2 = self.client.query_points(collection_name="patients", query=embedding, limit=limit).points
        all_res = res1 + res2
        all_res.sort(key=lambda x: x.score, reverse=True)
        return all_res[:limit]

    def store_object_memory(self, object_id: str, embedding: list, metadata: dict):
        point_id = str(uuid.uuid4())
        self.client.upsert(
            collection_name="objects",
            points=[PointStruct(id=point_id, vector=embedding, payload={"object_id": object_id, **metadata})],
            wait=True
        )
        return point_id

    def search_object(self, embedding: list, limit=1):
        response = self.client.query_points(
            collection_name="objects",
            query=embedding,
            limit=limit
        )
        return response.points

    def search_by_text(self, text_query: str):
        try:
            points = []
            for col in ["faces", "objects", "patients"]:
                try:
                    res = self.client.scroll(collection_name=col, limit=500, with_payload=True, with_vectors=False)
                    points.extend(res[0])
                except Exception:
                    pass
            
            query = text_query.lower()
            candidates = []
            max_score = 0.0
            
            for p in points:
                if not p.payload:
                    continue
                name = (p.payload.get("name") or "").lower()
                relation = (p.payload.get("relation") or "").lower()
                notes = (p.payload.get("notes") or "").lower()
                
                score = 0
                if name and name in query:
                    score += 1.0
                if relation and relation in query:
                    score += 0.8
                if notes and query in notes:
                    score += 0.5
                
                full_sim = difflib.SequenceMatcher(None, query, name).ratio()
                if full_sim > 0.6:
                    score += 1.0

                if score > max_score:
                    max_score = score
                    candidates = [p]
                elif score == max_score and score > 0.4:
                    candidates.append(p)
            
            if max_score > 0.4:
                candidates.sort(key=lambda x: x.payload.get("timestamp", ""), reverse=True)
                return candidates[:5]
            return []

        except Exception as e:
            print(f"Fuzzy search error: {e}")
            return []

memory_service = MemoryService()