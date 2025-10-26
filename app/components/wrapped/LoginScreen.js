"use client"
import { useState } from 'react';

export default function LoginScreen({ fetchData }) {
  const [riotId, setRiotId] = useState('');
  const [tagline, setTagline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(riotId, tagline);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Enter Riot ID and Tag to begin your wrapped
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={riotId}
                  onChange={(e) => setRiotId(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Riot ID"
                  required
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
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Wrapped
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}