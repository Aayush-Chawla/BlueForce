import React, { useState } from 'react';
import { Award, Download, Share2, Calendar, MapPin, User, CheckCircle, Search, Filter, Plus, Edit, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import CertificateTemplate from '../components/CertificateTemplate';
import CertificateEditor from '../components/CertificateEditor';
import { mockTemplates } from '../utils/mockData';

const Certificates = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState(user?.role === 'ngo' ? 'templates' : 'certificates');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Group participants by their id for all events organized by the NGO
  const eventParticipants = {};
  if (user?.role === 'ngo' && events) {
    events.forEach(event => {
      if (event.organizer && event.organizer.id === user.id && event.participants) {
        event.participants.forEach(participant => {
          if (!eventParticipants[participant.id]) {
            eventParticipants[participant.id] = [];
          }
          eventParticipants[participant.id].push(event);
        });
      }
    });
  }

  // Mock certificates data - in a real app, this would come from an API
  const mockCertificates = [
    {
      id: '1',
      eventId: '1',
      eventTitle: 'Golden Gate Beach Cleanup',
      participantId: user?.id || '2',
      participantName: user?.name || 'Alex Chen',
      organizerId: '1',
      organizerName: 'Ocean Guardians NGO',
      dateIssued: '2024-11-25',
      wasteCollected: 15.5,
      certificateType: 'participation',
      verificationCode: 'CW-2024-GG-001'
    },
    {
      id: '2',
      eventId: '3',
      eventTitle: 'Half Moon Bay Community Cleanup',
      participantId: user?.id || '2',
      participantName: user?.name || 'Alex Chen',
      organizerId: '1',
      organizerName: 'Ocean Guardians NGO',
      dateIssued: '2024-11-25',
      wasteCollected: 22.3,
      certificateType: 'achievement',
      verificationCode: 'CW-2024-HMB-002'
    },
    {
      id: '3',
      eventId: '2',
      eventTitle: 'Monterey Bay Restoration',
      participantId: user?.id || '2',
      participantName: user?.name || 'Alex Chen',
      organizerId: '1',
      organizerName: 'Ocean Guardians NGO',
      dateIssued: '2024-12-01',
      wasteCollected: 18.7,
      certificateType: 'leadership',
      verificationCode: 'CW-2024-MB-003'
    }
  ];

  const filteredCertificates = mockCertificates.filter(cert =>
    cert.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(cert =>
    filterType === 'all' || cert.certificateType === filterType
  );

  const getCertificateTypeColor = (type) => {
    switch (type) {
      case 'participation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'achievement': return 'bg-green-100 text-green-800 border-green-200';
      case 'leadership': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificateIcon = (type) => {
    switch (type) {
      case 'participation': return 'bg-blue-500';
      case 'achievement': return 'bg-green-500';
      case 'leadership': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDownload = (certificate) => {
    // In a real app, this would generate and download a PDF certificate
    console.log('Downloading certificate:', certificate.id);
    alert('Certificate download would start here');
  };

  const handleShare = (certificate) => {
    // In a real app, this would open a share dialog
    console.log('Sharing certificate:', certificate.id);
    if (navigator.share) {
      navigator.share({
        title: `${certificate.eventTitle} Certificate`,
        text: `I earned a certificate for participating in ${certificate.eventTitle}!`,
        url: window.location.href
      });
    } else {
      alert('Share functionality would be implemented here');
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your certificates</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {user?.role === 'ngo' ? 'Certificate Management' : 'My Certificates'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user?.role === 'ngo' 
              ? 'Create templates and manage certificates for your events'
              : 'Your achievements in environmental conservation and beach cleaning events'
            }
          </p>
        </div>

        {/* Tabs for NGO */}
        {user?.role === 'ngo' && (
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
                <User className="w-5 h-5" />
                <span>Issue Certificates</span>
              </button>
            </div>
          </div>
        )}

        {/* Stats */}

        {/* Certificate Editor Modal */}
        {showEditor && (
          <CertificateEditor
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setShowEditor(false)}
          />
        )}

        {/* Content based on active tab */}
        {user?.role === 'ngo' ? (
          <>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCertificateTypeColor(template.type)}`}>
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
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No participants found</h3>
                    <p className="text-gray-500">Participants will appear here after they join your events.</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Stats for participants */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{filteredCertificates.length}</h3>
                <p className="text-gray-600">Total Certificates</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {mockCertificates.reduce((total, cert) => total + (cert.wasteCollected || 0), 0).toFixed(1)} kg
                </h3>
                <p className="text-gray-600">Total Waste Collected</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {mockCertificates.filter(cert => cert.certificateType === 'leadership').length}
                </h3>
                <p className="text-gray-600">Leadership Awards</p>
              </div>
            </div>

            {/* Search and Filter for participants */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="participation">Participation</option>
                    <option value="achievement">Achievement</option>
                    <option value="leadership">Leadership</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Certificates Grid for participants */}
            {filteredCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map(certificate => (
                  <div key={certificate.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Certificate Header */}
                    <div className="bg-gradient-to-r from-sky-500 to-teal-500 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${getCertificateIcon(certificate.certificateType)} rounded-full flex items-center justify-center`}>
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCertificateTypeColor(certificate.certificateType)}`}>
                          {certificate.certificateType.charAt(0).toUpperCase() + certificate.certificateType.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{certificate.eventTitle}</h3>
                      <p className="text-sky-100 text-sm">Certificate of {certificate.certificateType}</p>
                    </div>

                    {/* Certificate Body */}
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span className="text-sm">Issued by {certificate.organizerName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date(certificate.dateIssued).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {certificate.wasteCollected && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              {certificate.wasteCollected} kg waste collected
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Verification Code</p>
                        <p className="text-sm font-mono font-medium text-gray-800">{certificate.verificationCode}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(certificate)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all text-sm font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                        <button
                          onClick={() => handleShare(certificate)}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No certificates found</h3>
                <p className="text-gray-500">You have not earned any certificates yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;