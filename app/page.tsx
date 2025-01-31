'use client';

import { PaperGolfGame } from './components/paper-golf/PaperGolfGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* Golf ball decorations - hidden on mobile */}
      <div className="hidden sm:block absolute top-10 left-10 w-20 h-20 rounded-full bg-white/5 blur-xl" />
      <div className="hidden sm:block absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/5 blur-xl" />
      
      {/* Main content */}
      <div className="container mx-auto min-h-screen px-4 sm:px-6 md:px-8 py-4 sm:py-8 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-8 text-shadow">
            Paper Golf
          </h1>
          <PaperGolfGame />
          <footer className="mt-4 sm:mt-8 text-center text-white/60 text-xs sm:text-sm">
            <p>Inspired by <a href="https://gladdendesign.com/products/paper-apps-golf" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">Paper Apps™ GOLF</a> by Gladden Design</p>
          </footer>
        </div>
      </div>
    </main>
  );
} 