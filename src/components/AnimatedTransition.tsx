import React, { useState, useEffect } from 'react';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  duration = 300,
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Apply enter animation after a small delay to ensure DOM update
      setTimeout(() => {
        setAnimationClass('opacity-100 scale-100');
      }, 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transform transition-all duration-${duration} ${animationClass}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;