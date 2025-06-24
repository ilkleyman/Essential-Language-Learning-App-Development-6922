import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiTrophy, FiTarget } = FiIcons;

const MasteryScreen = ({ word, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.3, 
            type: 'spring', 
            stiffness: 200,
            damping: 10
          }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto">
            <SafeIcon icon={FiTrophy} className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating stars */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, -40, -60],
                x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30]
              }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            >
              <SafeIcon icon={FiStar} className="w-4 h-4 text-gold-400" />
            </motion.div>
          ))}
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Word Mastered! 🎉
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6"
        >
          <div className="text-2xl font-bold text-purple-800 mb-2">
            {word.english}
          </div>
          <div className="text-xl text-purple-600 mb-1">
            {word.translation}
          </div>
          <div className="text-sm text-purple-500">
            /{word.pronunciation}/
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8"
        >
          Congratulations! You've successfully mastered this word. 
          It will now appear less frequently but will return for review 
          to ensure long-term retention.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          Continue Learning
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default MasteryScreen;