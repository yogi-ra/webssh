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
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ssh_router, prefix="/ws")

