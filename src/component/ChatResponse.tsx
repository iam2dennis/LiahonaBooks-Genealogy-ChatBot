import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CopyIcon from './icons/CopyIcon';
import PrintIcon from './icons/PrintIcon';

interface ChatResponseProps {
  response: string;
  onReset: () => void;
}

const ChatResponse: React.FC<ChatResponseProps> = ({ response, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg animate-fade-in print:shadow-none print:border-none">
      <div id="printable-area" className="p-8">
        <h2 className="text-2xl font-bold text-stone-700 mb-4 print:text-black">Here's your answer:</h2>
        <div 
          className="prose prose-stone max-w-none text-stone-800"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
        </div>
      </div>
      <div className="bg-stone-50 p-4 flex flex-wrap gap-4 justify-end rounded-b-xl print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-stone-200 text-stone-700 font-semibold py-2 px-4 rounded-lg hover:bg-stone-300 transition-colors"
        >
          <CopyIcon />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-stone-200 text-stone-700 font-semibold py-2 px-4 rounded-lg hover:bg-stone-300 transition-colors"
        >
          <PrintIcon />
          Print
        </button>
        <button
          onClick={onReset}
          className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Ask Another Question
        </button>
      </div>
    </div>
  );
};

export default ChatResponse;