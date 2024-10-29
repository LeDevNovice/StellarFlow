import React, { useEffect } from 'react';
import './TransitionAnimation.css';

interface TransitionAnimationProps {
  onAnimationEnd: () => void;
  onHalfway: () => void;
}

const animationDuration = 5000;

const TransitionAnimation: React.FC<TransitionAnimationProps> = ({ onAnimationEnd, onHalfway }) => {
  useEffect(() => {
    const halfwayTimer = setTimeout(() => {
      onHalfway();
    }, animationDuration / 2);

    const endTimer = setTimeout(() => {
      onAnimationEnd();
    }, animationDuration);

    return () => {
      clearTimeout(halfwayTimer);
      clearTimeout(endTimer);
    };
  }, [onHalfway, onAnimationEnd]);

  return (
    <div className="transition-overlay">
      <svg className="transition-triangle" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="100,50 0,0 0,100" fill="#FFA500" />
      </svg>
    </div>
  );
};

export default TransitionAnimation;
