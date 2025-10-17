import React from 'react';

const CertificateTemplate = ({ template, preview }) => {
  const displayName = template?.name || 'Untitled Template';
  const displayType = template?.type || 'general';

  return (
    <div className={`border rounded-xl bg-white shadow-sm ${preview ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{displayName}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
        </span>
      </div>
      <div className={`bg-gray-50 border border-dashed border-gray-300 rounded-lg ${preview ? 'h-32' : 'h-40'} flex items-center justify-center text-gray-400`}>
        <span>{preview ? 'Certificate Preview' : 'Certificate Canvas'}</span>
      </div>
    </div>
  );
};

export default CertificateTemplate;
