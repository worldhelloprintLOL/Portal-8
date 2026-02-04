
import React from 'react';

const e = React.createElement;

const GameViewer = ({ game, onClose }) => {
  const handleExternal = () => {
    const blob = new Blob([game.htmlContent || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return e('div', { className: 'fixed inset-0 z-[60] bg-slate-950 flex flex-col animate-fade-up' },
    e('header', { className: 'flex items-center justify-between px-8 py-6 bg-slate-900/50 backdrop-blur-2xl border-b border-white/5' },
      e('div', { className: 'flex items-center gap-6' },
        e('button', { onClick: onClose, className: 'p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all duration-300' },
          e('svg', { className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M10 19l-7-7m0 0l7-7m-7 7h18' }))
        ),
        e('div', null,
          e('h2', { className: 'text-2xl font-bold text-white font-logo tracking-tight' }, game.title),
          e('div', { className: 'flex items-center gap-3 mt-1' },
            e('span', { className: 'text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]' }, game.category),
            e('div', { className: 'w-1 h-1 rounded-full bg-slate-700' }),
            e('span', { className: 'text-[10px] text-emerald-500 font-bold' }, 'STABLE CONNECTION')
          )
        )
      ),
      e('div', { className: 'flex gap-4' },
        e('button', { onClick: handleExternal, className: 'hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 rounded-xl text-sm font-bold border border-white/5 hover:bg-slate-700 transition-all' }, 
          e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' })),
          'Launch Window'
        ),
        e('button', { onClick: onClose, className: 'px-8 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-rose-600/20 hover:bg-rose-500 transition-all' }, 'Quit')
      )
    ),
    e('div', { className: 'flex-1 bg-black flex items-center justify-center relative group' },
      e('div', { className: 'w-full h-full p-4 lg:p-12' },
        e('iframe', {
          srcDoc: game.htmlContent,
          className: 'w-full h-full border-0 rounded-3xl shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] bg-white',
          title: game.title,
          allowFullScreen: true,
          allow: 'autoplay; encrypted-media; fullscreen; gamepad'
        })
      ),
      
      // Immersion Hint
      e('div', { className: 'absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none' },
        e('p', { className: 'text-xs text-slate-400 font-medium' }, 'Press "ESC" to toggle UI visibility')
      )
    )
  );
};

export default GameViewer;
