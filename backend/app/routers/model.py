from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import numpy as np

router = APIRouter(prefix="/model", tags=["Model"])  # MUST BE HERE

DATA_DIR = "uploaded_data"

class ModelTrainRequest(BaseModel):
    target: str
    features: list

@router.post("/train/{dataset_id}")
def train_model(dataset_id: str, req: ModelTrainRequest):
    target = req.target
    features = req.features
    path = f"{DATA_DIR}/{dataset_id}.csv"

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        df = pd.read_csv(path)
    except Exception as e:
        print("CSV READ ERROR →", type(e).__name__, str(e))
        raise HTTPException(status_code=500, detail=f"CSV Read Error: {str(e)}")


    # Validate column names
    if target not in df.columns:
        raise HTTPException(status_code=400, detail="Target column not found")
    for f in features:
        if f not in df.columns:
            raise HTTPException(status_code=400, detail=f"Feature column '{f}' not found")

    # Convert columns to numeric
    df[target] = pd.to_numeric(df[target], errors="coerce")
    for col in features:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop rows with NaN
    data = df[[target] + features].dropna()

    if data.empty:
        raise HTTPException(status_code=400, detail="No valid numeric data available.")

    X = data[features]
    y = data[target]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    return {
        "rmse": rmse,
        "r2": r2,
        "mae": mae,
        "n_train": len(X_train),
        "n_test": len(X_test),
        "features": features,
        "target": target,
    }
