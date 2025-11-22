from fastapi import APIRouter, HTTPException
import pandas as pd
import os
import uuid
import base64
import seaborn as sns
import matplotlib.pyplot as plt
from io import BytesIO
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

router = APIRouter(prefix="/cleaning", tags=["Cleaning"])
DATA_DIR = "uploaded_data"


def load_df(dataset_id):
    path = f"{DATA_DIR}/{dataset_id}.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Dataset not found")
    return pd.read_csv(path)


def fig_to_base64():
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode()


# ----------------------------------------------------------- #
# 1. DUPLICATE DETECTION
# ----------------------------------------------------------- #

@router.get("/duplicates/{dataset_id}")
def detect_duplicates(dataset_id: str):
    df = load_df(dataset_id)
    dup_mask = df.duplicated()
    dup_rows = df[dup_mask]

    return {
        "count": len(dup_rows),
        "duplicates": dup_rows.to_dict(orient="records")
    }


@router.get("/remove-duplicates/{dataset_id}")
def remove_duplicates(dataset_id: str):
    df = load_df(dataset_id)
    before = len(df)
    df_clean = df.drop_duplicates()

    removed = before - len(df_clean)

    new_id = str(uuid.uuid4())
    new_path = f"{DATA_DIR}/{new_id}.csv"
    df_clean.to_csv(new_path, index=False)

    return {
        "removed": removed,
        "cleaned_id": new_id
    }


# ----------------------------------------------------------- #
# 2. CORRELATION HEATMAP
# ----------------------------------------------------------- #

@router.get("/heatmap/{dataset_id}")
def correlation_heatmap(dataset_id: str):
    df = load_df(dataset_id)

    numeric = df.select_dtypes(include=["number"])

    if numeric.shape[1] < 2:
        return {"error": "Not enough numeric columns"}

    plt.figure(figsize=(7, 5))
    sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm")

    img = fig_to_base64()
    return {"image_base64": img}


# ----------------------------------------------------------- #
# 3. FEATURE IMPORTANCE
# ----------------------------------------------------------- #

@router.get("/importance/{dataset_id}/{target}")
def feature_importance(dataset_id: str, target: str):
    df = load_df(dataset_id)

    if target not in df.columns:
        raise HTTPException(400, "Target column not found")

    df = df.dropna()
    numeric = df.select_dtypes(include=["number"])

    if target not in numeric.columns:
        raise HTTPException(400, "Target must be numeric")

    X = numeric.drop(columns=[target])
    y = numeric[target]

    if len(X.columns) < 1:
        return {"error": "Not enough features"}

    # Regression model
    model = RandomForestRegressor(random_state=42)
    model.fit(X, y)

    importances = dict(zip(X.columns, model.feature_importances_))

    return {"importances": importances}
