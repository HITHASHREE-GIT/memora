from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.face_service import face_service
from app.services.object_service import detector as object_service
from app.services.memory_service import memory_service
import shutil
from pathlib import Path
import uuid
import base64
from PIL import Image
import io

router = APIRouter()
TEMP_DIR = Path("temp_uploads")
TEMP_DIR.mkdir(exist_ok=True)

def encode_image(image_path: str):
    try:
        with Image.open(image_path) as img:
            img.thumbnail((300, 300))
            buffered = io.BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=70)
            return f"data:image/jpeg;base64,{base64.b64encode(buffered.getvalue()).decode('utf-8')}"
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

@router.post("/recognize/person")
async def recognize_person(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix
    temp_path = TEMP_DIR / f"{file_id}{ext}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = face_service.generate_embedding(str(temp_path))
        if not embedding:
            return {"status": "no_face_detected", "person": None}
            
        matches = memory_service.search_face(embedding)
        if matches and matches[0].score > 0.4:
            best_match = matches[0]
            return {
                "status": "identified",
                "person": {
                    "name": best_match.payload.get("name", "Unknown"),
                    "relation": best_match.payload.get("relation", "Unknown"),
                    "confidence": best_match.score,
                    "id": best_match.payload.get("person_id"),
                    "notes": best_match.payload.get("notes", ""),
                }
            }
        return {"status": "unknown", "person": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/remember/person")
async def remember_person(
    name: str = Form(...),
    relation: str = Form("Acquaintance"),
    notes: str = Form(None),
    file: UploadFile = File(...)
):
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = face_service.generate_embedding(str(temp_path))
        if not embedding:
            return {"status": "error", "message": "No face detected"}
            
        img_b64 = encode_image(str(temp_path))
        metadata = {
            "name": name,
            "relation": relation,
            "notes": notes,
            "image_base64": img_b64
        }
        
        memory_service.store_face_memory(
            person_id=name.replace(" ", "_"),
            embedding=embedding,
            metadata=metadata
        )
        return {"status": "stored", "name": name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/remember/patient")
async def remember_patient(
    name: str = Form(...),
    relation: str = Form("Acquaintance"),
    notes: str = Form(None),
    file: UploadFile = File(...)
):
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = face_service.generate_embedding(str(temp_path))
        if not embedding:
            return {"status": "error", "message": "No face detected"}
            
        img_b64 = encode_image(str(temp_path))
        metadata = {
            "name": name,
            "relation": relation,
            "notes": notes,
            "image_base64": img_b64
        }
        
        memory_service.store_patient_memory(
            person_id=name.replace(" ", "_"),
            embedding=embedding,
            metadata=metadata
        )
        return {"status": "stored", "name": name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/remember/object")
async def remember_object(
    name: str = Form(...),
    notes: str = Form(None),
    file: UploadFile = File(...)
):
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = object_service.generate_embedding(str(temp_path))
        img_b64 = encode_image(str(temp_path))
        
        memory_service.store_object_memory(
            object_id=str(uuid.uuid4()),
            embedding=embedding,
            metadata={
                "name": name,
                "type": "object",
                "notes": notes,
                "image_base64": img_b64
            }
        )
        return {"status": "stored", "name": name}
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.post("/find/object")
async def find_object(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    temp_path = TEMP_DIR / f"{file_id}_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        embedding = object_service.generate_embedding(str(temp_path))
        matches = memory_service.search_object(embedding)
        
        if matches and matches[0].score > 0.6:
            best = matches[0]
            return {
                "status": "identified",
                "object": {
                    "name": best.payload.get("name", "Unknown"),
                    "notes": best.payload.get("notes", ""),
                    "confidence": best.score,
                    "location": best.payload.get("location", "Unknown"),
                }
            }
        return {"status": "unknown", "object": None}
    finally:
        if temp_path.exists():
            temp_path.unlink()

@router.get("/debug/names")
async def debug_names():
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