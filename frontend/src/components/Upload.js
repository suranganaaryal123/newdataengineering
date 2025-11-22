import React, { useState } from "react";
import { uploadCSV } from "../api";

export default function Upload({ onUpload }) {
  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const response = await uploadCSV(file);

    // Pass dataset ID + column names to parent
    onUpload(response.dataset_id, response.columns);
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-md border border-gray-700 mb-6">
      <h2 className="text-2xl font-bold mb-4"> Upload CSV</h2>

      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-300 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 
                     file:bg-accent file:text-white 
                     hover:file:bg-indigo-600 
                     cursor-pointer"
        />

        <button
          onClick={handleUpload}
          className="bg-accent hover:bg-indigo-600 
                     text-white px-5 py-2 
                     rounded-lg shadow transition"
        >
          Upload
        </button>
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-400">
          Selected file: <span className="text-gray-200">{file.name}</span>
        </p>
      )}
    </div>
  );
}
