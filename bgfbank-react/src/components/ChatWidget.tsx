import React from 'react';

const ChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-all relative">
        <i className="fas fa-comment-dots text-xl"></i>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          1
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;
