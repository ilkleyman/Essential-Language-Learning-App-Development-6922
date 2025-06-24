import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiAward, FiStar } = FiIcons;

const HighScores = ({ scores, onClose }) => {
  const getTrophyIcon = (index) => {
    switch (index) {
      case 0: return FiTrophy;
      case 1: return FiAward;
      case 2: return FiStar;
      default: return null;
    }
  };

  const getTrophyColor = (index) => {
    switch (index) {
      case 0: return 'text-gold-500';
      case 1: return 'text-silver-500';
      case 2: return 'text-bronze-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiTrophy} className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">High Scores</h2>
        </div>

        <div className="space-y-3">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No scores yet! Start playing to see your achievements.
            </div>
          ) : (
            scores.map((score, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  index < 3 ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {index < 3 ? (
                      <SafeIcon 
                        icon={getTrophyIcon(index)} 
                        className={`w-6 h-6 ${getTrophyColor(index)}`} 
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold">#{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{score.name}</div>
                    <div className="text-sm text-gray-600">
                      {score.language} • {score.level}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-800">{score.score}</div>
                  <div className="text-xs text-gray-500">
                    {score.accuracy}% accuracy
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(score.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HighScores;