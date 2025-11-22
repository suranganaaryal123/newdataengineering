import io

def test_zscore_anomaly(client):
    csv = b"Index,Price\n1,100\n2,105\n3,110\n4,5000"  # 5000 is anomaly
    file = {"file": ("anomaly.csv", io.BytesIO(csv), "text/csv")}

    upload = client.post("/upload/", files=file)
    dataset_id = upload.json()["dataset_id"]

    response = client.get(f"/analyze/anomalies/zscore/{dataset_id}")

    assert response.status_code == 200
    data = response.json()

    assert data["count"] == 1
    assert data["anomalies"][0]["Price"] == 5000
