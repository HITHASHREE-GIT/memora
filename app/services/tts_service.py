import edge_tts
import asyncio
import os
import time

VOICE = "en-IN-NeerjaNeural"

class TTSService:
    def __init__(self):
        print("🔊 TTS Service initialized (no pygame)")

    async def speak(self, text: str):
        print(f"🗣️ Speaking: {text}")
        if not text:
            return

        filename = f"speech_{int(time.time())}.mp3"
        try:
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(filename)
            print(f"✅ Audio saved: {filename}")
            # In production, you'd stream this or send it to frontend
        except Exception as e:
            print(f"❌ TTS Error: {e}")
        finally:
            if os.path.exists(filename):
                try:
                    os.remove(filename)
                except:
                    pass

tts_service = TTSService()