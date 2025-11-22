from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter(prefix="/summary", tags=["Summary"])

DATA_DIR = "uploaded_data"


@router.get("/{dataset_id}")
def get_summary(dataset_id: str):
    path = f"{DATA_DIR}/{dataset_id}.csv"

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(path)

    summary = {}

    for col in df.columns:
        series = df[col]

        info = {
            "dtype": str(series.dtype),
            "missing_values": int(series.isna().sum())
        }

        # Add numeric stats only for numeric columns
        if pd.api.types.is_numeric_dtype(series):
            info.update({
                "mean": float(series.mean()),
                "median": float(series.median()),
                "min": float(series.min()),
                "max": float(series.max())
            })

        summary[col] = info

    return summary  # <-- IMPORTANT!
