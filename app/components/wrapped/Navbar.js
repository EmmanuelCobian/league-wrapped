"use client"
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 pt-5">
          <Link 
            href="/" 
            className="text-4xl font-bold text-white-800 hover:text-gray-600 transition-colors"
          >
            RIOT WRAPPED
          </Link>
        </div>
      </div>
    </nav>
  );
}