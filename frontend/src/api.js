import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;


// -------- UPLOAD --------
export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

// -------- SUMMARY --------
export async function getSummary(datasetId) {
  const response = await axios.get(`${API_URL}/summary/${datasetId}`);
  return response.data;
}

// -------- HISTOGRAM --------
export async function getHistogram(datasetId, column) {
  const response = await axios.get(
    `${API_URL}/visualize/histogram/${datasetId}/${encodeURIComponent(column)}`
  );
  return response.data.image_base64;
}

// -------- SCATTER PLOT --------
export async function getScatter(datasetId, x, y) {
  const response = await axios.get(
    `${API_URL}/visualize/scatter/${datasetId}/${encodeURIComponent(x)}/${encodeURIComponent(y)}`
  );

  return response.data;
}


// -------- BOXPLOT --------
export async function getBoxplot(datasetId, column) {
  const response = await axios.get(
    `${API_URL}/visualize/boxplot/${datasetId}/${encodeURIComponent(column)}`
  );
  return response.data.image_base64;
}

//anomaly
export async function detectZScore(id) {
  const res = await axios.get(`${API_URL}/analyze/anomalies/zscore/${id}`);
  return res.data;
}

export async function detectIsolation(id) {
  const res = await axios.get(`${API_URL}/analyze/anomalies/isolation/${id}`);
  return res.data;
}
//cleaning anamoly
export async function removeAnomalies(datasetId, method) {
  const response = await axios.get(
    `${API_URL}/analyze/remove/${datasetId}/${method}`
  );
  return response.data;
}
