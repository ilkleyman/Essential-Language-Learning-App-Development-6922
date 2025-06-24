import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAward, FiStar, FiTrophy, FiLock } = FiIcons;

const LevelSelector = ({ selectedLevel, onLevelSelect, progress }) => {
  const levels = [
    {
      id: 'bronze',
      name: 'Bronze',
      description: '20 Essential Words',
      icon: FiAward,
      color: 'bronze',
      bgColor: 'bg-gradient-to-br from-bronze-400 to-bronze-600',
      textColor: 'text-bronze-800',
      unlocked: true
    },
    {
      id: 'silver',
      name: 'Silver',
      description: '30 Words & Phrases',
      icon: FiStar,
      color: 'silver',
      bgColor: 'bg-gradient-to-br from-silver-400 to-silver-600',
      textColor: 'text-silver-800',
      unlocked: progress.bronze >= 15 // Unlock after 15 bronze words
    },
    {
      id: 'gold',
      name: 'Gold',
      description: '50 Advanced Words',
      icon: FiTrophy,
      color: 'gold',
      bgColor: 'bg-gradient-to-br from-gold-400 to-gold-600',
      textColor: 'text-gold-800',
      unlocked: progress.silver >= 25 // Unlock after 25 silver words
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Choose Your Level
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <motion.button
            key={level.id}
            onClick={() => level.unlocked && onLevelSelect(level.id)}
            disabled={!level.unlocked}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              level.unlocked
                ? selectedLevel === level.id
                  ? `border-${level.color}-500 shadow-lg transform scale-105`
                  : `border-gray-200 hover:border-${level.color}-300 hover:shadow-md`
                : 'border-gray-200 opacity-50 cursor-not-allowed'
            }`}
            whileHover={level.unlocked ? { scale: 1.02 } : {}}
            whileTap={level.unlocked ? { scale: 0.98 } : {}}
          >
            {!level.unlocked && (
              <div className="absolute top-2 right-2">
                <SafeIcon icon={FiLock} className="w-5 h-5 text-gray-400" />
              </div>
            )}
            
            <div className={`w-16 h-16 ${level.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <SafeIcon 
                icon={level.unlocked ? level.icon : FiLock} 
                className="w-8 h-8 text-white" 
              />
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${level.textColor}`}>
              {level.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {level.description}
            </p>
            
            {level.unlocked && progress[level.id] > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r from-${level.color}-400 to-${level.color}-600`}
                  style={{ width: `${(progress[level.id] / (level.id === 'bronze' ? 20 : level.id === 'silver' ? 30 : 50)) * 100}%` }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;