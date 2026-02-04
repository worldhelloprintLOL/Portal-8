import React, { useState } from 'react';

const e = React.createElement;

const GameViewer = ({ game, onClose }) => {
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

  const handleExternal = () => {
    if (game.url) {
      window.open(game.url, '_blank');
    } else if (game.htmlContent) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(game.htmlContent);
        newWindow.document.close();
      }
    }
  };

  return e('div', { className: 'fixed inset-0 z-[400] bg-slate-950 flex flex-col animate-fade-up' },
    // Header
    e('header', { className: 'flex items-center justify-between px-8 py-6 bg-slate-900/50 backdrop-blur-2xl border-b border-white/5' },
      e('div', { className: 'flex items-center gap-6' },
        e('button', { 
          onClick: onClose, 
          className: 'p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all duration-300' 
        },
          e('svg', { className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, 
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M10 19l-7-7m0 0l7-7m-7 7h18' })
          )
        ),
        e('div', null,
          e('h2', { className: 'text-xl font-bold text-white font-logo' }, game.title),
          e('p', { className: 'text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]' }, game.category)
        )
      ),
      
      e('div', { className: 'flex items-center gap-3' },
        e('button', { 
          onClick: handleExternal,
          className: 'hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black tracking-widest transition-all'
        }, 
          e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' })),
          'LAUNCH WINDOW'
        ),
        e('button', { 
          onClick: toggleFullscreen,
          className: 'flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-indigo-600/20'
        }, 
          e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' })),
          'FULLSCREEN'
        )
      )
    ),

    // Game Frame
    e('div', { className: 'flex-1 relative bg-black flex items-center justify-center overflow-hidden' },
      e('div', { id: 'game-container', className: 'w-full h-full max-w-7xl max-h-[85vh] shadow-2xl shadow-indigo-500/10' },
        e('iframe', {
          src: game.url || undefined,
          srcDoc: game.url ? undefined : (game.htmlContent || '<html><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">No Content Provided</body></html>'),
          className: 'w-full h-full border-0 bg-white rounded-lg',
          title: game.title,
          allowFullScreen: true,
          allow: 'autoplay; encrypted-media; fullscreen; gamepad; microphone; camera; midi'
        })
      )
    ),

    // Instructions
    e('div', { className: 'bg-slate-900/50 py-4 px-8 border-t border-white/5 flex items-center justify-center gap-12 text-[10px] font-black text-slate-500 tracking-widest uppercase' },
      e('div', { className: 'flex items-center gap-3' }, e('span', { className: 'bg-slate-800 px-2 py-1 rounded text-slate-300' }, 'WASD'), 'MOVE'),
      e('div', { className: 'flex items-center gap-3' }, e('span', { className: 'bg-slate-800 px-2 py-1 rounded text-slate-300' }, 'SPACE'), 'ACTION'),
      e('div', { className: 'flex items-center gap-3' }, e('span', { className: 'bg-slate-800 px-2 py-1 rounded text-slate-300' }, 'ESC'), 'BACK')
    )
  );
};

export default GameViewer;