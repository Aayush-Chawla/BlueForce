import React, { useState } from 'react';
import { Award, Plus, Edit, Eye } from 'lucide-react';
import { useAuth } from '../../contexts';
import { useEvents } from '../../contexts';
import CertificateTemplate from '../../components/certificate/CertificateTemplate';
import CertificateEditor from '../../components/certificate/CertificateEditor';
import { mockTemplates } from '../../utils/mockData';

const NGOCertificates = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('templates');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  if (!user || user.role !== 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only NGO organizers can access certificate management.</p>
        </div>
      </div>
    );
  }

  // Group participants by their id for all events organized by the NGO
  const eventParticipants = {};
  if (events) {
    events.forEach(event => {
      if (event.ngoId === user?.id && event.currentParticipants > 0) {
        // Since we don't have participant data from backend yet, create mock participants
        for (let i = 0; i < event.currentParticipants; i++) {
          const participantId = `participant_${event.id}_${i}`;
          if (!eventParticipants[participantId]) {
            eventParticipants[participantId] = [];
          }
          eventParticipants[participantId].push(event);
        }
      }
    });
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = (templateData) => {
    console.log('Saving template:', templateData);
    setShowEditor(false);
    setEditingTemplate(null);
    // In a real app, this would save to the backend
  };

  const handleIssueCertificate = (participantId, eventId, templateId) => {
    console.log('Issuing certificate:', { participantId, eventId, templateId });
    // In a real app, this would create and issue the certificate
    alert('Certificate issued successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Certificate Management</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create templates and manage certificates for your events
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'participants'
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Issue Certificates</span>
            </button>
          </div>
        </div>

        {/* Certificate Editor Modal */}
        {showEditor && (
          <CertificateEditor
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setShowEditor(false)}
          />
        )}

        {/* Content based on active tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Certificate Templates</h2>
              <button
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Template</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{template.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-blue-200`}>
                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <CertificateTemplate template={template} preview={true} />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all text-sm font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Issue Certificates to Participants</h2>
            
            {Object.keys(eventParticipants).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(eventParticipants).map(([participantId, participantEvents]) => {
                  const participant = participantEvents[0].participants.find(p => p.id === participantId);
                  return (
                    <div key={participantId} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={participant.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={participant.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{participant.name}</h3>
                            <p className="text-gray-600">{participant.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Events Participated:</h4>
                        {participantEvents.map(event => (
                          <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{event.title}</p>
                              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                              {mockTemplates.map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleIssueCertificate(participantId, event.id, template.id)}
                                  className="px-3 py-1 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all text-sm"
                                >
                                  Issue {template.type}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No participants found</h3>
                <p className="text-gray-500">Participants will appear here after they join your events.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOCertificates;