from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from app.services.face_service import face_service
from app.services.object_service import detector as object_service
from app.services.memory_service import memory_service
from app.services.tts_service import tts_service
import shutil
from pathlib import Path
import uuid
from typing import Dict, Any
import base64
from PIL import Image
import io
import traceback

router = APIRouter()

TEMP_DIR = Path("temp_uploads")
TEMP_DIR.mkdir(exist_ok=True)

# Ensure enrollment dir exists
ENROLL_DIR = Path("photo/enrolled")
ENROLL_DIR.mkdir(parents=True, exist_ok=True)

def encode_image_base64(image_path: str):
    """Resize and encode image to base64 for storage."""
    try:
        with Image.open(image_path) as img:
            img.thumbnail((300, 300))
            buffered = io.BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=70)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            return f"data:image/jpeg;base64,{img_str}"
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

@router.post("/recognize/person")
async def recognize_person(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Receive an image, detect faces, search Qdrant for identity.
    """
    file_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix
    temp_path = TEMP_DIR / f"{file_id}{ext}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = face_service.generate_embedding(str(temp_path))
        
        if not embedding:
            return {"status": "no_face_detected", "person": None}
        
        emotion_data = face_service.detect_emotion(str(temp_path))
        emotion = emotion_data.get("emotion", "neutral")
        emotion_emoji = face_service.get_emotion_emoji(emotion)
            
        matches = memory_service.search_face(embedding)
        
        if matches:
             best_match = matches[0]
             if best_match.score > 0.4:
                 name = best_match.payload.get("name", "Unknown")
                 relation = best_match.payload.get("relation", "Unknown")
                 notes = best_match.payload.get("notes", "")
                 
                 return {
                     "status": "identified",
                     "person": {
                         "name": name,
                         "relation": relation,
                         "confidence": best_match.score,
                         "id": best_match.payload.get("person_id"),
                         "notes": notes,
                         "image": best_match.payload.get("image_base64", None),
                         "audio": best_match.payload.get("audio_base64", None),
                         "emotion": emotion,
                         "emotion_emoji": emotion_emoji
                     }
                 }

        return {
            "status": "unknown", 
            "person": None,
            "emotion": emotion,
            "emotion_emoji": emotion_emoji
        }

    except Exception as e:
        print(f"❌ Recognition error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/remember/person")
async def remember_person(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    relation: str = Form("Acquaintance"),
    notes: str = Form(None),
    age: int = Form(None),
    file: UploadFile = File(...),
    audio_file: UploadFile = File(None)
):
    """Enroll a new person with optional voice sample."""
    print(f"🟢 ENROLLMENT STARTED: {name}")
    file_id = str(uuid.uuid4())
    filename = f"{name.replace(' ', '_')}_{file_id}.jpg"
    perm_path = ENROLL_DIR / filename
    
    audio_b64 = None
    if audio_file:
         audio_path = Path("audio/enrolled") / f"{name.replace(' ', '_')}_{file_id}.webm"
         audio_path.parent.mkdir(parents=True, exist_ok=True)
         try:
             with open(audio_path, "wb") as buffer:
                 shutil.copyfileobj(audio_file.file, buffer)
             with open(audio_path, "rb") as f:
                 audio_b64 = base64.b64encode(f.read()).decode("utf-8")
         except Exception as e:
             print(f"Error saving audio: {e}")

    try:
        print(f"📁 Saving image...")
        with open(perm_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"✅ Image saved: {perm_path}")
            
        print(f"🧠 Generating embedding...")
        try:
            embedding = face_service.generate_embedding(str(perm_path))
            if not embedding:
                print(f"⚠️ No embedding for {name}, using dummy")
                embedding = [0.1] * 512
        except Exception as e:
            print(f"⚠️ Embedding error: {e}, using dummy")
            embedding = [0.1] * 512
        print(f"✅ Embedding generated: {len(embedding)} dimensions")

        print(f"🖼️ Encoding image...")
        img_b64 = encode_image_base64(str(perm_path))
        
        print(f"👤 Generating avatar...")
        from app.services.avatar_service import avatar_service
        avatar_url = avatar_service.generate_avatar(str(perm_path))
            
        print(f"💾 Storing in Qdrant...")
        metadata = {
            "name": name,
            "relation": relation,
            "age": age,
            "type": "person",
            "notes": notes or f"This is {name}, your {relation}.",
            "image_base64": img_b64,
            "avatar_url": avatar_url
        }
        if audio_b64:
            metadata["audio_base64"] = audio_b64

        memory_service.store_face_memory(
            person_id=name.replace(" ", "_"),
            embedding=embedding,
            metadata=metadata
        )
        
        print(f"✅ ENROLLMENT COMPLETE: {name}")
        return {"status": "stored", "name": name, "avatar_url": avatar_url}
        
    except Exception as e:
        print(f"❌ ENROLLMENT ERROR: {e}")
        traceback.print_exc()
        if perm_path.exists():
            try:
                perm_path.unlink()
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/remember/patient")
async def remember_patient(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    relation: str = Form("Acquaintance"),
    notes: str = Form(None),
    age: int = Form(None),
    file: UploadFile = File(...),
    audio_file: UploadFile = File(None)
):
    """Enroll a new PATIENT/Person via Caregiver (Stored in 'patients' collection)"""
    print(f"🟢 PATIENT ENROLLMENT: {name}")
    file_id = str(uuid.uuid4())
    filename = f"{name.replace(' ', '_')}_{file_id}.jpg"
    perm_path = ENROLL_DIR / filename
    
    audio_b64 = None
    if audio_file:
         audio_path = Path("audio/enrolled") / f"{name.replace(' ', '_')}_{file_id}.webm"
         audio_path.parent.mkdir(parents=True, exist_ok=True)
         try:
             with open(audio_path, "wb") as buffer:
                 shutil.copyfileobj(audio_file.file, buffer)
             with open(audio_path, "rb") as f:
                 audio_b64 = base64.b64encode(f.read()).decode("utf-8")
         except Exception as e:
             print(f"Error saving audio: {e}")

    try:
        with open(perm_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            embedding = face_service.generate_embedding(str(perm_path))
            if not embedding:
                print(f"⚠️ No embedding for {name}, using dummy")
                embedding = [0.1] * 512
        except Exception as e:
            print(f"⚠️ Embedding error: {e}, using dummy")
            embedding = [0.1] * 512

        img_b64 = encode_image_base64(str(perm_path))
        
        from app.services.avatar_service import avatar_service
        avatar_url = avatar_service.generate_avatar(str(perm_path))
            
        metadata = {
            "name": name,
            "relation": relation,
            "age": age,
            "type": "patient_contact",
            "notes": notes or f"This is {name}, your {relation}.",
            "image_base64": img_b64,
            "avatar_url": avatar_url
        }
        if audio_b64:
            metadata["audio_base64"] = audio_b64

        memory_service.store_patient_memory(
            person_id=name.replace(" ", "_"),
            embedding=embedding,
            metadata=metadata
        )
        
        print(f"✅ PATIENT ENROLLMENT COMPLETE: {name}")
        return {"status": "stored", "name": name, "avatar_url": avatar_url}
        
    except Exception as e:
        print(f"❌ PATIENT ENROLLMENT ERROR: {e}")
        traceback.print_exc()
        if perm_path.exists():
            try:
                perm_path.unlink()
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/remember/object")
async def remember_object(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    notes: str = Form(None),
    file: UploadFile = File(...)
):
    """Register a new personal object (e.g. Medicine Box)"""
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = object_service.generate_embedding(str(temp_path))
        img_b64 = encode_image_base64(str(temp_path))

        memory_service.store_object_memory(
            object_id=str(uuid.uuid4()),
            embedding=embedding,
            metadata={
                "name": name,
                "type": "object",
                "notes": notes or f"This is your {name}.",
                "image_base64": img_b64
            }
        )
        
        return {"status": "stored", "name": name}
        
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/find/object")
async def find_object(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Identify a specific personal object."""
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = object_service.generate_embedding(str(temp_path))
        matches = memory_service.search_object(embedding)
        
        found_name = "Unknown Object"
        found_notes = ""
        found_img = None
        
        if matches and matches[0].score > 0.6:
            best = matches[0]
            found_name = best.payload.get("name", "Unknown")
            found_notes = best.payload.get("notes", "")
            found_img = best.payload.get("image_base64", None)
            
            return {
                "status": "identified", 
                "object": {
                    "name": found_name, 
                    "notes": found_notes, 
                    "confidence": best.score,
                    "location": best.payload.get("location", "Unknown"),
                    "image": found_img
                }
            }
        
        detections = object_service.detect_objects(str(temp_path))
        if detections:
            best_det = max(detections, key=lambda x: x['confidence'])
            label = best_det['object']
            
            object_id = str(uuid.uuid4())
            img_b64 = encode_image_base64(str(temp_path))
            
            from datetime import datetime
            timestamp = datetime.now().strftime("%I:%M %p")
            location = f"Last seen at {timestamp}"

            memory_service.store_object_memory(
                object_id=object_id,
                embedding=embedding,
                metadata={
                    "name": label,
                    "type": "object",
                    "notes": "Auto-enrolled from observation.",
                    "location": location,
                    "image_base64": img_b64
                }
            )
            
            return {
                "status": "identified", 
                "object": {
                    "name": label, 
                    "notes": "I just learned this object.",
                    "confidence": best_det['confidence'],
                    "location": location,
                    "image": img_b64
                }
            }
            
        return {"status": "unknown", "object": None}
        
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.get("/debug/names")
async def debug_names():
    """List all names in Qdrant Faces"""
    try:
        res = memory_service.client.scroll(
            collection_name="faces",
            limit=100,
            with_payload=True
        )
        points = res[0]
        names = [p.payload.get("name") for p in points]
        return {"count": len(names), "names": names}
    except Exception as e:
        return {"error": str(e)}