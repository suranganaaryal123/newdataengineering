import sys
import os
import pytest

# Add backend folder to Python path correctly
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from app.main import app
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)
