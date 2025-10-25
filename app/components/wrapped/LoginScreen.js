"use client"
import { useState } from 'react';

export default function LoginScreen({ onNavigate }) {
  const [riotId, setRiotId] = useState('');
  const [tagline, setTagline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wrappedData, setWrappedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (riotId && tagline) {
      onNavigate('loading');
      setError('');
      
      try {
        const response = await fetch('/api/wrapped', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameName: riotId, tagLine: tagline }),
        });
        
        const result = await response.json();
        console.log(result)
        if (!result.success) {
          throw new Error(result.error);
        }
        
        setWrappedData(result.data);
        onNavigate('overall_stats');
        
      } catch (err) {
        setError(err.message);
        setState('error');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="text-4xl font-bold text-black dark:text-white">
          RIOT WRAPPED
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Enter Riot ID and Tag to begin your wrapped
          </h1>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={riotId}
                  onChange={(e) => setRiotId(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Riot ID"
                />
              </div>
              <div className="relative w-32">
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="# Tagline"
                  maxLength={5}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Start Wrapped'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}