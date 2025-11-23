from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .routes.ssh import router as ssh_router
from fastapi import HTTPException, Header
import requests
import json
from fastapi import Depends

app = FastAPI()

# PERBAIKI CORS - tambahkan portal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Tambahkan kedua frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ssh_router, prefix="/ws")

PORTAL_BACKEND_URL = "http://localhost:4000/users/verify-token"

async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token required")
    
    try:
        # Ambil token dari header
        token = authorization.replace("Bearer ", "")
        print(f" Verifying token: {token}")
        
        response = requests.post(
            PORTAL_BACKEND_URL,
            json={"token": token},
            timeout=5
        )
        
        print(f"📡 Portal response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📊 Portal response: {result}")
            
            if result.get("status") == "success":
                print("✅ Token verified successfully")
                return result["user"]
            else:
                print(f" Token verification failed: {result.get('message')}")
        
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f" Token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@app.get("/verify")
async def verify_user(user: dict = Depends(verify_token)):
    return {"status": "success", "user": user}

# Health check endpoint untuk testing
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "WebSSH Backend"}