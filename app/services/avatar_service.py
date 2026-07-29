import requests
import os

READY_PLAYER_ME_API = "https://api.readyplayer.me/v1/avatars"

class AvatarService:
    def generate_avatar(self, image_path: str) -> str:
        """
        Generates a 3D avatar from a photo using Ready Player Me.
        Returns the URL of the generated avatar (GLB or PNG).
        """
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                print(f"⚠️ Image not found: {image_path}")
                return None
                
            with open(image_path, "rb") as img:
                response = requests.post(
                    READY_PLAYER_ME_API,
                    files={"file": img},
                    data={"gender": "neutral"},
                    headers={},
                    timeout=30
                )
            
            if response.status_code in [200, 201]:
                data = response.json().get("data", {})
                glb_url = data.get("url")
                
                if glb_url and ".glb" in glb_url:
                    return glb_url.replace(".glb", ".png")
                return glb_url
            else:
                print(f"⚠️ RPM API Error: {response.status_code}")
                # Return a placeholder avatar URL
                return "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                
        except Exception as e:
            print(f"⚠️ Avatar Generation Failed: {e}")
            # Return a placeholder avatar URL
            return "https://api.dicebear.com/7.x/avataaars/svg?seed=default"

avatar_service = AvatarService()