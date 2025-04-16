import React, { useState } from 'react';
import axios from '../axios';
import { Copy, Trash, ArrowLeft } from 'lucide-react';

const SummaryDetail = ({ summary, onBack, onUpdate }) => {
  const [edited, setEdited] = useState(summary.summary_text);
  const [copied, setCopied] = useState(false);

  // Determine if the viewer is an admin (admin summaries will include user info)
  const isAdmin = summary.user !== undefined;

  const handleUpdate = async () => {
    const endpoint = isAdmin
      ? `/admin/summaries/${summary.id}`
      : `/summaries/${summary.id}`;

    try {
      await axios.put(endpoint, {
        original_text: summary.original_text,
        summary_text: edited,
      });

      onUpdate();
      alert('Summary updated!');
    } catch (error) {
      alert('Failed to update summary.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const endpoint = isAdmin
      ? `/admin/summaries/${summary.id}`
      : `/summaries/${summary.id}`;

    try {
      await axios.delete(endpoint);
      onUpdate();
      onBack();
    } catch (error) {
      alert('Failed to delete summary.');
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(edited);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center text-indigo-600">
        <ArrowLeft className="mr-1" /> Back
      </button>

      <div>
        <h3 className="font-semibold">Summary:</h3>
        <textarea
          className="w-full p-3 border rounded dark:bg-gray-700"
          rows="4"
          value={edited}
          onChange={(e) => setEdited(e.target.value)}
        />
        <div className="flex gap-3 mt-2">
          <button onClick={handleUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={handleCopy} className="bg-green-600 text-white px-4 py-2 rounded">
            {copied ? 'Copied!' : <Copy />}
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
            <Trash />
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mt-6">Original Text:</h3>
        <p className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
          {summary.original_text}
        </p>
      </div>

      {isAdmin && summary.user && (
        <div className="text-sm text-gray-500 mt-2">
          <strong>Author:</strong> {summary.user.name} ({summary.user.email})
        </div>
      )}
    </div>
  );
};

export default SummaryDetail;
