import io

def test_upload_csv(client):
    csv_content = b"Index,Price,Area\n1,300,1200\n2,250,800"
    file = {"file": ("test.csv", io.BytesIO(csv_content), "text/csv")}

    response = client.post("/upload/", files=file)

    assert response.status_code == 200
    data = response.json()

    assert "dataset_id" in data
    assert data["rows"] == 2
    assert data["columns"] == ["Index", "Price", "Area"]
