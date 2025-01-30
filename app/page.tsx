'use client';

import { PaperGolfGame } from './components/paper-golf/PaperGolfGame';

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <PaperGolfGame />
      </div>
    </main>
  );
} 