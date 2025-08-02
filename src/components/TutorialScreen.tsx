import React, { useEffect, useRef, useState } from 'react';

interface TutorialScreenProps {
  onBack: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

/**
 * Tutorial Screen Component
 * Features comprehensive game tutorial with modern design
 */
export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack }) => {
  const [isClient, setIsClient] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Entrance animations
    const fadeTimer = setTimeout(() => setFadeIn(true), 100);
    const slideTimer = setTimeout(() => setSlideIn(true), 200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(slideTimer);
    };
  }, [isClient]);

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Welcome to Bio Commander',
      description: 'You are a T-cell defending the microscopic realm against invading pathogens.',
      icon: '🧬',
      tips: [
        'Your mission is to protect the body from viruses and bacteria',
        'Use shape recognition to attack enemies effectively',
        'Manage your health and energy carefully'
      ]
    },
    {
      title: 'Movement & Control',
      description: 'Control your T-cell by dragging it around the screen.',
      icon: '🎮',
      tips: [
        'Drag your finger to move the T-cell',
        'Stay away from enemies to avoid damage',
        'Position yourself strategically for attacks'
      ]
    },
    {
      title: 'Shape Recognition',
      description: 'Draw shapes to perform different attacks against enemies.',
      icon: '✏️',
      tips: [
        'Draw a circle for area damage',
        'Draw a triangle for piercing attacks',
        'Draw a square for shield activation',
        'Draw a star for ultimate power'
      ]
    },
    {
      title: 'Enemy Types',
      description: 'Different enemies require different strategies.',
      icon: '🦠',
      tips: [
        'Viruses are fast but weak',
        'Bacteria are slow but tough',
        'Some enemies have special abilities',
        'Watch for enemy attack patterns'
      ]
    },
    {
      title: 'Power-ups & Resources',
      description: 'Collect power-ups to enhance your abilities.',
      icon: '⚡',
      tips: [
        'Health packs restore your health',
        'Energy orbs replenish your energy',
        'Shield power-ups provide temporary protection',
        'Use power-ups strategically'
      ]
    },
    {
      title: 'Advanced Strategies',
      description: 'Master these techniques to become an elite bio-commander.',
      icon: '🎯',
      tips: [
        'Chain attacks for combo bonuses',
        'Use the environment to your advantage',
        'Learn enemy spawn patterns',
        'Practice shape drawing for accuracy'
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🧬</div>
          <div className="text-2xl font-bold">Tutorial</div>
          <div className="text-sm text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 transition-opacity duration-600 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-indigo-900"></div>
        <div className="absolute top-1/10 left-1/20 right-1/20 bottom-1/10 bg-blue-500 bg-opacity-5 rounded-full"></div>
      </div>

      {/* Header */}
      <div className={`relative flex items-center justify-between px-5 pt-15 pb-5 bg-white bg-opacity-5 border-b border-white border-opacity-10 transition-all duration-500 ${slideIn ? 'translate-y-0' : 'translate-y-12'}`}>
        <button
          className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center transition-all duration-200 hover:bg-opacity-20"
          onClick={onBack}
        >
          <span className="text-xl text-white font-semibold">←</span>
        </button>
        <div className="text-xl font-bold text-white tracking-wide">Tutorial</div>
        <div className="px-3 py-1.5 bg-blue-500 bg-opacity-20 rounded-xl">
          <span className="text-xs font-semibold text-white">
            {currentStep + 1} / {tutorialSteps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`relative flex-1 px-5 pt-5 transition-all duration-500 ${slideIn ? 'translate-y-0' : 'translate-y-12'}`}>
        <div className="h-full overflow-y-auto">
          {/* Step Icon */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentTutorialStep.icon}</div>
          </div>

          {/* Step Title */}
          <div className="text-2xl font-black text-white text-center mb-4 tracking-wide drop-shadow-lg">
            {currentTutorialStep.title}
          </div>

          {/* Step Description */}
          <div className="text-base text-white text-opacity-80 text-center leading-6 mb-8 tracking-wide">
            {currentTutorialStep.description}
          </div>

          {/* Tips Section */}
          <div className="mb-8">
            <div className="text-lg font-bold text-yellow-400 mb-4 text-center">Key Points:</div>
            {currentTutorialStep.tips.map((tip, index) => (
              <div key={index} className="flex items-start mb-3 px-4">
                <span className="text-blue-400 mr-3 mt-0.5">•</span>
                <span className="text-sm text-white text-opacity-80 leading-5 flex-1">
                  {tip}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Demo Placeholder */}
          <div className="mb-8">
            <div className="text-base font-semibold text-white text-center mb-3">Interactive Demo</div>
            <div className="h-30 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10 flex items-center justify-center">
              <span className="text-sm text-white text-opacity-50 italic">Demo coming soon...</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between py-5 border-t border-white border-opacity-10">
          <button
            className={`px-5 py-3 rounded-xl border border-white border-opacity-20 transition-all duration-200 ${
              currentStep === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'bg-white bg-opacity-10 hover:bg-opacity-20'
            }`}
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <span className={`text-sm font-semibold ${
              currentStep === 0 ? 'text-white text-opacity-40' : 'text-white text-opacity-80'
            }`}>
              Previous
            </span>
          </button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-white bg-opacity-20'
                }`}
              />
            ))}
          </div>

          <button
            className="px-5 py-3 rounded-xl bg-blue-600 border border-blue-600 transition-all duration-200 hover:bg-blue-700"
            onClick={nextStep}
          >
            <span className="text-sm font-semibold text-white">
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};