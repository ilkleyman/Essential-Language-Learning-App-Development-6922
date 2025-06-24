import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import StageDistributionChart from './StageDistributionChart';

const { FiTrendingUp, FiAward, FiTarget, FiStar, FiZap, FiCompass } = FiIcons;

const RoundSummary = ({ stats, onContinue, onMainMenu }) => {
  const summaryTexts = [
    { title: "Fantastic Progress!", subtitle: "Your language skills are really taking off!" },
    { title: "Impressive Learning!", subtitle: "You're building a strong foundation!" },
    { title: "Outstanding Effort!", subtitle: "Every word learned is a step closer to fluency!" },
    { title: "Remarkable Achievement!", subtitle: "Your dedication is truly paying off!" },
    { title: "Excellent Session!", subtitle: "You're making wonderful progress!" }
  ];

  const randomSummary = summaryTexts[Math.floor(Math.random() * summaryTexts.length)];

  const getPerformanceColor = (score) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 600) return 'text-blue-600';
    if (score >= 400) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (score) => {
    if (score >= 800) return 'Exceptional!';
    if (score >= 600) return 'Great job!';
    if (score >= 400) return 'Good effort!';
    return 'Keep practicing!';
  };

  // Fix the timing calculations
  const displayAvgTime = Math.max(0.1, stats.avgResponseTime || 0);
  const displayTotalTime = Math.max(1, stats.totalTime || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <SafeIcon icon={FiAward} className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {randomSummary.title}
        </h2>
        <p className="text-lg text-gray-600">
          {randomSummary.subtitle}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Stats Section */}
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <SafeIcon icon={FiTarget} className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">{stats.newWords}</div>
              <div className="text-xs text-gray-600">New Words</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">{stats.partiallyMastered}</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <SafeIcon icon={FiStar} className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-800">{stats.fullyMastered}</div>
              <div className="text-xs text-gray-600">Mastered</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                stats.totalScore >= 800 ? 'bg-green-100' :
                stats.totalScore >= 600 ? 'bg-blue-100' :
                stats.totalScore >= 400 ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                <SafeIcon icon={FiZap} className={`w-6 h-6 ${getPerformanceColor(stats.totalScore)}`} />
              </div>
              <div className={`text-xl font-bold ${getPerformanceColor(stats.totalScore)}`}>
                {stats.totalScore}
              </div>
              <div className={`text-xs font-medium ${getPerformanceColor(stats.totalScore)}`}>
                Score
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <SafeIcon icon={FiCompass} className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-purple-800">{stats.journeyProgress}%</div>
              <div className="text-xs text-purple-600">Journey</div>
            </motion.div>
          </div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Score Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-800">{stats.accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy (60%)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{displayAvgTime.toFixed(1)}s</div>
                <div className="text-xs text-gray-600">Average Speed (20%)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{displayTotalTime.toFixed(0)}s</div>
                <div className="text-xs text-gray-600">Total Time (20%)</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stage Distribution Chart */}
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <StageDistributionChart stageDistribution={stats.stageDistribution} />
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          onClick={onContinue}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          Continue Learning
        </motion.button>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onMainMenu}
          className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
        >
          Main Menu
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RoundSummary;