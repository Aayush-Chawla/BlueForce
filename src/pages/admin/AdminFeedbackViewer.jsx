import React, { useEffect, useState } from 'react';
import { Shield, MessageSquare } from 'lucide-react';
import { useAuth, useEvents } from '../../contexts';
import { FeedbackViewer } from '../../features/admin/components';
import { feedbackService } from '../../services/feedbackService';

const AdminFeedbackViewer = () => {
  const { user } = useAuth();
  const { events } = useEvents();

  // Check if user is super admin
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const { items } = await feedbackService.list({ page: 0, limit: 200 });
        // Map to the structure FeedbackViewer expects
        setFeedbacks((items || []).map(f => ({
          eventId: String(f.eventId),
          rating: f.rating,
          feedback: f.content,
          createdAt: f.createdAt,
        })));
      } catch (e) {
        setError(e.message || 'Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Feedback Viewer</h1>
              <p className="text-gray-600">Analyze participant feedback and ratings</p>
            </div>
          </div>
        </div>

        {/* Feedback Viewer */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <FeedbackViewer feedbacks={feedbacks} events={events} />
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackViewer;