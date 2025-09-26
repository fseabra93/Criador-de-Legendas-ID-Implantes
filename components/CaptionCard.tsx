
import React, { useState } from 'react';

interface CaptionCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export const CaptionCard: React.FC<CaptionCardProps> = ({ title, content, icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-teal-600">{icon}</span>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <p className="text-gray-600 whitespace-pre-wrap text-sm">{content}</p>
    </div>
  );
};
