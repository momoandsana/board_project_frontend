
import React, { useState, useEffect } from 'react';

interface ImagePreviewProps {
  file: File | null;
  onClear?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onClear }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    // Cleanup function to revoke object URL if it was created
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);


  if (!previewUrl) {
    return null;
  }

  return (
    <div className="mt-4 p-2 border border-neutral-700 rounded-md relative max-w-sm bg-neutral-800">
      <img src={previewUrl} alt="Preview" className="max-h-60 w-auto rounded" />
      {onClear && (
         <button 
            type="button"
            onClick={onClear}
            className="absolute top-1 right-1 bg-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-white rounded-full p-1 text-xs transition-colors"
            aria-label="Clear image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      )}
    </div>
  );
};

export default ImagePreview;