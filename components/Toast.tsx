import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { ToastMessage } from '../types';

interface ToastContextType {
  addToast: (type: ToastMessage['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    showToast(type, message);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const toastEventManager = {
  listeners: [] as Array<(toast: Omit<ToastMessage, 'id'>) => void>,
  subscribe(listener: (toast: Omit<ToastMessage, 'id'>) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  emit(toast: Omit<ToastMessage, 'id'>) {
    this.listeners.forEach((listener) => listener(toast));
  },
};

export const showToast = (type: ToastMessage['type'], message: string) => {
  toastEventManager.emit({ type, message });
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleNewToast = (toastData: Omit<ToastMessage, 'id'>) => {
      const id = toastIdCounter++;
      setToasts((prevToasts) => [...prevToasts, { ...toastData, id }]);
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    };

    const unsubscribe = toastEventManager.subscribe(handleNewToast);
    return () => unsubscribe();
  }, [removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const baseClasses =
    'w-[400px] bg-neutral-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border';
  const typeClasses = {
    success: 'border-l-4 border-status-success',
    error: 'border-l-4 border-status-danger',
    info: 'border-l-4 border-status-info',
  };
  const iconClasses = {
    success: 'text-status-success',
    error: 'text-status-danger',
    info: 'text-status-info',
  };

  const Icon = () => {
    if (toast.type === 'success')
      return (
        <svg
          className={`h-6 w-6 ${iconClasses.success}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    if (toast.type === 'error')
      return (
        <svg
          className={`h-6 w-6 ${iconClasses.error}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
    return (
      <svg
        className={`h-6 w-6 ${iconClasses.info}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    );
  };

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]} border-neutral-700`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-100 break-words">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onDismiss}
              className="bg-neutral-800 rounded-md inline-flex text-neutral-400 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-neutral-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
//s