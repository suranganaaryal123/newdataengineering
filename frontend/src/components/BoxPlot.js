import React, { useState } from "react";

import axios from "axios";

export default function BoxPlot({ datasetId, columns }) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  async function generateBoxplot() {
    setError("");
    setImage(null);

    const apiBase = process.env.REACT_APP_API_URL;

    try {
      const res = await axios.get(
        `${apiBase}/visualize/boxplot/${datasetId}/${selectedColumn}`
      );

      if (!res.data || !res.data.image_base64) {
        setError("Boxplot could not be generated.");
        return;
      }

      setImage("data:image/png;base64," + res.data.image_base64);
    } catch (err) {
      console.error("Boxplot error:", err);
      setError("Failed to generate boxplot.");
    }
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
      <h3 className="text-xl font-semibold mb-4"> Box Plot</h3>

      {/* Column selector */}
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-accent"
      >
        <option value="">Select column</option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      {/* Generate button */}
      <button
        onClick={generateBoxplot}
        className="
          px-4 py-2 bg-accent text-white 
          rounded-lg shadow-md 
          hover:bg-indigo-600 transition
        "
      >
        Generate Boxplot
      </button>

      {/* Error message */}
      {error && (
        <p className="text-red-400 font-medium mt-3">{error}</p>
      )}

      {/* Result image */}
      {image && (
        <div className="mt-4 flex justify-center">
          <img
            src={image}
            alt="Boxplot"
            className="w-[400px] rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
}
