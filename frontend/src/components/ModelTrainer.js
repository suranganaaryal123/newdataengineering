import React, { useState } from "react";
import axios from "axios";

export default function ModelTrainer({ datasetId, columns }) {
  const [target, setTarget] = useState("");
  const [features, setFeatures] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add/remove features
  function toggleFeature(col) {
    setFeatures((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  }

  // Safe formatter (avoids errors from null/undefined/NaN)
  function fmt(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return "N/A";
    }
    return value.toFixed(4);
  }

  async function handleTrain() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const baseUrl = process.env.REACT_APP_API_URL;

      const res = await axios.post(
        `${baseUrl}/model/train/${datasetId}`,
        { target, features }
      );

      setResult(res.data);
    } catch (e) {
      console.error("Training error:", e);
      setError(e.response?.data?.detail || "Model training failed.");
    }

    setLoading(false);
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow border border-gray-700 mb-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Train Regression Model</h3>

      {/* Target Column */}
      <div className="mb-4">
        <label className="block mb-1">Target column:</label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-gray-200"
        >
          <option value="">Select target</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Feature Columns */}
      <div className="mb-4">
        <label className="block mb-1">Feature columns:</label>
        <div className="flex flex-wrap gap-4">
          {columns
            .filter((col) => col !== target)
            .map((col) => (
              <label key={col} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={features.includes(col)}
                  onChange={() => toggleFeature(col)}
                />
                <span>{col}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Train Button */}
      <button
        onClick={handleTrain}
        disabled={!target || features.length === 0 || loading}
        className="bg-accent hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
      >
        {loading ? "Training..." : "Train Model"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-400 mt-2">{error}</p>}

      {/* Show Metrics After Training */}
      {result && (
        <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-800">
          <h4 className="font-semibold mb-2">Model Performance:</h4>
          <ul className="text-sm text-gray-200 space-y-1">
            <li><strong>RMSE:</strong> {fmt(result.rmse)}</li>
            <li><strong>R² Score:</strong> {fmt(result.r2)}</li>
            <li><strong>MAE:</strong> {fmt(result.mae)}</li>
            <li><strong>Training Samples:</strong> {result.n_train}</li>
            <li><strong>Test Samples:</strong> {result.n_test}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
