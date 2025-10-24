import React, { useEffect, useState } from 'react';
interface ScoreCircleProps {
  score: number;
}
const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  // Color based on score
  const getScoreColor = () => {
    if (score >= 75) return '#2ecc71'; // Green
    if (score >= 50) return '#f1c40f'; // Yellow
    if (score >= 25) return '#e67e22'; // Orange
    return '#e74c3c'; // Red
  };
  const getBadgeText = () => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Poor';
  };
  // Animate score counting up
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayScore < score) {
        setDisplayScore(prev => Math.min(prev + 1, score));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [displayScore, score]);
  // Calculate circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - displayScore / 100 * circumference;
  return <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Background circle */}
        <svg width="160" height="160" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke={'#e6e6e6'} strokeWidth="12" />
          {/* Progress circle */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke={getScoreColor()} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 100 100)" />
        </svg>
        {/* Score text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold text-white">{displayScore}</span>
          <span className="text-sm opacity-70 text-white">out of 100</span>
        </div>
      </div>
      {/* Badge */}
      <div className="mt-4 px-4 py-1 rounded-full text-white text-sm font-medium" style={{
      backgroundColor: getScoreColor()
    }}>
        {getBadgeText()}
      </div>
    </div>;
};
export default ScoreCircle;