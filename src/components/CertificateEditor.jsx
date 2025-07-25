import React, { useState } from 'react';
import { X, Save, Eye, Palette, Type, Layout } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';

const CertificateEditor = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || 'participation',
    design: {
      backgroundColor: template?.design?.backgroundColor || '#f0f9ff',
      borderColor: template?.design?.borderColor || '#0ea5e9',
      titleColor: template?.design?.titleColor || '#0c4a6e',
      textColor: template?.design?.textColor || '#374151',
      logoPosition: template?.design?.logoPosition || 'top-center'
    },
    content: {
      title: template?.content?.title || 'Certificate of Participation',
      subtitle: template?.content?.subtitle || 'Beach Cleanup Initiative',
      bodyText: template?.content?.bodyText || 'This certifies that {participantName} has successfully participated in {eventTitle} organized by {organizerName} on {eventDate} and contributed to collecting {wasteCollected} kg of waste.'
    }
  });

  const [activeTab, setActiveTab] = useState('content');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const presetColors = [
    { bg: '#f0f9ff', border: '#0ea5e9', title: '#0c4a6e', name: 'Ocean Blue' },
    { bg: '#f0fdf4', border: '#22c55e', title: '#15803d', name: 'Forest Green' },
    { bg: '#fef3c7', border: '#f59e0b', title: '#92400e', name: 'Golden Yellow' },
    { bg: '#fce7f3', border: '#ec4899', title: '#be185d', name: 'Rose Pink' },
    { bg: '#f3e8ff', border: '#a855f7', title: '#7c2d12', name: 'Royal Purple' }
  ];

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Editor */}
          <div className="w-1/2 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {template ? 'Edit Template' : 'Create Template'}
              </h2>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === id
                      ? 'border-b-2 border-sky-500 text-sky-600'
                      : 'text-gray-600 hover:text-sky-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter template name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="participation">Participation</option>
                      <option value="achievement">Achievement</option>
                      <option value="leadership">Leadership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.content.title}
                      onChange={(e) => handleChange('content', 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.content.subtitle}
                      onChange={(e) => handleChange('content', 'subtitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Text
                    </label>
                    <textarea
                      value={formData.content.bodyText}
                      onChange={(e) => handleChange('content', 'bodyText', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Use placeholders: {participantName}, {eventTitle}, {organizerName}, {eventDate}, {wasteCollected}"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available placeholders: {'{participantName}'}, {'{eventTitle}'}, {'{organizerName}'}, {'{eventDate}'}, {'{wasteCollected}'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color Presets
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {presetColors.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleChange('design', 'backgroundColor', preset.bg);
                            handleChange('design', 'borderColor', preset.border);
                            handleChange('design', 'titleColor', preset.title);
                          }}
                          className="p-3 border rounded-lg hover:shadow-md transition-shadow text-left"
                          style={{ backgroundColor: preset.bg, borderColor: preset.border }}
                        >
                          <div className="font-medium" style={{ color: preset.title }}>
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={formData.design.backgroundColor}
                      onChange={(e) => handleChange('design', 'backgroundColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={formData.design.borderColor}
                      onChange={(e) => handleChange('design', 'borderColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Color
                    </label>
                    <input
                      type="color"
                      value={formData.design.titleColor}
                      onChange={(e) => handleChange('design', 'titleColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={formData.design.textColor}
                      onChange={(e) => handleChange('design', 'textColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Position
                    </label>
                    <select
                      value={formData.design.logoPosition}
                      onChange={(e) => handleChange('design', 'logoPosition', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="top-center">Top Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <CertificateTemplate template={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;