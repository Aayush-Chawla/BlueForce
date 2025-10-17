import React from 'react';
import { mockImpactStories } from '../utils/mockData';
import StoryCard from '../components/common/StoryCard';
import { Sparkles } from 'lucide-react';

const ImpactStoryboard = () => {
  // Sort stories by date, newest first
  const stories = [...mockImpactStories].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-sky-500" />
            Public Impact Storyboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore real stories and images from our community cleanups, powered by volunteers and AI. Share your impact with the world!
          </p>
        </div>
        <div className="flex flex-col items-center">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactStoryboard; 