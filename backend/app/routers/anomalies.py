from fastapi import APIRouter

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

@router.get("/")
def placeholder():
    return {"message": "Anomalies endpoint works!"}
