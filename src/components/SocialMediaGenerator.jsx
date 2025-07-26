import React, { useState } from 'react';
import { X, Download, Copy, Share2, Instagram, Facebook, Twitter, Wand2, Image as ImageIcon } from 'lucide-react';

const SocialMediaGenerator = ({ events, onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id || '');
  const [platform, setPlatform] = useState('instagram');
  const [postType, setPostType] = useState('announcement');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const event = events.find(e => e.id === selectedEvent);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-sky-400 to-sky-500' }
  ];

  const postTypes = [
    { id: 'announcement', name: 'Event Announcement', description: 'Promote upcoming events' },
    { id: 'reminder', name: 'Event Reminder', description: 'Remind people about upcoming events' },
    { id: 'recap', name: 'Event Recap', description: 'Share results and photos from completed events' },
    { id: 'impact', name: 'Impact Story', description: 'Highlight environmental impact' }
  ];

  const generateContent = async () => {
    if (!event) return;
    
    setIsGenerating(true);
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const templates = {
      announcement: {
        instagram: `🌊 Join us for "${event.title}"! 🌊

📅 ${new Date(event.date).toLocaleDateString()}
📍 ${event.location}
👥 ${event.maxParticipants} volunteers needed

Help us make a difference! Every piece of trash removed is a step towards cleaner oceans. 🐢💙

#BeachCleanup #OceanConservation #EnvironmentalAction #CleanBeaches #MarineLife #Sustainability #VolunteerWork #CommunityAction`,
        
        facebook: `🌊 BEACH CLEANUP EVENT ALERT! 🌊

We're organizing "${event.title}" and we need YOUR help!

When: ${new Date(event.date).toLocaleDateString()} at ${event.time}
Where: ${event.location}
What to bring: ${event.requiredItems?.join(', ') || 'Gloves, water bottle, sun protection'}

Together, we can remove harmful waste from our beautiful coastlines and protect marine wildlife. Every volunteer makes a difference!

Register now and be part of the solution. Let's create cleaner, healthier beaches for future generations.

#BeachCleanup #EnvironmentalVolunteering #OceanProtection`,
        
        twitter: `🌊 Beach Cleanup Alert! 

Join "${event.title}" on ${new Date(event.date).toLocaleDateString()} at ${event.location}

${event.maxParticipants} volunteers needed to help protect our oceans! 🐢

#BeachCleanup #OceanConservation #VolunteerOpportunity`
      },
      
      reminder: {
        instagram: `⏰ REMINDER: "${event.title}" is tomorrow! ⏰

Don't forget:
✅ Bring ${event.requiredItems?.slice(0, 3).join(', ') || 'gloves and water'}
✅ Meet us at ${event.location}
✅ Arrive by ${event.time}

We're so excited to see you there! Together we'll make our beaches cleaner and safer for marine life. 🌊🐢

#BeachCleanup #Tomorrow #DontForget #OceanConservation`,
        
        facebook: `🚨 TOMORROW'S THE DAY! 🚨

"${event.title}" is happening tomorrow and we can't wait to see you there!

Final reminders:
• Time: ${event.time}
• Location: ${event.location}
• What to bring: ${event.requiredItems?.join(', ') || 'Gloves, water bottle, sun protection'}

Weather looks great for a beach cleanup! See you bright and early. 🌞

#BeachCleanup #Tomorrow #FinalReminder`,
        
        twitter: `⏰ TOMORROW: "${event.title}"

📍 ${event.location}
🕐 ${event.time}

Bring gloves & water! Let's clean our beaches! 🌊

#BeachCleanup #Tomorrow`
      },
      
      recap: {
        instagram: `🎉 AMAZING RESULTS from "${event.title}"! 🎉

✨ ${event.participants?.length || 0} incredible volunteers
✨ ${event.actualWaste || event.estimatedWaste || 0}kg of waste removed
✨ Countless marine animals protected

Thank you to everyone who joined us! Your dedication to ocean conservation is inspiring. Together, we're making real change happen! 🌊💙

Swipe to see the incredible before/after photos! ➡️

#BeachCleanupSuccess #OceanHeroes #EnvironmentalImpact #ThankYou`,
        
        facebook: `🌊 INCREDIBLE SUCCESS! 🌊

"${event.title}" was absolutely amazing! Here's what we accomplished together:

🎯 ${event.participants?.length || 0} dedicated volunteers showed up
🎯 ${event.actualWaste || event.estimatedWaste || 0}kg of harmful waste removed from our beaches
🎯 Countless pieces of plastic prevented from entering our ocean

The energy and commitment from our volunteers was incredible. Seeing families, students, and community members working together for our environment gives us so much hope!

Thank you to every single person who participated. You are true ocean heroes! 🦸‍♀️🦸‍♂️

#BeachCleanupSuccess #CommunityPower #OceanConservation`,
        
        twitter: `🎉 SUCCESS! "${event.title}" results:

👥 ${event.participants?.length || 0} volunteers
🗑️ ${event.actualWaste || event.estimatedWaste || 0}kg waste removed
🌊 Cleaner beaches achieved!

Thank you ocean heroes! 💙

#BeachCleanupSuccess #OceanHeroes`
      },
      
      impact: {
        instagram: `🌍 THE IMPACT WE'RE MAKING TOGETHER 🌍

This year alone, our beach cleanups have:
🌊 Removed over 500kg of waste from our coastlines
🐢 Protected countless marine animals from plastic pollution
🌱 Engaged 200+ community volunteers in environmental action
💚 Raised awareness about ocean conservation

Every cleanup matters. Every volunteer counts. Every piece of trash removed saves a life in our ocean.

Ready to join our next cleanup? Link in bio! 🔗

#OceanImpact #EnvironmentalChange #BeachCleanup #MarineConservation #CommunityAction`,
        
        facebook: `🌊 REFLECTING ON OUR ENVIRONMENTAL IMPACT 🌊

As we look back on our beach cleanup initiatives, we're amazed by what we've accomplished together:

📊 Our Impact This Year:
• 500+ kg of waste removed from beaches
• 200+ volunteers engaged in ocean conservation
• 15+ beach cleanup events organized
• Countless marine animals protected from plastic pollution

But the numbers only tell part of the story. The real impact is in the changed mindsets, the increased awareness, and the growing community of people who care about our oceans.

Every time someone chooses to refuse single-use plastic, every time a child learns about marine conservation, every time a volunteer picks up that extra piece of trash - that's when real change happens.

Thank you for being part of this movement. Together, we're creating a cleaner, healthier future for our oceans! 🌊💙

#EnvironmentalImpact #OceanConservation #CommunityChange`,
        
        twitter: `🌍 Our 2024 Impact:

✅ 500kg+ waste removed
✅ 200+ volunteers engaged  
✅ 15+ cleanups organized
✅ Countless marine lives protected

Together we're making waves! 🌊

#OceanImpact #EnvironmentalChange`
      }
    };
    
    const content = templates[postType]?.[platform] || 'Content generated successfully!';
    setGeneratedContent(content);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  const downloadAsImage = () => {
    // In a real app, this would generate an image with the content
    alert('Image download feature would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Configuration */}
          <div className="w-1/2 flex flex-col border-r">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Share2 className="w-6 h-6 mr-2 text-purple-500" />
                Social Media Generator
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Configuration */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Event Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Platform
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {platforms.map(({ id, name, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setPlatform(id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        platform === id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className={`p-2 rounded-full bg-gradient-to-r ${color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Post Type
                </label>
                <div className="space-y-2">
                  {postTypes.map(({ id, name, description }) => (
                    <button
                      key={id}
                      onClick={() => setPostType(id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        postType === id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{name}</div>
                      <div className="text-sm text-gray-600">{description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating || !event}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <Wand2 className="w-5 h-5" />
                <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                      {generatedContent}
                    </pre>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    
                    <button
                      onClick={downloadAsImage}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">No content generated yet</p>
                  <p className="text-sm">Configure your settings and click "Generate Content"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaGenerator;