from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from app.core.config import settings
import uuid
import os

class SemanticMemoryService:
    _instance = None  # Singleton pattern for memory efficiency
    
    def __new__(cls):
        """Singleton pattern to avoid multiple instances"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize with lazy loading - nothing loads immediately"""
        if self._initialized:
            return
        self._initialized = True
        self._encoder = None
        self._client = None
        self.collection_name = "text_knowledge"
        print("✅ SemanticMemoryService created (models will load on demand)")
    
    @property
    def encoder(self):
        """Lazy load SentenceTransformer only when needed"""
        if self._encoder is None:
            try:
                from sentence_transformers import SentenceTransformer
                print("🔄 Loading SentenceTransformer model...", flush=True)
                
                # Set environment variables to reduce memory
                os.environ["TOKENIZERS_PARALLELISM"] = "false"
                
                self._encoder = SentenceTransformer('all-MiniLM-L6-v2')
                print("✅ SentenceTransformer loaded successfully", flush=True)
            except Exception as e:
                print(f"⚠️ SentenceTransformer error: {e}", flush=True)
                self._encoder = None
        return self._encoder
    
    @property
    def client(self):
        """Lazy load Qdrant client only when needed"""
        if self._client is None:
            try:
                print("🔄 Connecting to Qdrant...", flush=True)
                
                if settings.QDRANT_MODE == "local":
                    self._client = QdrantClient(
                        path="qdrant_storage",
                        check_compatibility=False  # Fix version mismatch
                    )
                else:
                    self._client = QdrantClient(
                        url=settings.get_qdrant_url(),
                        api_key=settings.QDRANT_API_KEY,
                        check_compatibility=False,  # Fix version mismatch
                        timeout=60  # Add timeout to prevent hangs
                    )
                
                self._ensure_collection()
                print("✅ Semantic Memory connected to Qdrant", flush=True)
            except Exception as e:
                print(f"⚠️ Semantic Memory running without Qdrant: {e}", flush=True)
                self._client = None
        return self._client
    
    def _ensure_collection(self):
        """Ensure collection exists"""
        if self._client is None:
            return
        try:
            self._client.get_collection(self.collection_name)
        except Exception:
            try:
                self._client.recreate_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
                )
                print(f"✅ Collection '{self.collection_name}' created", flush=True)
            except Exception as e:
                print(f"⚠️ Could not create collection: {e}", flush=True)
    
    def learn_person(self, person_data: dict):
        """Learn information about a person"""
        # Only proceed if we have both encoder and client
        if self.encoder is None or self.client is None:
            print("⚠️ Skipping learn_person - missing encoder or client", flush=True)
            return
        
        name = person_data.get("name")
        relation = person_data.get("relation")
        notes = person_data.get("notes", "")
        
        # Validate data
        if not name or not relation:
            print("⚠️ Skipping - missing name or relation", flush=True)
            return
        
        texts = [
            f"{name} is my {relation}.",
            f"Notes about {name}: {notes}"
        ]
        
        points = []
        for txt in texts:
            if not txt.strip():
                continue
            try:
                # Encode text to vector
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
                print(f"⚠️ Error encoding text: {e}", flush=True)
        
        if points:
            try:
                self.client.upsert(collection_name=self.collection_name, points=points)
                print(f"✅ Learned {len(points)} facts about {name}", flush=True)
            except Exception as e:
                print(f"⚠️ Error upserting: {e}", flush=True)
    
    def search_knowledge(self, query: str, context_name: str = None, limit=3):
        """Search for knowledge in semantic memory"""
        if self.encoder is None or self.client is None:
            print("⚠️ Search skipped - missing encoder or client", flush=True)
            return []
        
        try:
            # Encode query
            embedding = self.encoder.encode(query).tolist()
            
            # Build filter if context name provided
            query_filter = None
            if context_name:
                query_filter = Filter(
                    must=[FieldCondition(key="name", match=MatchValue(value=context_name))]
                )
            
            # Search
            res = self.client.query_points(
                collection_name=self.collection_name,
                query=embedding,
                query_filter=query_filter,
                limit=limit
            )
            
            # Extract payloads
            results = [match.payload for match in res.points]
            print(f"✅ Found {len(results)} results for query", flush=True)
            return results
            
        except Exception as e:
            print(f"⚠️ Search error: {e}", flush=True)
            return []
    
    def clear_memory(self):
        """Clear memory to free resources"""
        if self._encoder is not None:
            del self._encoder
            self._encoder = None
        if self._client is not None:
            # Qdrant client doesn't need explicit cleanup
            pass
        import gc
        gc.collect()
        print("🔄 Memory cleared", flush=True)

# Create singleton instance
semantic_memory = SemanticMemoryService()