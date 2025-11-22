import React, { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function Summary({ datasetId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (datasetId) loadSummary();
    // eslint-disable-next-line
  }, [datasetId]);

  async function loadSummary() {
    try {
      const data = await getSummary(datasetId);
      setSummary(data);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  }

  if (!summary)
    return (
      <p className="text-gray-400 mt-4 animate-pulse">Loading dataset summary...</p>
    );

  const columns = summary.columns || summary; // Support both formats

  return (
    <div className="bg-card mt-6 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold mb-4"> Dataset Summary</h2>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2 text-gray-300">Column</th>
            <th className="p-2 text-gray-300">Type</th>
            <th className="p-2 text-gray-300">Missing</th>
            <th className="p-2 text-gray-300">Stats</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(columns).map(([name, info]) => (
            <tr key={name} className="border-b border-gray-800">
              <td className="p-2 font-semibold">{name}</td>

              <td className="p-2">
                <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-sm">
                  {info.dtype}
                </span>
              </td>

              <td className="p-2">
                {info.missing_values !== undefined ? (
                  <span className="text-red-400 font-semibold">
                    {info.missing_values}
                  </span>
                ) : (
                  "-"
                )}
              </td>

              <td className="p-2 text-gray-300 text-sm">
                {info.mean !== undefined && (
                  <div>Mean: <span className="text-accent">{info.mean}</span></div>
                )}
                {info.median !== undefined && (
                  <div>Median: <span className="text-accent">{info.median}</span></div>
                )}
                {info.min !== undefined && (
                  <div>Min: <span className="text-accent">{info.min}</span></div>
                )}
                {info.max !== undefined && (
                  <div>Max: <span className="text-accent">{info.max}</span></div>
                )}
                {info.mean === undefined && <span className="text-gray-500">No numeric stats</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
