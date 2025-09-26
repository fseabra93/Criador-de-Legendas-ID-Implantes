
import React, { useState, useCallback } from 'react';

interface AudioUploaderProps {
  onAudioUpload: (audio: string | null) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const base64 = await fileToBase64(file);
      onAudioUpload(base64);
    }
    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  }, [onAudioUpload]);

  const removeAudio = useCallback(() => {
    setFileName(null);
    onAudioUpload(null);
  }, [onAudioUpload]);

  return (
    <div>
      {!fileName ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer">
          <input
            type="file"
            accept="audio/mp3"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload audio file"
          />
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-teal-600">Clique para carregar</span> um áudio
            </p>
            <p className="text-xs text-gray-500">MP3</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-center space-x-2 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.447-.894L4 6.424v6.152a1 1 0 00.553.894l14 4A1 1 0 0020 17V4a1 1 0 00-2-1z" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{fileName}</span>
          </div>
          <button
            onClick={removeAudio}
            className="bg-red-500/70 text-white rounded-full p-1"
            aria-label="Remove audio file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
