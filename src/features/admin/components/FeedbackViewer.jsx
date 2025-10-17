import React, { useState } from 'react';
import { Search, Filter, Star, Calendar, MessageSquare } from 'lucide-react';

const FeedbackViewer = ({ feedbacks, events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Get event details for each feedback
  const feedbacksWithDetails = feedbacks.map(feedback => {
    const event = events.find(e => e.id === feedback.eventId);
    return {
      ...feedback,
      event: event || { title: 'Unknown Event', organizer: { name: 'Unknown' } }
    };
  });

  const filteredFeedbacks = feedbacksWithDetails.filter(feedback => {
    const matchesSearch = feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === 'all' || feedback.eventId === eventFilter;
    const matchesRating = ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesEvent && matchesRating;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (filteredFeedbacks.length === 0) return 0;
    const sum = filteredFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / filteredFeedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredFeedbacks.forEach(feedback => {
      distribution[feedback.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Feedback Viewer</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredFeedbacks.length} feedback entries
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">{getAverageRating()}</p>
              <div className="flex items-center mt-1">
                {renderStars(Math.round(getAverageRating()))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-800">{filteredFeedbacks.length}</p>
              <p className="text-xs text-gray-500 mt-1">From participants</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center text-xs">
                <span className="w-3">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current mx-1" />
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${filteredFeedbacks.length > 0 ? (ratingDistribution[rating] / filteredFeedbacks.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="w-6 text-right">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback or events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-4">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {feedback.rating}/5 Rating
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{feedback.event.title}</h4>
                <p className="text-sm text-gray-600">
                  Organized by {feedback.event.organizer.name}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No Feedback Message */}
      {filteredFeedbacks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find feedback.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackViewer;


