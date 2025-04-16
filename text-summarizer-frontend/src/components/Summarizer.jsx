import React, { useState } from 'react';
import axios from '../axios';

const Summarizer = ({ onSummaryCreated }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/summarize', { text });
      const summaryText = res.data[0]?.summary_text || 'No summary returned.';
      setSummary(summaryText);

      // Save to DB
      await axios.post('/summaries', {
        original_text: text,
        summary_text: summaryText,
      });

      if (onSummaryCreated) onSummaryCreated(); // refresh list
    } catch (error) {
      setSummary('Error summarizing text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">Summarize Text</h2>
      <textarea
        rows="6"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none placeholder:text-gray-400"
      />
      <button
        onClick={handleSummarize}
        disabled={loading}
        className={`w-full py-3 text-lg font-semibold rounded-lg transition duration-300 ${
          loading
            ? 'bg-indigo-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && (
        <div className="space-y-2">
          <h4 className="text-xl font-semibold text-indigo-700">Summary:</h4>
          <p className="p-4 bg-indigo-50 rounded-lg text-gray-800">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
