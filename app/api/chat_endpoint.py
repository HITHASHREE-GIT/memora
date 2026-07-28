from fastapi import APIRouter, Body
from app.services.conversation_service import conversation_service
from app.services.semantic_memory import semantic_memory
from app.services.memory_service import memory_service
from app.services.llm_service import llm_service

router = APIRouter()

@router.post("/chat/query")
async def chat_query(text: str = Body(..., embed=True)):
    text = text.strip()
    lower_text = text.lower()
    
    context = conversation_service.get_context()
    context_name = context.get("name") if context else None
    
    # Check for follow-up
    pronouns = ["he", "she", "him", "her", "it", "his", "her"]
    is_followup = any(p in lower_text.split() for p in pronouns)
    
    if is_followup and not context_name and "who is" not in lower_text:
        return {
            "status": "unknown",
            "text": "I'm not sure who you're referring to. Who are we talking about?"
        }
    
    # Direct entity search
    entity_matches = memory_service.search_by_text(text)
    if entity_matches:
        payload = entity_matches[0].payload
        name = payload.get("name")
        desc = llm_service.generate_response(user_text=text, context=payload)
        conversation_service.update_context(payload)
        return {
            "status": "found",
            "text": desc,
            "person": payload
        }
    
    # Semantic search
    matches = semantic_memory.search_knowledge(text, context_name=context_name if is_followup else None)
    
    if matches:
        best_match = matches[0]
        name = best_match.get("name")
        
        full_person = None
        if name:
            original_matches = memory_service.search_by_text(name)
            if original_matches:
                full_person = original_matches[0].payload
        
        if full_person:
            conversation_service.update_context(full_person)
        else:
            conversation_service.update_context(best_match)
        
        llm_context = full_person if full_person else best_match
        final_text = llm_service.generate_response(user_text=text, context=llm_context)
        
        return {
            "status": "found",
            "text": final_text,
            "person": full_person if full_person else best_match
        }
    
    return {
        "status": "unknown",
        "text": "I couldn't find anything relevant in my memory."
    }