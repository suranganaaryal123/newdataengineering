import io

def test_summary(client):
    csv = b"Index,Price,Area\n1,300,1200\n2,250,800"
    file = {"file": ("sample.csv", io.BytesIO(csv), "text/csv")}

    # Upload
    upload = client.post("/upload/", files=file)
    dataset_id = upload.json()["dataset_id"]

    # Summary
    response = client.get(f"/summary/{dataset_id}")

    assert response.status_code == 200
    summary = response.json()

    assert "Price" in summary
    assert "Area" in summary
    assert summary["Price"]["min"] == 250
    assert summary["Price"]["max"] == 300
