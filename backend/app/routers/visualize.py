from fastapi import APIRouter, HTTPException
import os
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import pandas as pd


from app.core.plots import plot_histogram, plot_boxplot, plot_scatter

router = APIRouter(prefix="/visualize", tags=["Visualize"])

DATA_DIR = "uploaded_data"

@router.get("/histogram/{dataset_id}/{column}")
def histogram(dataset_id: str, column: str):
    file_path = f"{DATA_DIR}/{dataset_id}.csv"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = pd.read_csv(file_path)

    if column not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found.")

    return {"image_base64": plot_histogram(df, column)}

@router.get("/boxplot/{dataset_id}/{column}")
def boxplot(dataset_id: str, column: str):
    file_path = f"{DATA_DIR}/{dataset_id}.csv"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = pd.read_csv(file_path)

    if column not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found.")

    return {"image_base64": plot_boxplot(df, column)}

@router.get("/scatter/{dataset_id}/{x}/{y}")
def scatter(dataset_id: str, x: str, y: str):
    file_path = f"{DATA_DIR}/{dataset_id}.csv"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = pd.read_csv(file_path)

    if x not in df.columns or y not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found.")

    return {"image_base64": plot_scatter(df, x, y)}
