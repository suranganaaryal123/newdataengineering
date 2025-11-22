import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import re
from io import BytesIO


# --- Universal cleaning function ---
def clean_numeric(series):
    def extract_number(value):
        if pd.isna(value):
            return None
        value = str(value)
        value = re.sub(r"[₹$,]", "", value)
        match = re.search(r"[-+]?\d*\.?\d+", value)
        return float(match.group()) if match else None
    return series.apply(extract_number)


def fig_to_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def plot_histogram(df: pd.DataFrame, column: str):
    numeric = clean_numeric(df[column]).dropna()

    if numeric.empty:
        raise ValueError(f"Column '{column}' has no numeric data.")

    plt.figure(figsize=(6, 4))
    plt.hist(numeric, bins=20)
    plt.title(f"Histogram of {column}")
    plt.xlabel(column)
    plt.ylabel("Frequency")

    return fig_to_base64()


def plot_boxplot(df: pd.DataFrame, column: str):
    numeric = clean_numeric(df[column]).dropna()

    if numeric.empty:
        raise ValueError(f"Column '{column}' has no numeric data.")

    plt.figure(figsize=(5, 4))
    plt.boxplot(numeric)
    plt.title(f"Boxplot of {column}")

    return fig_to_base64()


def plot_scatter(df, x, y):
    numeric_x = clean_numeric(df[x])
    numeric_y = clean_numeric(df[y])

    valid = numeric_x.notna() & numeric_y.notna()
    numeric_x = numeric_x[valid]
    numeric_y = numeric_y[valid]

    if len(numeric_x) < 2:
        return None

    plt.figure(figsize=(6, 4))
    plt.scatter(numeric_x, numeric_y)
    plt.xlabel(x)
    plt.ylabel(y)
    plt.title(f"{x} vs {y}")

    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    plt.close()

    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode()
