import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { eventService } from '../services/eventService';
import { 
  CheckCircle, 
  Trash2, 
  Scale, 
  Camera, 
  FileText, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Leaf
} from 'lucide-react';

const PostAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const eventId = searchParams.get('eventId');
  const scannedUserId = searchParams.get('userId');
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    wasteCollected: '',
    wasteType: 'mixed', // mixed, plastic, glass, metal, organic, paper, other
    notes: '',
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Verify the scanned user matches the logged-in user
    if (scannedUserId && parseInt(scannedUserId) !== user.id) {
      setError('QR code does not match your account. Please scan your own QR code.');
      return;
    }

    // Fetch event details
    if (eventId) {
      fetchEventDetails();
    } else {
      setError('Event ID is missing. Please scan the QR code again.');
    }
  }, [eventId, scannedUserId, user, navigate]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
      setError(null);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.wasteCollected || parseFloat(formData.wasteCollected) <= 0) {
      setError('Please enter a valid amount of waste collected (in kg)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Submit waste collection data
      const wasteData = {
        wasteCollected: parseFloat(formData.wasteCollected),
        wasteType: formData.wasteType,
        notes: formData.notes || undefined,
        image: formData.image || undefined
      };

      await eventService.submitWasteCollection(eventId, user.id, wasteData);
      
      // Mark attendance as completed
      try {
        await eventService.markAttendance(eventId, user.id);
      } catch (err) {
        console.warn('Could not mark attendance:', err);
        // Continue even if attendance marking fails
      }
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/events/${eventId}`, { replace: true });
        // Force a page reload to refresh participant data
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting waste collection:', err);
      setError(err.message || 'Failed to submit waste collection data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold hover:from-sky-600 hover:to-teal-600 transition-colors"
          >
            Go to Events
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-2">
            Your waste collection data has been successfully recorded.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            You collected <span className="font-semibold text-sky-600">{formData.wasteCollected} kg</span> of waste.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Redirecting to event page...
          </p>
          <Loader2 className="w-6 h-6 text-sky-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Attendance Confirmed!</h1>
              <p className="text-gray-600">Now let's record your contribution</p>
            </div>
          </div>
          
          {event && (
            <div className="bg-sky-50 rounded-lg p-4 border-l-4 border-sky-500">
              <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-6 h-6 text-teal-500" />
            <h2 className="text-xl font-bold text-gray-800">Waste Collection Details</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Waste Collected Amount */}
          <div>
            <label htmlFor="wasteCollected" className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="w-4 h-4 inline mr-2" />
              Waste Collected (kg) *
            </label>
            <input
              type="number"
              id="wasteCollected"
              name="wasteCollected"
              min="0"
              step="0.1"
              required
              value={formData.wasteCollected}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="Enter amount in kilograms"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the total weight of waste you collected during this event
            </p>
          </div>

          {/* Waste Type */}
          <div>
            <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700 mb-2">
              <Trash2 className="w-4 h-4 inline mr-2" />
              Waste Type *
            </label>
            <select
              id="wasteType"
              name="wasteType"
              required
              value={formData.wasteType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              <option value="mixed">Mixed Waste</option>
              <option value="plastic">Plastic</option>
              <option value="glass">Glass</option>
              <option value="metal">Metal</option>
              <option value="organic">Organic</option>
              <option value="paper">Paper</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
              placeholder="Share any additional details about your collection (e.g., specific items found, location, etc.)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-2" />
              Upload Photo (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              {formData.imagePreview && (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Upload a photo of the waste you collected (Max 5MB, JPG/PNG)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}`)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Leaf className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-teal-800">
              <p className="font-semibold mb-1">Why this matters:</p>
              <p className="text-teal-700">
                Your waste collection data helps us track the environmental impact of our events and contributes to your leaderboard ranking. Thank you for making a difference!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAttendance;

