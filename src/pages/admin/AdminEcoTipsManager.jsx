import React, { useState } from 'react';
import { Shield, Lightbulb, Plus, Edit, Trash2, Search, Filter, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ecoTips } from '../../utils/ecoTipsData';

const AdminEcoTipsManager = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState(ecoTips);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTip, setEditingTip] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'waste-reduction',
    difficulty: 'easy',
    impact: 'medium'
  });

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

  const filteredTips = tips.filter(tip => 
    tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(tip => 
    categoryFilter === 'all' || tip.category === categoryFilter
  );

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'waste-reduction', label: 'Waste Reduction' },
    { value: 'ocean-protection', label: 'Ocean Protection' },
    { value: 'sustainable-living', label: 'Sustainable Living' },
    { value: 'recycling', label: 'Recycling' },
    { value: 'energy-saving', label: 'Energy Saving' }
  ];

  const handleEdit = (tip) => {
    setEditingTip(tip.id);
    setFormData({
      title: tip.title,
      content: tip.content,
      category: tip.category,
      difficulty: tip.difficulty,
      impact: tip.impact
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      content: '',
      category: 'waste-reduction',
      difficulty: 'easy',
      impact: 'medium'
    });
  };

  const handleSave = () => {
    if (isCreating) {
      const newTip = {
        id: (tips.length + 1).toString(),
        ...formData,
        icon: 'Lightbulb'
      };
      setTips([...tips, newTip]);
      setIsCreating(false);
    } else {
      setTips(tips.map(tip => 
        tip.id === editingTip 
          ? { ...tip, ...formData }
          : tip
      ));
      setEditingTip(null);
    }
    setFormData({
      title: '',
      content: '',
      category: 'waste-reduction',
      difficulty: 'easy',
      impact: 'medium'
    });
  };

  const handleCancel = () => {
    setEditingTip(null);
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      category: 'waste-reduction',
      difficulty: 'easy',
      impact: 'medium'
    });
  };

  const handleDelete = (tipId) => {
    if (confirm('Are you sure you want to delete this eco tip?')) {
      setTips(tips.filter(tip => tip.id !== tipId));
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Eco Tips Manager</h1>
                <p className="text-gray-600">Add, edit, and manage eco tips for all users</p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Tip</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search eco tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
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

        {/* Create/Edit Form */}
        {(isCreating || editingTip) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {isCreating ? 'Create New Eco Tip' : 'Edit Eco Tip'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter tip title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact
                </label>
                <select
                  value={formData.impact}
                  onChange={(e) => setFormData({...formData, impact: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter tip content"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.content}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map(tip => (
            <div key={tip.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tip)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tip.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">{tip.content}</p>

              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(tip.impact)}`}>
                  {tip.impact.charAt(0).toUpperCase() + tip.impact.slice(1)} Impact
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                  {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* No Tips Message */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No eco tips found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find tips.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEcoTipsManager;