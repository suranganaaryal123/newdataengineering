import React, { useState } from "react";
import { getHistogram } from "../api";

export default function Histogram({ datasetId, columns }) {
  const [column, setColumn] = useState("");
  const [image, setImage] = useState(null);

  const loadHistogram = async () => {
    if (!column) return alert("Select a column first!");
    const base64 = await getHistogram(datasetId, column);
    setImage("data:image/png;base64," + base64);
  };

  return (
    <div className="bg-card p-6 mt-8 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4"> Histogram</h2>

      {/* Select column */}
      <div className="flex items-center gap-4 mb-4">
        <select
          onChange={(e) => setColumn(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg w-64 focus:ring-2 focus:ring-accent"
        >
          <option value="">Select a column</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <button
          onClick={loadHistogram}
          className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          Generate Histogram
        </button>
      </div>

      {/* Image preview */}
      {image && (
        <div className="mt-4 flex justify-center">
          <img
            src={image}
            alt="Histogram"
            className="w-[450px] rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      )}
    </div>
  );
}
