
import React from 'react';

const e = React.createElement;

const GameViewer = ({ game, onClose }) => {
  return e('div', { className: 'fixed inset-0 z-[60] bg-slate-950/95 flex flex-col' },
    e('div', { className: 'flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800' },
      e('div', { className: 'flex items-center gap-4' },
        e('button', { className: 'p-2 text-slate-400 hover:text-white', onClick: onClose },
          e('svg', { className: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M10 19l-7-7m0 0l7-7m-7 7h18' })
          )
        ),
        e('div', null,
          e('h2', { className: 'text-xl font-bold text-slate-100' }, game.title),
          e('p', { className: 'text-xs text-indigo-400 uppercase tracking-widest' }, game.category)
        )
      ),
      e('button', { 
        className: 'px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold',
        onClick: onClose
      }, 'Exit Game')
    ),
    e('div', { className: 'flex-1 relative bg-black flex items-center justify-center overflow-hidden' },
      e('div', { className: 'w-full h-full max-w-6xl max-h-[80vh]' },
        e('iframe', {
          src: game.iframeUrl,
          className: 'w-full h-full border-0 bg-white',
          title: game.title,
          allowFullScreen: true,
          allow: 'autoplay; encrypted-media; fullscreen'
        })
      )
    )
  );
};

export default GameViewer;
