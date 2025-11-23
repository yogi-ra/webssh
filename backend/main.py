from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .routes.ssh import router as ssh_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins - adjust for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(ssh_router, prefix="/ws")