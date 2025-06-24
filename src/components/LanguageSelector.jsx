import React from 'react';
import { motion } from 'framer-motion';
import { languages } from '../data/languages';

const LanguageSelector = ({ selectedLanguage, onLanguageSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Choose Your Language
      </h2>
      
      <div className="space-y-4">
        {Object.entries(languages).map(([key, language]) => (
          <motion.button
            key={key}
            onClick={() => onLanguageSelect(key)}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
              selectedLanguage === key
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-4xl">{language.flag}</span>
              <span className="text-xl font-semibold text-gray-800">
                {language.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;