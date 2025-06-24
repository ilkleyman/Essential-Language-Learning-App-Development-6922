import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowDown, FiAlertTriangle } = FiIcons;

const StageDowngradeMessage = ({ word, previousStage, newStage, onComplete }) => {
  const stageNames = {
    1: 'Duo Pick',
    2: 'Trio Choice',
    3: 'Quad Quest',
    4: 'Speedy Four',
    5: 'Audio Duo',
    6: 'Audio Trio',
    7: 'Audio Quad',
    8: 'Wild Card',
    9: 'Sound Clash'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ 
        duration: 0.3,
        exit: { duration: 0.5 } // Slower fade out
      }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiArrowDown} className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-orange-800">"{word.english}"</span>
              <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-sm text-orange-700">
              Moved from <span className="font-medium">Stage {previousStage}</span> to <span className="font-medium">Stage {newStage}</span>
            </div>
            <div className="text-xs text-orange-600 mt-1">
              {stageNames[previousStage]} → {stageNames[newStage]}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StageDowngradeMessage;