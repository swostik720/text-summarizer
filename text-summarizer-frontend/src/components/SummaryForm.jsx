import React, { useState } from 'react';
import axios from '../axios';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryForm = ({ onSummaryCreated }) => {
  const [isFileMode, setIsFileMode] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({ summary: '', original: '' });
  const [loading, setLoading] = useState(false);

  const summarize = async (inputText) => {
    const res = await axios.post('/summarize', { text: inputText });
    return res.data[0]?.summary_text || 'No summary returned.';
  };

  const handleSubmit = async () => {
    setLoading(true);
    let originalText = text;

    if (isFileMode && file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/upload', formData);
      originalText = res.data.text;
    }

    const summaryText = await summarize(originalText);
    setResult({ summary: summaryText, original: originalText });

    await axios.post('/summaries', {
        original_text: originalText,
      summary_text: summaryText,
    });

    setText('');
    setFile(null);
    setLoading(false);
    onSummaryCreated();
  };

  return (
    <motion.div layout className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
          {isFileMode ? 'Upload and Summarize' : 'Summarize Text'}
        </h2>
        <button
          onClick={() => setIsFileMode(!isFileMode)}
          className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <Plus />
        </button>
      </div>

      {isFileMode ? (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input w-full"
        />
      ) : (
        <textarea
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize"
          className="w-full p-3 border border-indigo-300 rounded dark:bg-gray-700 dark:text-white"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (!text && !file)}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
      >
        {loading ? 'Processing...' : 'Summarize'}
      </button>

      {result.summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Summary:</h3>
            <p className="bg-indigo-50 dark:bg-gray-700 p-3 rounded">{result.summary}</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Original Text:</h3>
            <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded">{result.original}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SummaryForm;
