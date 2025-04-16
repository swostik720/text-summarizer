import React, { useState } from 'react';
import axios from '../axios';

const FileUploader = ({ onSummaryCreated }) => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('/upload', formData);
    const text = res.data.text;
    setExtractedText(text);

    await axios.post('/summaries', {
      original_text: text,
      summary_text: text, 
    });

    onSummaryCreated();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700">Upload File</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-3 mt-4 bg-indigo-50 border border-indigo-200 rounded-lg"
      />
      <button
        onClick={handleUpload}
        className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Upload and Summarize
      </button>
    </div>
  );
};

export default FileUploader;
