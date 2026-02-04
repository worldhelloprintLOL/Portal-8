
import React, { useState } from 'react';
import { Game } from '../types';

interface GameViewerProps {
  game: Game;
  onClose: () => void;
}

const GameViewer: React.FC<GameViewerProps> = ({ game, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const container = document.getElementById('game-container');
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/95 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{game.title}</h2>
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">{game.category}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Fullscreen
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-rose-600/20"
          >
            Exit Game
          </button>
        </div>
      </div>

      {/* Main Game Frame */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div id="game-container" className="w-full h-full max-w-6xl max-h-[80vh] shadow-2xl shadow-indigo-500/10">
          <iframe
            src={game.iframeUrl}
            className="w-full h-full border-0 bg-white"
            title={game.title}
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
          />
        </div>
        
        {/* Ad Space Placeholder / Game Description */}
        <div className="hidden lg:block absolute bottom-4 left-6 max-w-xs p-4 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl">
          <p className="text-xs text-slate-400 italic">"Playing unblocked games on Nova Arcade is always faster and smoother. Enjoy!"</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-center text-slate-500 text-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">W A S D</kbd>
            <span>Move</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">SPACE</kbd>
            <span>Action / Jump</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">P</kbd>
            <span>Pause</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameViewer;
