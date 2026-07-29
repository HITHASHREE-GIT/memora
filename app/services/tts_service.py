import edge_tts
import pygame
import asyncio
import os
import time

# Voice Configuration
VOICE = "en-IN-NeerjaNeural"

class TTSService:
    def __init__(self):
        try:
            pygame.mixer.init()
        except Exception as e:
            print(f"⚠️ Audio Init Failed (No device?): {e}")

    async def speak(self, text: str):
        """Generates and plays audio for the given text."""
        print(f"🗣️ Speaking: {text}")
        if not text:
            return

        filename = f"speech_{int(time.time())}.mp3"
        try:
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(filename)
            
            # Play
            if pygame.mixer.get_init():
                pygame.mixer.music.load(filename)
                pygame.mixer.music.play()
                
                while pygame.mixer.music.get_busy():
                    await asyncio.sleep(0.1)
                    
                pygame.mixer.music.unload()
            else:
                print("🔇 Audio mixer not initialized, skipping playback.")

        except Exception as e:
            print(f"❌ TTS Error: {e}")
        finally:
            if os.path.exists(filename):
                try:
                    os.remove(filename)
                except: 
                    pass

tts_service = TTSService()