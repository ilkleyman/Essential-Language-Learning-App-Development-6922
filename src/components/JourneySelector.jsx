import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiStar, FiTrophy, FiArrowRight, FiTarget } = FiIcons;

const JourneySelector = ({ language, onContinue, progress, currentLevel }) => {
  const levelInfo = {
    bronze: {
      name: 'Bronze',
      icon: FiAward,
      color: 'bronze',
      bgColor: 'bg-gradient-to-br from-bronze-400 to-bronze-600',
      textColor: 'text-bronze-800',
      total: 20
    },
    silver: {
      name: 'Silver', 
      icon: FiStar,
      color: 'silver',
      bgColor: 'bg-gradient-to-br from-silver-400 to-silver-600',
      textColor: 'text-silver-800',
      total: 30
    },
    gold: {
      name: 'Gold',
      icon: FiTrophy,
      color: 'gold', 
      bgColor: 'bg-gradient-to-br from-gold-400 to-gold-600',
      textColor: 'text-gold-800',
      total: 50
    }
  };

  const current = levelInfo[currentLevel];
  const mastered = progress[currentLevel] || 0;
  const remaining = current.total - mastered;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">{language.flag}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {language.name} Journey
        </h2>
        <p className="text-gray-600">Continue your learning adventure</p>
      </div>

      {/* Current Level Status */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 ${current.bgColor} rounded-full flex items-center justify-center`}>
            <SafeIcon icon={current.icon} className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className={`text-xl font-bold text-center mb-2 ${current.textColor}`}>
          Currently on {current.name}
        </h3>
        
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-800">
            {mastered} / {current.total}
          </div>
          <div className="text-sm text-gray-600">Words Mastered</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r from-${current.color}-400 to-${current.color}-600 transition-all duration-500`}
            style={{ width: `${(mastered / current.total) * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{mastered} completed</span>
          <span>{remaining} remaining</span>
        </div>
      </div>

      {/* Journey Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <SafeIcon icon={FiTarget} className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-800">{progress.bronze || 0}</div>
          <div className="text-xs text-blue-600">Bronze Words</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <SafeIcon icon={FiStar} className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-800">{(progress.silver || 0) + (progress.gold || 0)}</div>
          <div className="text-xs text-purple-600">Advanced Words</div>
        </div>
      </div>

      {/* Continue Button */}
      <motion.button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Continue Journey</span>
        <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default JourneySelector;