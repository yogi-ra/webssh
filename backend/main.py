from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException
from .routes.ssh import router as ssh_router
import requests
from config import config  # Import config

app = FastAPI()

# CORS - menggunakan config
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def verify_token(request: Request, call_next):
    # Hanya verifikasi untuk WebSocket endpoint
    if request.url.path.startswith(config.WS_SSH_ENDPOINT):
        token = request.query_params.get("token")
        
        if not token:
            raise HTTPException(status_code=401, detail="Token missing")
        
        try:
            # Verifikasi ke backend Portal - menggunakan config
            verify = requests.post(
                config.VERIFY_TOKEN_URL, 
                json={"token": token},
                timeout=5
            )
            
            if verify.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
                
        except requests.exceptions.RequestException as e:
            print(f"🔴 Token verification error: {e}")
            raise HTTPException(status_code=401, detail="Cannot verify token")
    
    return await call_next(request)

# Router SSH
app.include_router(ssh_router, prefix="/ws")