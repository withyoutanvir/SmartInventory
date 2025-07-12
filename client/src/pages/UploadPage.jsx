import React, { useState } from "react";
import { useDataRefresh } from "../context/DataRefreshContext";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const { triggerRefresh } = useDataRefresh();

  // 👉 Update to target your Express backend
  const BACKEND_URL = "http://localhost:5000"; 

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setMessage("");
    } else {
      setSelectedFile(null);
      setMessage("❌ Please upload a valid CSV file.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // must match multer's field name

    try {
      const res = await fetch(`${BACKEND_URL}/api/data/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const countText = json.count ? ` (${json.count} rows)` : "";
        setMessage(`✅ ${json.message}${countText}`);
        setSelectedFile(null);
        triggerRefresh(); // 🔁 trigger dashboard refresh
      } else {
        const errorText = await res.text();
        setMessage(`❌ Upload failed. ${errorText}`);
      }
    } catch (error) {
      setMessage("❌ Upload failed. Check your server connection.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">📤 Upload CSV to Inventory System</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4 block w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Upload
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
