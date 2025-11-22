import React, { useState } from "react";

import Upload from "./components/Upload";
import Summary from "./components/Summary";
import Histogram from "./components/Histogram";
import ScatterPlot from "./components/ScatterPlot";

import BoxPlot from "./components/BoxPlot";
import AnomalyDetection from "./components/AnomalyDetection";
import DataCleaning from "./components/DataCleaning";
import ModelTrainer from "./components/ModelTrainer";


function App() {
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">InsightHub Dashboard</h1>

      {/* Upload component */}
      <Upload
        onUpload={(id, cols) => {
          setDatasetId(id);
          setColumns(cols);
        }}
      />

      {/* Show summary only if dataset is uploaded */}
      {datasetId && (
        <>
          {/* Model training section */}
          <ModelTrainer datasetId={datasetId} columns={columns} />

          <Summary datasetId={datasetId} />

          <h2 className="text-2xl font-semibold mt-6">Visualizations</h2>

          <Histogram datasetId={datasetId} columns={columns} />
          <ScatterPlot datasetId={datasetId} columns={columns} />
          <BoxPlot datasetId={datasetId} columns={columns} />

          <AnomalyDetection
            datasetId={datasetId}
            onDatasetUpdate={(newId) => setDatasetId(newId)}
          />

          <DataCleaning
            datasetId={datasetId}
            onDatasetUpdate={(newId) => setDatasetId(newId)}
          />
        </>
      )}
    </div>
  );
}

export default App;
