from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from .routes.ssh import router as ssh_router
import requests
import json

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
PORTAL_VERIFY_URL = "http://localhost:3001/users/verify-token"

@app.middleware("http")
async def verify_token(request: Request, call_next):
    # Hanya verifikasi untuk WebSocket endpoint
    if request.url.path.startswith("/ws/ssh"):
        token = request.query_params.get("token")
        
        if not token:
            raise HTTPException(status_code=401, detail="Token missing")
        
        try:
            # Verifikasi ke backend Portal
            verify = requests.post(
                "http://localhost:4000/users/verify-token", 
                json={"token": token},
                timeout=5
            )
            
            if verify.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
                
        except requests.exceptions.RequestException as e:
            print(f" Token verification error: {e}")
            raise HTTPException(status_code=401, detail="Cannot verify token")
    
    return await call_next(request)


# Router SSH
app.include_router(ssh_router, prefix="/ws")