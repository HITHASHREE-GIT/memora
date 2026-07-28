from groq import Groq
from app.core.config import settings
import random

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        print(f"🔧 LLM Service initialized. Groq available: {self.client is not None}")
        
    def generate_response(self, user_text: str, context: dict = None) -> str:
        """
        Generate a response using Groq LLM with context
        """
        if not self.client:
            print("⚠️ No Groq client, using fallback")
            return self._fallback_response(context, user_text)
            
        try:
            system_prompt = (
                "You are Memora, a warm, empathetic, and caring AI memory assistant. "
                "Your purpose is to help people with memory challenges, especially elderly individuals with dementia. "
                "You are kind, patient, and always helpful. "
                "Use the provided CONTEXT to answer the user's question when relevant. "
                "If the context is not relevant, answer from your general knowledge. "
                "Keep answers clear, warm, and conversational (2-3 sentences). "
                "Do NOT mention 'database', 'records', or 'AI'. Speak naturally like a caring friend. "
                "If you don't know something, be honest and kind about it."
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
                max_tokens=200,
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"❌ LLM Error: {e}")
            return self._fallback_response(context, user_text)

    def generate_general_response(self, user_text: str) -> str:
        """
        Generate a response for general questions without context
        """
        if not self.client:
            print("⚠️ No Groq client, using fallback for general response")
            return self._fallback_response(None, user_text)
        
        try:
            system_prompt = (
                "You are Memora, a warm, empathetic, and knowledgeable AI memory assistant. "
                "Your purpose is to help people with memory challenges. "
                "Answer any question in a warm, caring, and clear way. "
                "If you don't know something, be honest but offer to help. "
                "Keep answers clear and easy to understand (2-3 sentences). "
                "Use a warm, conversational tone. "
                "Never say 'database' or 'records'. Be human-like and caring."
            )
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text}
            ]
            
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=200,
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"❌ LLM General Error: {e}")
            return self._fallback_response(None, user_text)

    def _fallback_response(self, context: dict = None, user_text: str = "") -> str:
        """
        Smart fallback responses when Groq is not available
        """
        # If we have context about a person
        if context:
            name = context.get("name", "them")
            relation = context.get("relation", "")
            notes = context.get("notes", "")
            
            if notes:
                return f"I remember {name}! {notes}"
            elif relation:
                return f"That's {name}, your {relation}."
            else:
                return f"I know {name}! Would you like to know more about them?"
        
        # No context - detect if it's a question
        question_words = ["what", "who", "where", "when", "why", "how", "is", "are", "do", "does", "did", "can", "will", "would", "could", "should"]
        is_question = any(word in user_text.lower().split() for word in question_words)
        
        # Detect greetings
        greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "namaste"]
        is_greeting = any(word in user_text.lower() for word in greetings)
        
        # Detect thanks
        thanks = ["thank", "thanks", "thank you", "ty"]
        is_thanks = any(word in user_text.lower() for word in thanks)
        
        if is_greeting:
            responses = [
                "Hello! How can I help you today?",
                "Hi there! It's nice to talk to you. What would you like to remember?",
                "Greetings! I'm your memory assistant. How can I help?",
                "Hello! I'm here to help you remember. What's on your mind?",
            ]
        elif is_thanks:
            responses = [
                "You're welcome! I'm happy to help.",
                "Of course! I'm always here for you.",
                "My pleasure! Is there anything else you'd like to know?",
                "Anytime! What else can I help you with?",
            ]
        elif is_question:
            responses = [
                "That's a good question! I'd love to learn more about that. Could you tell me about it?",
                "I don't have that in my memory yet. Would you like to teach me so I can remember?",
                "I'm not sure about that. Could you help me understand so I can add it to my memory?",
                "That's interesting! I want to remember that. Can you tell me more details?",
                "I don't know about that yet. Would you like to tell me so I can remember it for you?",
            ]
        else:
            responses = [
                "I'm here to help! What would you like to remember today?",
                "That's nice! Tell me more about it so I can remember.",
                "I'm listening. What would you like to share with me?",
                "I'm your memory assistant. How can I help you today?",
                "Tell me something you want me to remember forever.",
                "I'm here to keep your memories safe. What would you like to tell me?",
            ]
        
        return random.choice(responses)

llm_service = LLMService()