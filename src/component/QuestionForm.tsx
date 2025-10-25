
import React, { useState } from 'react';
import { FormData, GenealogyWebsite, AnswerStyle } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface QuestionFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isLoading }) => {
  const [website, setWebsite] = useState<GenealogyWebsite>(GenealogyWebsite.ANCESTRY);
  const [answerStyle, setAnswerStyle] = useState<AnswerStyle>(AnswerStyle.STEP_BY_STEP);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 10) {
      setError('Please enter a more detailed question (at least 10 characters).');
      return;
    }
    setError('');
    onSubmit({ website, answerStyle, question });
  };

  const renderRadioGroup = <T extends string>(
    label: string,
    options: readonly T[],
    selectedValue: T,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => (
    <div>
      <label className="block text-sm font-bold text-stone-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="flex-auto text-center">
            <input
              type="radio"
              name={label}
              value={option}
              checked={selectedValue === option}
              onChange={() => setter(option)}
              className="sr-only peer"
              disabled={isLoading}
            />
            <div className="w-full px-4 py-2 text-sm font-semibold text-stone-600 bg-white border border-stone-300 rounded-md cursor-pointer transition-colors peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 hover:border-emerald-500">
              {option}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderRadioGroup<GenealogyWebsite>('1. Select a Website', Object.values(GenealogyWebsite), website, setWebsite)}
        {renderRadioGroup<AnswerStyle>('2. Choose an Answer Style', Object.values(AnswerStyle), answerStyle, setAnswerStyle)}
        <div>
          <label htmlFor="question" className="block text-sm font-bold text-stone-700 mb-2">3. What is your question?</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How do I find birth records for an ancestor in the 1800s?"
            className="w-full h-32 p-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
            disabled={isLoading}
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300 disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <SpinnerIcon />
              <span className="ml-2">Getting Answer...</span>
            </>
          ) : (
            'Ask My Question'
          )}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;