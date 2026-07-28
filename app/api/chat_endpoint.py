from fastapi import APIRouter, Body
from app.services.conversation_service import conversation_service
from app.services.semantic_memory import semantic_memory
from app.services.memory_service import memory_service
from app.services.llm_service import llm_service
import random
import re

router = APIRouter()

@router.post("/chat/query")
async def chat_query(text: str = Body(..., embed=True)):
    text = text.strip()
    lower_text = text.lower()
    
    context = conversation_service.get_context()
    context_name = context.get("name") if context else None
    
    # ===== CHECK FOR USER INTRODUCING THEMSELVES =====
    name_match = re.search(r'(?:my name is|i am|call me|im|i\'m)\s+([a-zA-Z\s]+)', lower_text)
    if name_match:
        name = name_match.group(1).strip().title()
        
        existing = memory_service.search_by_text(name)
        if not existing:
            metadata = {
                "name": name,
                "relation": "Friend",
                "notes": f"Met {name} today. They introduced themselves.",
                "type": "person"
            }
            
            embedding = [0.1] * 512
            memory_service.store_face_memory(
                person_id=name.replace(" ", "_"),
                embedding=embedding,
                metadata=metadata
            )
            semantic_memory.learn_person(metadata)
            conversation_service.update_context(metadata)
            
            return {
                "status": "learned",
                "text": f"Nice to meet you, {name}! I'll remember you forever.",
                "person": metadata
            }
        else:
            conversation_service.update_context(existing[0].payload)
            return {
                "status": "exists",
                "text": f"I already know {name}! Nice to see you again.",
                "person": existing[0].payload
            }
    
    # ===== CHECK FOR RELATIONSHIP LEARNING =====
    relationship_patterns = [
        r'([a-zA-Z\s]+)\s+is\s+my\s+([a-zA-Z\s]+)',
        r'([a-zA-Z\s]+)\s+is\s+([a-zA-Z\s]+)',
        r'my\s+([a-zA-Z\s]+)\s+is\s+([a-zA-Z\s]+)',
        r'remember\s+that\s+([a-zA-Z\s]+)\s+is\s+([a-zA-Z\s]+)',
    ]
    
    relationship_match = None
    for pattern in relationship_patterns:
        match = re.search(pattern, lower_text, re.IGNORECASE)
        if match:
            relationship_match = match
            break
    
    if relationship_match:
        groups = relationship_match.groups()
        if len(groups) == 2:
            common_relations = ['sister', 'brother', 'mother', 'father', 'friend', 'wife', 'husband', 
                               'daughter', 'son', 'cousin', 'aunt', 'uncle', 'grandmother', 'grandfather',
                               'partner', 'colleague', 'neighbor', 'doctor', 'nurse', 'teacher', 'boss']
            
            name = None
            relation = None
            
            group1 = groups[0].strip().lower()
            group2 = groups[1].strip().lower()
            
            if group1 in common_relations:
                relation = group1
                name = group2.strip().title()
            elif group2 in common_relations:
                name = group1.strip().title()
                relation = group2
            else:
                if len(group1) > 1 and len(group2) > 1:
                    name = group1.strip().title()
                    relation = group2.strip()
            
            if name and name != "who" and name != "is" and name != "that" and len(name) > 1:
                existing = memory_service.search_by_text(name)
                
                if not existing:
                    metadata = {
                        "name": name,
                        "relation": relation.capitalize() if relation else "Friend",
                        "notes": f"{name} is your {relation if relation else 'friend'}.",
                        "type": "person"
                    }
                    
                    embedding = [0.1] * 512
                    memory_service.store_face_memory(
                        person_id=name.replace(" ", "_"),
                        embedding=embedding,
                        metadata=metadata
                    )
                    semantic_memory.learn_person(metadata)
                    
                    return {
                        "status": "learned",
                        "text": f"Thank you! I'll remember that {name} is your {relation if relation else 'friend'}.",
                        "person": metadata
                    }
                else:
                    existing_payload = existing[0].payload
                    existing_payload["relation"] = relation.capitalize() if relation else "Friend"
                    existing_payload["notes"] = f"{name} is your {relation if relation else 'friend'}."
                    
                    embedding = [0.1] * 512
                    memory_service.store_face_memory(
                        person_id=name.replace(" ", "_"),
                        embedding=embedding,
                        metadata=existing_payload
                    )
                    semantic_memory.learn_person(existing_payload)
                    
                    return {
                        "status": "learned",
                        "text": f"Got it! I've updated my memory. {name} is your {relation if relation else 'friend'}.",
                        "person": existing_payload
                    }
    
    # ===== CHECK FOR "WHO IS X's Y?" =====
    who_patterns = [
        r'who\s+is\s+([a-zA-Z\s]+)\s+([a-zA-Z\s]+)',
        r'who\s+is\s+([a-zA-Z\s]+)\'s\s+([a-zA-Z\s]+)',
        r'who\s+is\s+the\s+([a-zA-Z\s]+)\s+of\s+([a-zA-Z\s]+)',
        r'who\s+is\s+([a-zA-Z\s]+)\s+mother',
        r'who\s+is\s+([a-zA-Z\s]+)\s+father',
        r'who\s+is\s+([a-zA-Z\s]+)\s+sister',
        r'who\s+is\s+([a-zA-Z\s]+)\s+brother',
    ]
    
    who_match = None
    for pattern in who_patterns:
        match = re.search(pattern, lower_text, re.IGNORECASE)
        if match:
            who_match = match
            break
    
    if who_match:
        groups = who_match.groups()
        if len(groups) == 2:
            common_relations = ['mother', 'father', 'sister', 'brother', 'friend', 'wife', 'husband', 'daughter', 'son', 'aunt', 'uncle']
            
            person = None
            relation = None
            
            group1 = groups[0].strip().lower()
            group2 = groups[1].strip().lower()
            
            if group1 in common_relations:
                relation = group1
                person = group2.strip().title()
            elif group2 in common_relations:
                relation = group2
                person = group1.strip().title()
            else:
                person = group1.strip().title()
                relation = group2.strip()
            
            if person and relation:
                person_matches = memory_service.search_by_text(person)
                if person_matches:
                    payload = person_matches[0].payload
                    if payload.get("relation", "").lower() == relation.lower():
                        return {
                            "status": "found",
                            "text": f"{person} is your {relation}!",
                            "person": payload
                        }
                    semantic_matches = semantic_memory.search_knowledge(f"{person} is my {relation}", context_name=person)
                    if semantic_matches:
                        for match in semantic_matches:
                            if relation in match.get("text", "").lower():
                                return {
                                    "status": "found",
                                    "text": f"{person} is your {relation}!",
                                    "person": payload
                                }
                
                return {
                    "status": "unknown",
                    "text": f"I don't know who {person}'s {relation} is. Could you tell me?",
                    "person": None
                }
    
    # ===== CHECK FOR "WHO AM I?" or "WHAT'S MY NAME?" =====
    who_am_i_patterns = ["who am i", "what's my name", "what is my name", "do you know me", "remember me"]
    if any(pattern in lower_text for pattern in who_am_i_patterns):
        if context_name:
            return {
                "status": "found",
                "text": f"Of course! You're {context_name}. I'll never forget you!",
                "person": context
            }
        
        return {
            "status": "unknown",
            "text": "I'd love to know your name! Tell me: 'My name is [your name]' and I'll remember it forever.",
            "person": None
        }
    
    # ===== ===== ===== ===== =====
    # ===== AI-POWERED RESPONSE FOR EVERYTHING =====
    # ===== ===== ===== ===== =====
    
    # Build context for LLM
    llm_context = None
    
    # 1. Check if we have a person in context
    if context:
        llm_context = context
    
    # 2. Search memory for relevant information
    if not llm_context:
        entity_matches = memory_service.search_by_text(text)
        if entity_matches:
            llm_context = entity_matches[0].payload
    
    # 3. Search semantic memory
    if not llm_context:
        semantic_matches = semantic_memory.search_knowledge(text)
        if semantic_matches:
            llm_context = semantic_matches[0]
    
    # ===== GENERATE RESPONSE USING GROQ LLM =====
    try:
        # If we have context, use it
        if llm_context:
            response_text = llm_service.generate_response(
                user_text=text, 
                context=llm_context
            )
            # Update context if we found a person
            if llm_context.get("name"):
                conversation_service.update_context(llm_context)
        else:
            # No context - use LLM with a general prompt
            response_text = llm_service.generate_general_response(text)
        
        return {
            "status": "found",
            "text": response_text,
            "person": llm_context if llm_context and llm_context.get("name") else None
        }
        
    except Exception as e:
        print(f"❌ LLM Error: {e}")
        # Fallback if LLM fails
        return {
            "status": "unknown",
            "text": "I'm having trouble thinking right now. Could you ask me again?",
            "person": None
        }