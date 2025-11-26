from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import jwt
import os
import requests
import json

# Import router (menggunakan relative path seperti di kode lama)
from .routes.ssh import router as ssh_router

# ===========================
# CONFIG
# ===========================
JWT_SECRET = os.getenv("JWT_SECRET", "rahasiasecure123456789")
ALGORITHM = "HS256"
PORTAL_LOGIN_URL = "http://localhost:3000/login?return_to=http://localhost:3001"

app = FastAPI(title="WebSSH Backend")

# ===========================
# CORS (gabungan dari kode kamu yang lama + versi final)
# ===========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# MIDDLEWARE: AUTH WAJIB LOGIN
# ===========================
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path

    # Izinkan beberapa route tanpa login
    if path in ["/health", "/docs", "/openapi.json", "/favicon.ico"]:
        return await call_next(request)

    token = request.cookies.get("portal_token")

    if not token:
        if "text/html" in request.headers.get("accept", ""):
            return RedirectResponse(url=PORTAL_LOGIN_URL)
        else:
            raise HTTPException(status_code=401, detail="Authentication required")

    try:
        jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    except:
        if "text/html" in request.headers.get("accept", ""):
            return RedirectResponse(url=PORTAL_LOGIN_URL)
        else:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    return await call_next(request)

# ===========================
# ROUTES
# ===========================
@app.get("/")
async def root():
    return {"message": "WebSSH Backend – Authenticated"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# Router dari WebSSH
app.include_router(ssh_router, prefix="/ws")
