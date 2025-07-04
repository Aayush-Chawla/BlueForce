import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Leaf } from 'lucide-react';
import { EcoTip } from '../types';

interface EcoTipCardProps {
  tip: EcoTip;
  isDaily?: boolean;
}

const EcoTipCard: React.FC<EcoTipCardProps> = ({ tip, isDaily = false }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isDaily ? 'border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50' : ''}`}>
      {isDaily && (
        <div className="flex items-center mb-4">
          <div className="p-2 bg-green-500 rounded-full mr-3">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-green-700 font-semibold text-sm">Daily Eco Tip</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full mr-3">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
        </div>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">{tip.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(tip.impact)}`}>
            {tip.impact.charAt(0).toUpperCase() + tip.impact.slice(1)} Impact
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
            {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
          </span>
        </div>

        {isDaily && (
          <Link
            to="/eco-tips"
            className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            More Tips
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default EcoTipCard;