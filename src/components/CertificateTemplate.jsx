import React from 'react';
import { Award } from 'lucide-react';

const CertificateTemplate = ({ template, preview = false, data = {} }) => {
  const {
    participantName = 'John Doe',
    eventTitle = 'Sample Beach Cleanup Event',
    organizerName = 'Ocean Guardians NGO',
    eventDate = '2024-12-15',
    wasteCollected = '15.5'
  } = data;

  const processText = (text) => {
    return text
      .replace('{participantName}', participantName)
      .replace('{eventTitle}', eventTitle)
      .replace('{organizerName}', organizerName)
      .replace('{eventDate}', new Date(eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      .replace('{wasteCollected}', wasteCollected);
  };

  return (
    <div 
      className={`relative border-4 rounded-lg p-8 ${preview ? 'scale-75 origin-top' : ''}`}
      style={{
        backgroundColor: template.design.backgroundColor,
        borderColor: template.design.borderColor,
        minHeight: preview ? '200px' : '400px'
      }}
    >
      {/* Logo */}
      <div className={`flex ${template.design.logoPosition === 'top-center' ? 'justify-center' : 'justify-start'} mb-6`}>
        <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 
          className={`text-3xl font-bold mb-2 ${preview ? 'text-lg' : ''}`}
          style={{ color: template.design.titleColor }}
        >
          {template.content.title}
        </h1>
        <h2 
          className={`text-xl font-semibold ${preview ? 'text-sm' : ''}`}
          style={{ color: template.design.titleColor }}
        >
          {template.content.subtitle}
        </h2>
      </div>

      {/* Body Text */}
      <div className="text-center mb-8">
        <p 
          className={`text-lg leading-relaxed ${preview ? 'text-xs' : ''}`}
          style={{ color: template.design.textColor }}
        >
          {processText(template.content.bodyText)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
          <p className={`text-sm text-gray-600 ${preview ? 'text-xs' : ''}`}>Date</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-32 mb-2"></div>
          <p className={`text-sm text-gray-600 ${preview ? 'text-xs' : ''}`}>Authorized Signature</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <Award className="w-24 h-24 text-gray-400" />
      </div>
    </div>
  );
};

export default CertificateTemplate;