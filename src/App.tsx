import React, { useState, useCallback } from 'react';
import { AppStep, FormData } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionForm from './components/QuestionForm';
import ChatResponse from './components/ChatResponse';
import { streamGenealogyAnswer } from './services/geminiService';

/**
 * Removes Markdown code fences (```html ... ```) from a string.
 * The AI often wraps its HTML output in these, which prevents rendering.
 * @param rawResponse The raw string from the API.
 * @returns The cleaned HTML string.
 */
const cleanApiResponse = (rawResponse: string): string => {
  // Matches ```html at the start and ``` at the end, with optional newlines.
  const regex = /^```html\s*([\s\S]*?)\s*```$/;
  const match = rawResponse.match(regex);
  // If it matches, return the captured group (the actual HTML). Otherwise, return the original string.
  return match ? match[1].trim() : rawResponse.trim();
};


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const isLoading = step === 'loading';

  const handleSubmit = useCallback(async (data: FormData) => {
    setStep('loading');
    setError('');
    
    // Switch to response view immediately for streaming
    setStep('response');
    setResponse(''); // Clear previous response

    try {
      const stream = await streamGenealogyAnswer(data.website, data.answerStyle, data.question);
      let accumulatedResponse = '';
      for await (const chunk of stream) {
        accumulatedResponse += chunk;
        setResponse(accumulatedResponse);
      }
      // Clean the final response once streaming is complete
      setResponse(prev => cleanApiResponse(prev));

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      // Provide a user-friendly error message in a simple paragraph format
      const errorResponse = `<p>Sorry, I couldn't get an answer. The following error occurred:</p><p><em>${errorMessage}</em></p><p>Please try again. If the problem persists, the service may be temporarily unavailable.</p>`;
      setResponse(errorResponse);
      setStep('response'); 
    }
  }, []);

  const handleReset = () => {
    setStep('form');
    setResponse('');
    setError('');
  };

  const renderContent = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setStep('form')} />;
      case 'form':
      case 'loading':
        return <QuestionForm onSubmit={handleSubmit} isLoading={isLoading} />;
      case 'response':
        return <ChatResponse response={response} onReset={handleReset} />;
      default:
        return <WelcomeScreen onStart={() => setStep('form')} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans flex flex-col items-center justify-center p-4">
      <div id="page-header" className="w-full max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-5xl md:text-6xl font-bold text-black tracking-wider mb-2">LiahonaBooks</h2>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">Genealogy AI Assistant</h1>
        <p className="text-stone-600 mt-2 text-lg">Your personal guide to family history research.</p>
        <a href="http://www.liahonabooks.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 transition-colors mt-2 text-lg inline-block">
          www.liahonabooks.com
        </a>
      </div>
      <main className="w-full max-w-2xl transition-all duration-300">
        {renderContent()}
      </main>
      <footer className="mt-8 text-center text-stone-500 text-sm">
        <p>Powered by AI. Please verify important information.</p>
      </footer>
    </div>
  );
};

export default App;
