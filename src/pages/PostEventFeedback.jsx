import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useEvents } from '../contexts';
import { mockFeedbacks } from '../utils/mockData';
import { Star } from 'lucide-react';

const PostEventFeedback = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();
  const event = events.find(e => e.id === eventId);

  // Check if user is eligible (participant, completed event)
  const isEligible = user && user.role === 'participant' && event && event.status === 'COMPLETED';

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // In a real app, this would update backend/localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || !feedback.trim()) return;
    // Save feedback anonymously (mock)
    mockFeedbacks.push({ eventId, rating, feedback, createdAt: new Date().toISOString() });
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Event not found.</div>;
  }
  if (!isEligible) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">You are not eligible to submit feedback for this event.</div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-sky-700 mb-2">Thank you for your feedback!</h2>
          <p className="text-gray-600">Your experience will help organizers improve future events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Event Feedback</h1>
        <p className="text-gray-600 mb-6 text-center">Share your experience for <span className="font-semibold text-sky-700">{event.title}</span>. Your feedback is anonymous.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star className="w-8 h-8" fill={star <= rating ? '#facc15' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Share your experience..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold hover:from-sky-600 hover:to-teal-600 transition-all disabled:opacity-50"
            disabled={rating < 1 || !feedback.trim()}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostEventFeedback; 