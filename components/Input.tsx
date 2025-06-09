
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, containerClassName = '', className = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-400 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`mt-1 block w-full px-3 py-2 bg-neutral-800 border ${error ? 'border-status-danger focus:ring-status-danger focus:border-status-danger' : 'border-neutral-700 focus:ring-neutral-500 focus:border-neutral-500'} rounded-md shadow-sm text-neutral-100 placeholder-neutral-500 sm:text-sm transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-status-danger">{error}</p>}
    </div>
  );
};

export default Input;