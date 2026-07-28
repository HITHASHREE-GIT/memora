from groq import Groq
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        
    def generate_response(self, user_text: str, context: dict = None) -> str:
        if not self.client:
            return self._fallback_response(context)
            
        try:
            system_prompt = (
                "You are an empathetic memory assistant for an elderly person with dementia. "
                "Your goal is to be kind, patient, and helpful. "
                "Use the provided CONTEXT to answer the user's question. "
                "Keep answers short (1-2 sentences) and conversational. "
                "Do NOT mention 'database' or 'records'. Speak naturally."
            )
            
            context_str = "No specific memory found."
            if context:
                name = context.get("name", "Unknown")
                relation = context.get("relation", "Unspecified")
                notes = context.get("notes", "")
                context_str = f"Memory: Name={name}, Relation={relation}, Notes={notes}"
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context: {context_str}\n\nUser: {user_text}"}
            ]
            
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=100,
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"LLM Error: {e}")
            return self._fallback_response(context)

    def _fallback_response(self, context: dict) -> str:
        if not context:
            return "I am listening."
        name = context.get("name", "them")
        return f"That is {name}. {context.get('notes', '')}"

llm_service = LLMService()