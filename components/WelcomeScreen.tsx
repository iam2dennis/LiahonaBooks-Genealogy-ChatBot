
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Welcome to Your Genealogy Assistant</h2>
      <p className="text-stone-600 mb-6">
        Ready to uncover your family's story? Ask a question about popular genealogy sites, and I'll provide you with a detailed explanation or a simple step-by-step guide.
      </p>
      <button
        onClick={onStart}
        className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;
