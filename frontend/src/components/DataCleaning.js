import React, { useState } from "react";
import axios from "axios";

<<<<<<< HEAD
const API = process.env.REACT_APP_API_URL;
=======
const API = "https://data-engineering-hkx6.onrender.com";
>>>>>>> d9a2548 (Remove build folder)

export default function DataCleaning({ datasetId, onDatasetUpdate }) {
  const [duplicates, setDuplicates] = useState(null);
  const [heatmap, setHeatmap] = useState("");
  const [importance, setImportance] = useState(null);
  const [target, setTarget] = useState("");

  const fetchDuplicates = async () => {
    const res = await axios.get(`${API}/cleaning/duplicates/${datasetId}`);
    setDuplicates(res.data);
  };

  const removeDuplicates = async () => {
    const res = await axios.get(`${API}/cleaning/remove-duplicates/${datasetId}`);
    onDatasetUpdate(res.data.cleaned_id);
    alert(`Removed ${res.data.removed} duplicates`);
  };

  const fetchHeatmap = async () => {
    const res = await axios.get(`${API}/cleaning/heatmap/${datasetId}`);
    setHeatmap(res.data.image_base64);
  };

  const fetchImportance = async () => {
    const res = await axios.get(`${API}/cleaning/importance/${datasetId}/${target}`);
    setImportance(res.data.importances);
  };

  return (
    <div className="mt-10 bg-card p-6 rounded-xl border border-gray-700 shadow-lg">

      <h2 className="text-2xl font-bold mb-4"> Data Cleaning</h2>

      {/* Duplicate Detection Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Duplicate Rows</h3>

        <button
          onClick={fetchDuplicates}
          className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          Check Duplicates
        </button>

        {duplicates && (
          <div className="mt-3">
            <p className="text-gray-300">
              {duplicates.count} duplicate rows found
            </p>

            {duplicates.count > 0 && (
              <button
                onClick={removeDuplicates}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                Remove Duplicates & Save Clean Dataset
              </button>
            )}
          </div>
        )}
      </div>

      <hr className="border-gray-700 my-6" />

      {/* Heatmap */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Correlation Heatmap</h3>

        <button
          onClick={fetchHeatmap}
          className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          Generate Correlation Heatmap
        </button>

        {heatmap && (
          <div className="mt-4 flex justify-center">
            <img
              src={`data:image/png;base64,${heatmap}`}
              alt="Heatmap"
              className="rounded-lg w-[500px] shadow-lg"
            />
          </div>
        )}
      </div>

      <hr className="border-gray-700 my-6" />

      {/* Feature Importance */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Feature Importance</h3>

        <div className="flex gap-3 mb-4">
          <input
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 w-64 focus:ring-2 focus:ring-accent"
            placeholder="Enter target column"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          <button
            onClick={fetchImportance}
            className="px-4 py-2 bg-accent text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            Calculate Importance
          </button>
        </div>

        {importance && (
          <ul className="text-gray-300 mt-4 space-y-2">
            {Object.entries(importance).map(([col, imp]) => (
              <li
                key={col}
                className="bg-gray-800 p-2 rounded-lg border border-gray-700"
              >
                <strong className="text-accent">{col}</strong>:{" "}
                {imp.toFixed(4)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
