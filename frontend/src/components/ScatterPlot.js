import React, { useState } from "react";
import { getScatter } from "../api";

export default function ScatterPlot({ datasetId, columns }) {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [img, setImg] = useState(null);

  const loadScatter = async () => {
    if (!x || !y) {
      alert("Please select both X and Y columns.");
      return;
    }

    try {
      const res = await getScatter(datasetId, x, y);

      if (!res || !res.image_base64) {
        alert("Scatter plot could not be generated (no numeric data?).");
        return;
      }

      setImg("data:image/png;base64," + res.image_base64);
    } catch (err) {
      console.error(err);
      alert("Failed to generate scatter plot.");
    }
  };

  return (
    <div className="bg-card p-6 mt-8 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold mb-4"> Scatter Plot</h3>

      {/* X axis selector */}
      <div className="mb-4">
        <label className="block mb-1">X-axis:</label>
        <select
          value={x}
          onChange={(e) => setX(e.target.value)}
          className="w-64 bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-accent"
        >
          <option value="">Select column</option>
          {columns.map((col, idx) => (
            <option key={idx} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Y axis selector */}
      <div className="mb-4">
        <label className="block mb-1">Y-axis:</label>
        <select
          value={y}
          onChange={(e) => setY(e.target.value)}
          className="w-64 bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-accent"
        >
          <option value="">Select column</option>
          {columns.map((col, idx) => (
            <option key={idx} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Generate button */}
      <button
        onClick={loadScatter}
        className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-indigo-600 transition"
      >
        Generate Scatter Plot
      </button>

      {/* Chart Preview */}
      {img && (
        <div className="mt-6 flex justify-center">
          <img
            src={img}
            alt="scatter-plot"
            className="w-[550px] rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      )}
    </div>
  );
}
