import React from 'react';
import { Sparkles, User } from 'lucide-react';

const StoryCard = ({ story }) => {
  const fallbackAvatar = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
  const fallbackImage = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 max-w-xl mx-auto border border-sky-100">
      <div className="relative">
        <img
          src={story.image || fallbackImage}
          alt="Impact story visual"
          className="w-full h-64 object-cover"
          onError={e => { if (e.target.src !== fallbackImage) { e.target.onerror = null; e.target.src = fallbackImage; } }}
        />
        {story.aiGenerated && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow">
            <Sparkles className="w-4 h-4" /> AI Story
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={story.user.avatar || fallbackAvatar}
            alt={story.user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-sky-200"
            onError={e => { if (e.target.src !== fallbackAvatar) { e.target.onerror = null; e.target.src = fallbackAvatar; } }}
          />
          <div className="ml-3">
            <div className="font-bold text-gray-800 flex items-center gap-1">
              {story.user.name}
              {story.aiGenerated && <Sparkles className="w-4 h-4 text-sky-400" />}
            </div>
            <div className="text-xs text-gray-500">{story.user.location}</div>
          </div>
        </div>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">{story.text}</p>
        <div className="text-right text-xs text-gray-400">
          {new Date(story.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>
    </div>
  );
};

export default StoryCard; 