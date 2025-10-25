import React, { useState, useCallback } from 'react';
import { AppStep, FormData } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionForm from './components/QuestionForm';
import ChatResponse from './components/ChatResponse';
import { getGenealogyAnswer } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const isLoading = step === 'loading';

  const handleSubmit = useCallback(async (data: FormData) => {
    setStep('loading');
    setError('');
    setResponse('');
    try {
      let isFirstChunk = true;
      await getGenealogyAnswer(data.website, data.answerStyle, data.question, (chunk: string) => {
        if (isFirstChunk) {
          setStep('response');
          isFirstChunk = false;
        }
        setResponse(prev => prev + chunk);
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      setResponse(`Sorry, I couldn't get an answer. Error: ${errorMessage}`);
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
      <div className="w-full max-w-4xl mx-auto text-center mb-8 print:hidden">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">Genealogy AI Assistant</h1>
        <p className="text-stone-600 mt-2 text-lg">Your personal guide to family history research.</p>
      </div>
      <main className="w-full max-w-2xl transition-all duration-300">
        {renderContent()}
      </main>
      <footer className="mt-8 text-center text-stone-500 text-sm print:hidden">
        <p>Powered by AI. Please verify important information.</p>
      </footer>
    </div>
  );
};

export default App;
