import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useEvents } from '../contexts';
import { feedbackService } from '../services/feedbackService';
import { mlService } from '../services/mlService';
import { Star, Upload, Image as ImageIcon, BarChart3, Loader2, X } from 'lucide-react';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mlResults, setMlResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mlError, setMlError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setMlError(null);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setMlError(null);
    try {
      const results = await mlService.analyzeImage(selectedImage);
      setMlResults(results);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setMlError(err.message || 'Failed to analyze image. Please make sure the ML service is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setMlResults(null);
    setMlError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || !feedback.trim()) return;
    try {
      console.log('Submitting feedback:', { eventId, rating, feedback });
      const result = await feedbackService.submit({ eventId, rating, feedback });
      console.log('Feedback submitted successfully:', result);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      console.error('Error details:', err.message, err.status, err.response);
      alert(err.message || 'Failed to submit feedback. Please check your connection and try again.');
    }
  };

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Event not found.</div>;
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Event Feedback</h1>
          <p className="text-gray-600 mb-6 text-center">Share your experience for <span className="font-semibold text-sky-700">{event.title}</span>. Your feedback is anonymous.</p>
          
          {/* ML Analysis Section - Always visible */}
          <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-sky-50 rounded-lg border-2 border-teal-300 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <ImageIcon className="w-7 h-7 text-teal-600" />
              Waste Detection Analysis
            </h2>
            <p className="text-sm text-gray-600 mb-4">Upload a photo from the event to analyze plastic waste detection and density using our ML model.</p>
            
            {!selectedImage ? (
              <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-12 h-12 text-teal-500" />
                  <span className="text-gray-700 font-medium">Click to upload or drag and drop</span>
                  <span className="text-sm text-gray-500">PNG, JPG, JPEG up to 16MB</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleImageAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            )}

            {mlError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {mlError}
              </div>
            )}

            {/* ML Results Display */}
            {mlResults && (
              <div className="mt-6 space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                    Analysis Results
                  </h3>
                  
                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-teal-700">{mlResults.plastic_percentage}%</div>
                      <div className="text-sm text-gray-600">Plastic Coverage</div>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-sky-700">{mlResults.num_objects}</div>
                      <div className="text-sm text-gray-600">Objects Detected</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{mlResults.num_clusters}</div>
                      <div className="text-sm text-gray-600">Waste Clusters</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-700">{mlResults.avg_cluster_size}</div>
                      <div className="text-sm text-gray-600">Avg Cluster Size</div>
                    </div>
                  </div>

                  {/* Result Images */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mlResults.result_image && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Detection Result</h4>
                        <img
                          src={mlService.getImageUrl(mlResults.result_image)}
                          alt="Detection result"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    {mlResults.heatmap_image && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Heatmap</h4>
                        <img
                          src={mlService.getImageUrl(mlResults.heatmap_image)}
                          alt="Heatmap"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    {mlResults.density_image && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Density Map</h4>
                        <img
                          src={mlService.getImageUrl(mlResults.density_image)}
                          alt="Density map"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          {isEligible ? (
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
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 font-medium">You are not eligible to submit feedback for this event.</p>
              <p className="text-yellow-700 text-sm mt-2">Only participants who have completed this event can submit feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEventFeedback; 