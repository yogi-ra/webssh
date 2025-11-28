# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
class Config:
    # Portal API
    PORTAL_URL = os.getenv("PORTAL_URL", "http://localhost:4000")
    
    # WebSocket
    WS_HOST = os.getenv("WS_HOST", "localhost")
    WS_PORT = os.getenv("WS_PORT", "8000")
    
    # CORS
    ALLOWED_ORIGINS = [
        "http://localhost:3000", 
        "http://localhost:3001",
    ]
    
    # API Endpoints
    @property
    def VERIFY_TOKEN_URL(self):
        return f"{self.PORTAL_URL}/users/verify-token"
    
    # WebSocket Endpoints
    @property
    def WS_SSH_ENDPOINT(self):
        return f"/ws/ssh"

# Create config instance
config = Config()