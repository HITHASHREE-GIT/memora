from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FamilyMember(BaseModel):
    person_id: str
    name: str
    relation: str
    face_photos: List[str] = []
    voice_samples: List[str] = []
    notes: Optional[str] = None
    created_at: datetime = datetime.now()

class FamilyMemberCreate(BaseModel):
    name: str
    relation: str
    notes: Optional[str] = None

class PersonalObject(BaseModel):
    object_id: str
    name: str
    category: str
    location_desc: str
    image_path: str
    usage_instructions: Optional[str] = None

class EnrollmentResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None