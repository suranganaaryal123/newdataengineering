import React, { useState } from "react";
import axios from "axios";

export default function AnomalyDetection({ datasetId, onDatasetUpdate }) {
  const [method, setMethod] = useState("zscore");
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");
  const [cleanId, setCleanId] = useState(null);

  const API = process.env.REACT_APP_API_URL;

  const runDetection = async () => {
    try {
      let endpoint =
        method === "zscore"
          ? `/analyze/anomalies/zscore/${datasetId}`
          : `/analyze/anomalies/isolation/${datasetId}`;

      const response = await axios.get(API + endpoint);
      setResults(response.data);
      setMessage("");
      setCleanId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to detect anomalies");
    }
  };

  const removeAnomalies = async () => {
    try {
      const response = await axios.get(
        `${API}/analyze/remove/${datasetId}/${method}`
      );

      const newId = response.data.cleaned_id;

      setMessage(
        `Removed ${response.data.removed_count} anomalies. New cleaned dataset saved!`
      );

      setCleanId(newId);
      if (onDatasetUpdate) onDatasetUpdate(newId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove anomalies");
    }
  };

  return (
    <div className="mt-8">
      {/* CARD CONTAINER */}
      <div className="bg-bgCard p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">Anomaly Detection</h2>

        {/* Method selector */}
        <div className="flex items-center mb-4 gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-gray-600 bg-bgCard rounded-md text-gray-200"
          >
            <option value="zscore" className="text-gray-800"> Z-Score Method</option>
            <option value="isolation" className="text-gray-800"> Isolation Forest</option>
          </select>

          <button
            onClick={runDetection}
            className="bg-indigo-500 hover:bg-indigo-600 
              text-white px-4 py-2 rounded-lg shadow transition"
          >
            Detect Anomalies
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-5">
            <h3 className="text-lg font-medium">
              Found{" "}
              <span className="text-red-500 font-bold">{results.count}</span>{" "}
              anomalies
            </h3>

            {results.count > 0 && (
              <button
                onClick={removeAnomalies}
                className="mt-3 bg-red-600 hover:bg-red-700 
                  text-white px-4 py-2 rounded-lg shadow transition"
              >
                Remove Anomalies & Save Clean Dataset
              </button>
            )}

            {message && <p className="text-green-500 mt-3">{message}</p>}

            {/* Download cleaned CSV */}
            {cleanId && (
              <a
                href={`${API}/analyze/download/${cleanId}`}
                download
                className="mt-4 inline-block bg-green-600 hover:bg-green-700
                  text-white px-4 py-2 rounded-lg shadow transition"
              >
                ⬇ Download Cleaned CSV
              </a>
            )}

            {/* Anomalies Table */}
            {results.anomalies.length === 0 ? (
              <p className="mt-4 text-gray-300">No anomalies detected 🎉</p>
            ) : (
              <table className="mt-4 w-full border border-gray-700 text-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    {Object.keys(results.anomalies[0] || {}).map((col) => (
                      <th key={col} className="border border-gray-700 px-3 py-2">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.anomalies.map((row, i) => (
                    <tr key={i} className="bg-red-900/40">
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="border border-gray-700 px-3 py-2"
                        >
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
