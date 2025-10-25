"use client"
import { useState } from 'react';

export default function LoadingPage({ onNavigate }) {
  const [progress, setProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onNavigate('overall_stats'), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-8 px-8">
        <div className="w-64 h-64 flex items-center justify-center">
          <img 
            src="https://media.tenor.com/6PY7-BYMBj8AAAAj/poro-disco.gif" 
            alt="Loading animation"
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="w-80">
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Loading your Riot Wrapped... {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
