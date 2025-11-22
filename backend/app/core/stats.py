import pandas as pd
import numpy as np

def safe(value):
    # Convert NaN, None, inf to None
    if pd.isna(value) or value is None:
        return None

    # Convert numpy types to Python native types
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)

    return value

def generate_summary(df: pd.DataFrame):
    summary = {
        "num_rows": safe(len(df)),
        "num_columns": safe(df.shape[1]),
        "columns": {},
    }

    for col in df.columns:
        col_data = df[col]

        col_summary = {
            "dtype": str(col_data.dtype),
            "missing_values": safe(col_data.isna().sum())
        }

        if pd.api.types.is_numeric_dtype(col_data):
            col_summary.update({
                "mean": safe(col_data.mean()),
                "median": safe(col_data.median()),
                "min": safe(col_data.min()),
                "max": safe(col_data.max()),
            })
        else:
            col_summary.update({
                "unique_values": safe(col_data.nunique())
            })

        summary["columns"][col] = col_summary

    return summary
