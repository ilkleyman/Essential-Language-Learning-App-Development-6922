import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiVolume2, FiClock, FiHeart } = FiIcons;

const QuizCard = ({ 
  question, 
  options, 
  correctAnswer, 
  correctAnswerIndex,
  stage,
  stageName,
  onAnswer, 
  timeLimit,
  audioMode = false,
  onPlayAudio,
  audioOptions = []
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioTimeoutRef = useRef(null);

  useEffect(() => {
    if (timeLimit && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLimit && timeLeft === 0 && !showResult) {
      handleAnswer(null);
    }
  }, [timeLeft, timeLimit, showResult]);

  // Auto-play audio sequence when component mounts in audio mode
  useEffect(() => {
    if (audioMode && audioOptions.length > 0) {
      playAudioSequence();
    }
    
    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, [audioMode, audioOptions]);

  const stopAudio = () => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
    setAudioPlaying(false);
    
    // Stop speech synthesis if it's speaking
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const playAudioSequence = async () => {
    if (!audioOptions.length || !onPlayAudio) return;
    
    setAudioPlaying(true);
    
    for (let i = 0; i < audioOptions.length; i++) {
      // Check if audio was stopped
      if (!audioTimeoutRef.current && i > 0) {
        break;
      }
      
      // Play the audio
      onPlayAudio(audioOptions[i]);
      
      // Wait for speech + pause (2 seconds for word + 1 second pause)
      await new Promise(resolve => {
        audioTimeoutRef.current = setTimeout(resolve, 3000);
      });
    }
    
    setAudioPlaying(false);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    // Stop audio immediately when answer is clicked
    stopAudio();
    
    const responseTime = (Date.now() - startTime) / 1000; // Time in seconds
    const isCorrect = answer === correctAnswer;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    // Play sound immediately
    if (onPlayAudio) {
      // Use a simple beep sound for immediate feedback
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = isCorrect ? 800 : 300; // Higher pitch for correct, lower for incorrect
      oscillator.type = isCorrect ? 'sine' : 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    setTimeout(() => {
      onAnswer(isCorrect, responseTime);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(timeLimit);
    }, 1500);
  };

  const getButtonColor = (option, index) => {
    if (!showResult) {
      return 'bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400';
    }
    
    if (audioMode) {
      // In audio mode, check if this is the correct option index
      if (index === correctAnswerIndex) {
        return 'bg-green-100 border-green-500 text-green-800';
      }
      if (selectedAnswer === option && index !== correctAnswerIndex) {
        return 'bg-red-100 border-red-500 text-red-800';
      }
    } else {
      // Regular mode
      if (option === correctAnswer) {
        return 'bg-green-100 border-green-500 text-green-800';
      }
      if (option === selectedAnswer && option !== correctAnswer) {
        return 'bg-red-100 border-red-500 text-red-800';
      }
    }
    
    return 'bg-gray-100 border-gray-300 text-gray-600';
  };

  const stageColors = {
    1: 'from-blue-400 to-blue-600',
    2: 'from-green-400 to-green-600',
    3: 'from-purple-400 to-purple-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-pink-400 to-pink-600',
    6: 'from-indigo-400 to-indigo-600',
    7: 'from-red-400 to-red-600',
    8: 'from-gold-400 to-gold-600',
    9: 'from-emerald-400 to-emerald-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
    >
      {/* Stage indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${stageColors[stage]} text-white font-semibold`}>
          <div className="text-center">
            <div className="text-sm">Stage {stage}</div>
            <div className="text-xs opacity-90">{stageName}</div>
          </div>
        </div>
        
        {timeLimit && (
          <div className="flex items-center space-x-2 text-orange-600">
            <SafeIcon icon={FiClock} className="w-5 h-5" />
            <span className="font-bold text-lg">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {question}
        </h2>
        
        {audioMode && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 font-medium mb-2">
                {stage <= 7 ? 
                  'Listen to the audio options and select the correct translation:' :
                  stage === 8 ?
                  'Listen carefully - the options include random words mixed with the correct answer:' :
                  'Listen closely - the options sound similar to each other:'
                }
              </p>
              {audioPlaying && (
                <div className="text-blue-600 text-sm">
                  🔊 Playing audio sequence... (Click any answer to stop)
                </div>
              )}
            </div>
            
            <button
              onClick={playAudioSequence}
              disabled={audioPlaying}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors mx-auto ${
                audioPlaying 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
              }`}
            >
              <SafeIcon icon={FiVolume2} className="w-5 h-5" />
              <span className="font-medium">
                {audioPlaying ? 'Playing...' : 'Play Audio Again'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Stage-specific instructions */}
      {stage === 9 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Sound Clash Challenge:</strong> The audio options sound very similar to each other. 
                Listen carefully to distinguish between the subtle differences!
              </p>
            </div>
          </div>
        </div>
      )}

      {stage === 8 && audioMode && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                <strong>Wild Card Challenge:</strong> The correct answer is mixed with random words 
                from the language. Stay focused!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !showResult && handleAnswer(option)}
            disabled={showResult}
            className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium text-lg ${getButtonColor(option, index)}`}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
          >
            {audioMode ? `Option ${index + 1}` : option}
          </motion.button>
        ))}
      </div>

      {/* Timer bar */}
      {timeLimit && (
        <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default QuizCard;