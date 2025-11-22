from fastapi import FastAPI
from app.routers import upload, summary, visualize, anomalies

from app.routers import analyze
from app.routers import cleaning
from app.routers import model


app = FastAPI(title="InsightHub API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload.router)
app.include_router(summary.router)
app.include_router(visualize.router)
app.include_router(anomalies.router)
app.include_router(analyze.router)
app.include_router(cleaning.router)
app.include_router(model.router)


@app.get("/")
def root():
    return {"message": "Welcome to InsightHub API"}
