from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer
from app.core.config import settings
import uuid

class SemanticMemoryService:
    def __init__(self):
        try:
            self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ SentenceTransformer loaded")
        except Exception as e:
            print(f"⚠️ SentenceTransformer error: {e}")
            self.encoder = None
        
        try:
            if settings.QDRANT_MODE == "local":
                self.client = QdrantClient(path="qdrant_storage")
            else:
                self.client = QdrantClient(
                    url=settings.get_qdrant_url(),
                    api_key=settings.QDRANT_API_KEY
                )
            self.collection_name = "text_knowledge"
            self._ensure_collection()
            print("✅ Semantic Memory connected to Qdrant")
        except Exception as e:
            print(f"⚠️ Semantic Memory running without Qdrant: {e}")
            self.client = None

    def _ensure_collection(self):
        if self.client is None:
            return
        try:
            self.client.get_collection(self.collection_name)
        except Exception:
            try:
                self.client.recreate_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
                )
            except Exception as e:
                print(f"⚠️ Could not create collection: {e}")

    def learn_person(self, person_data: dict):
        if self.client is None or self.encoder is None:
            return
        name = person_data.get("name")
        relation = person_data.get("relation")
        notes = person_data.get("notes", "")
        
        texts = [
            f"{name} is my {relation}.",
            f"Notes about {name}: {notes}"
        ]
        
        points = []
        for txt in texts:
            if not txt.strip():
                continue
            try:
                embedding = self.encoder.encode(txt).tolist()
                points.append(PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={
                        "text": txt,
                        "name": name,
                        "relation": relation,
                        "type": "person_bio"
                    }
                ))
            except Exception as e:
                print(f"⚠️ Error encoding text: {e}")
        if points:
            try:
                self.client.upsert(collection_name=self.collection_name, points=points)
            except Exception as e:
                print(f"⚠️ Error upserting: {e}")

    def search_knowledge(self, query: str, context_name: str = None, limit=3):
        if self.client is None or self.encoder is None:
            return []
        try:
            embedding = self.encoder.encode(query).tolist()
            query_filter = None
            if context_name:
                query_filter = Filter(
                    must=[FieldCondition(key="name", match=MatchValue(value=context_name))]
                )
            res = self.client.query_points(
                collection_name=self.collection_name,
                query=embedding,
                query_filter=query_filter,
                limit=limit
            )
            return [match.payload for match in res.points]
        except Exception as e:
            print(f"⚠️ Search error: {e}")
            return []

semantic_memory = SemanticMemoryService()