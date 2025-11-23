from fastapi import APIRouter, UploadFile, File
import pandas as pd
import uuid
import os

router = APIRouter(prefix="/upload", tags=["Upload"])

DATA_DIR = "uploaded_data"
os.makedirs(DATA_DIR, exist_ok=True)

@router.post("")
@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    dataset_id = str(uuid.uuid4())
    file_path = f"{DATA_DIR}/{dataset_id}.csv"

    df = pd.read_csv(file.file)
    print("COLUMNS:", list(df.columns))

    df.to_csv(file_path, index=False)

    return {
        "dataset_id": dataset_id,
        "rows": len(df),
        "columns": list(df.columns)
    }
