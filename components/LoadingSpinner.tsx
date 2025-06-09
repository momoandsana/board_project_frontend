
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div 
        className={`animate-spin rounded-full border-neutral-300 border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {message && <p className="mt-3 text-sm text-neutral-400">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;