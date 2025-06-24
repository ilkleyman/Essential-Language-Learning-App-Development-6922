import React from 'react';
import { motion } from 'framer-motion';

const StageDistributionChart = ({ stageDistribution }) => {
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

  const stageColors = {
    1: { bg: '#3B82F6', light: '#DBEAFE' },
    2: { bg: '#10B981', light: '#D1FAE5' },
    3: { bg: '#8B5CF6', light: '#EDE9FE' },
    4: { bg: '#F59E0B', light: '#FEF3C7' },
    5: { bg: '#EF4444', light: '#FEE2E2' },
    6: { bg: '#06B6D4', light: '#CFFAFE' },
    7: { bg: '#84CC16', light: '#ECFCCB' },
    8: { bg: '#F97316', light: '#FED7AA' },
    9: { bg: '#EC4899', light: '#FCE7F3' }
  };

  // Calculate total and percentages
  const total = Object.values(stageDistribution || {}).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Stage Distribution</h3>
        <p className="text-gray-500">No words learned yet</p>
      </div>
    );
  }

  // Calculate angles for pie chart
  let currentAngle = 0;
  const segments = Object.entries(stageDistribution || {})
    .filter(([stage, count]) => count > 0)
    .map(([stage, count]) => {
      const percentage = (count / total) * 100;
      const angle = (count / total) * 360;
      const segment = {
        stage: parseInt(stage),
        count,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: stageColors[stage]
      };
      currentAngle += angle;
      return segment;
    });

  // Create SVG path for each segment
  const createPath = (startAngle, endAngle, innerRadius = 0, outerRadius = 80) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
    const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    if (innerRadius === 0) {
      return [
        "M", 100, 100,
        "L", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    } else {
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    }
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Stage Distribution</h3>
      
      <div className="flex flex-col items-center">
        {/* Pie Chart */}
        <div className="relative mb-4">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <motion.path
                key={segment.stage}
                d={createPath(segment.startAngle, segment.endAngle)}
                fill={segment.color.bg}
                stroke="white"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            ))}
            
            {/* Center circle with total */}
            <circle cx="100" cy="100" r="35" fill="white" stroke="#E5E7EB" strokeWidth="2" />
            <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-600">Total</text>
            <text x="100" y="110" textAnchor="middle" className="text-lg font-bold fill-gray-800">{total}</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2">
          {segments.map((segment, index) => (
            <motion.div
              key={segment.stage}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-2 bg-white rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color.bg }}
                />
                <span className="text-sm font-medium text-gray-700">
                  Stage {segment.stage}: {stageNames[segment.stage]}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">{segment.count}</div>
                <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageDistributionChart;