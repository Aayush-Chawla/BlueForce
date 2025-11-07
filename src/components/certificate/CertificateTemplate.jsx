import React from 'react';
import { Award } from 'lucide-react';

const CertificateTemplate = ({ template, preview }) => {
  const displayName = template?.name || 'Untitled Template';
  const displayType = template?.type || 'general';

  // Get color scheme based on certificate type
  const getTypeColors = (type) => {
    switch (type?.toLowerCase()) {
      case 'participation':
        return {
          bg: 'bg-gradient-to-br from-sky-50 to-blue-50',
          border: 'border-sky-300',
          title: 'text-sky-700',
          text: 'text-slate-700',
          accent: 'from-sky-400 to-blue-500'
        };
      case 'achievement':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          border: 'border-amber-300',
          title: 'text-amber-700',
          text: 'text-amber-900',
          accent: 'from-amber-400 to-yellow-500'
        };
      case 'completion':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
          border: 'border-emerald-300',
          title: 'text-emerald-700',
          text: 'text-emerald-900',
          accent: 'from-emerald-400 to-teal-500'
        };
      case 'leadership':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-300',
          title: 'text-purple-700',
          text: 'text-purple-900',
          accent: 'from-purple-400 to-indigo-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-300',
          title: 'text-gray-700',
          text: 'text-gray-800',
          accent: 'from-gray-400 to-slate-500'
        };
    }
  };

  const colors = getTypeColors(displayType);

  // Get certificate title based on type
  const getCertificateTitle = (type) => {
    switch (type?.toLowerCase()) {
      case 'participation':
        return 'Certificate of Participation';
      case 'achievement':
        return 'Certificate of Achievement';
      case 'completion':
        return 'Certificate of Completion';
      case 'leadership':
        return 'Certificate of Leadership';
      default:
        return 'Certificate';
    }
  };

  if (preview) {
    return (
      <div className={`border-2 ${colors.border} rounded-lg ${colors.bg} overflow-hidden ${preview ? 'h-48' : 'h-64'} flex flex-col`}>
        {/* Certificate Header */}
        <div className="flex items-center justify-center pt-4 pb-2">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.accent} flex items-center justify-center`}>
            <Award className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Certificate Title */}
        <div className="text-center px-4 py-2">
          <h3 className={`font-bold ${colors.title} ${preview ? 'text-sm' : 'text-lg'}`}>
            {getCertificateTitle(displayType)}
          </h3>
        </div>

        {/* Certificate Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">
          <p className={`${colors.text} ${preview ? 'text-xs' : 'text-sm'} text-center mb-2`}>
            This is to certify that
          </p>
          <div className={`w-full max-w-[80%] h-0.5 bg-gradient-to-r ${colors.accent} my-2`}></div>
          <p className={`${colors.text} ${preview ? 'text-xs' : 'text-sm'} font-semibold text-center mb-1`}>
            [Participant Name]
          </p>
          <p className={`${colors.text} ${preview ? 'text-xs' : 'text-sm'} text-center mt-2`}>
            has successfully {displayType === 'participation' ? 'participated in' : 
                            displayType === 'achievement' ? 'achieved excellence in' :
                            displayType === 'completion' ? 'completed' :
                            displayType === 'leadership' ? 'demonstrated leadership in' : 'contributed to'}
          </p>
          <p className={`${colors.text} ${preview ? 'text-xs' : 'text-sm'} font-medium text-center mt-1`}>
            [Event Name]
          </p>
        </div>

        {/* Certificate Footer */}
        <div className="border-t border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className={`${colors.text} ${preview ? 'text-[10px]' : 'text-xs'}`}>
            <div className="font-semibold">[Signature]</div>
            <div>Date: [Date]</div>
          </div>
          <div className={`${colors.text} ${preview ? 'text-[10px]' : 'text-xs'}`}>
            <div className="font-semibold">[Organization]</div>
            <div>Certificate ID: {template?.id || 'N/A'}</div>
          </div>
        </div>
      </div>
    );
  }

  // Non-preview mode (for editor)
  return (
    <div className={`border rounded-xl bg-white shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{displayName}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
        </span>
      </div>
      <div className={`bg-gray-50 border border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400`}>
        <span>Certificate Canvas</span>
      </div>
    </div>
  );
};

export default CertificateTemplate;
