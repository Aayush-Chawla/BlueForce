import React, { useState } from 'react';
import { Search, Filter, Award, HelpCircle, Brain, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import { ecoTips, faqs, mcqQuestions } from '../utils/ecoTipsData';
import EcoTipCard from '../components/EcoTipCard';
import { useAuth } from '../contexts/AuthContext';

const EcoTips = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tips');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const filteredTips = ecoTips.filter(tip => 
    tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(tip => 
    categoryFilter === 'all' || tip.category === categoryFilter
  );

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(faq =>
    categoryFilter === 'all' || faq.category.toLowerCase().replace(' ', '-') === categoryFilter
  );

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'waste-reduction', label: 'Waste Reduction' },
    { value: 'ocean-protection', label: 'Ocean Protection' },
    { value: 'sustainable-living', label: 'Sustainable Living' },
    { value: 'recycling', label: 'Recycling' },
    { value: 'energy-saving', label: 'Energy Saving' }
  ];

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    mcqQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score += question.points;
      }
    });
    setQuizScore(score);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizScore(0);
  };

  const tabs = [
    { id: 'tips', label: 'Eco Tips', icon: Leaf },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'quiz', label: 'Eco Quiz', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Eco Knowledge Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover eco-friendly tips, get answers to environmental questions, and test your knowledge with our interactive quiz
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        {(activeTab === 'tips' || activeTab === 'faq') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'tips' ? 'tips' : 'questions'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTips.map(tip => (
              <EcoTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <span className="text-sm text-sky-600 font-medium">{faq.category}</span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto">
            {!showResults ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Eco Knowledge Quiz</h2>
                  <span className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {mcqQuestions.length}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / mcqQuestions.length) * 100}%` }}
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {mcqQuestions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {mcqQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentQuestion === mcqQuestions.length - 1 ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length !== mcqQuestions.length}
                      className="px-6 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                      className="px-6 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
                <p className="text-xl text-gray-600 mb-6">
                  Your Score: <span className="font-bold text-sky-600">{quizScore}</span> / {mcqQuestions.reduce((total, q) => total + q.points, 0)} points
                </p>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-lg hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 mt-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoTips; 