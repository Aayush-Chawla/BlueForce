import React from 'react';

const SocialMediaGenerator = ({ template }) => {
  const text = `Proud to receive ${template?.name || 'a certificate'}!`;
  const share = (platform) => {
    console.log(`Share to ${platform}:`, text);
    alert(`Pretend sharing to ${platform}:\n\n${text}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => share('Twitter')}
        className="px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-600 text-sm"
      >
        Share Twitter
      </button>
      <button
        onClick={() => share('LinkedIn')}
        className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
      >
        Share LinkedIn
      </button>
    </div>
  );
};

export default SocialMediaGenerator;
