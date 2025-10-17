import React, { useState } from 'react';

const CertificateEditor = ({ template, onSave, onCancel }) => {
  const [name, setName] = useState(template?.name || 'New Certificate');
  const [type, setType] = useState(template?.type || 'participation');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ id: template?.id || Date.now().toString(), name, type });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {template ? 'Edit Template' : 'Create Template'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="participation">Participation</option>
              <option value="achievement">Achievement</option>
              <option value="completion">Completion</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:from-sky-600 hover:to-teal-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateEditor;
