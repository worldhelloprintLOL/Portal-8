
import React from 'react';

const e = React.createElement;

const GameCard = ({ game, onPlay, isFavorite, onToggleFavorite, isDevMode, onEdit, onDelete, className }) => {
  const handleExternal = (ev) => {
    ev.stopPropagation();
    const blob = new Blob([game.htmlContent || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return e('div', { 
    onClick: () => onPlay(game.id),
    className: `group glass-card rounded-3xl p-3 overflow-hidden cursor-pointer ${className}`
  },
    e('div', { className: 'aspect-[16/11] relative overflow-hidden rounded-2xl bg-slate-900' },
      e('img', { 
        src: game.thumbnail || `https://picsum.photos/seed/${game.title}/400/300`, 
        className: 'w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 group-hover:rotate-1' 
      }),
      
      // Dynamic Gradient Overlay
      e('div', { className: 'absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500' }),
      
      // Hover Actions
      e('div', { className: 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]' },
        e('div', { className: 'bg-white p-4 rounded-full shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500' },
          e('svg', { className: 'h-8 w-8 text-indigo-600', fill: 'currentColor', viewBox: '0 0 24 24' }, e('path', { d: 'M8 5v14l11-7z' }))
        )
      ),

      // Badges
      e('div', { className: 'absolute top-3 right-3 flex flex-col gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300' },
        e('button', { onClick: handleExternal, className: 'p-2.5 bg-slate-900/90 hover:bg-indigo-600 rounded-xl text-white transition-colors shadow-xl' },
          e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' }))
        ),
        e('button', { 
          onClick: (ev) => onToggleFavorite(ev, game.id), 
          className: `p-2.5 rounded-xl transition-all duration-300 shadow-xl ${isFavorite ? 'bg-indigo-600 text-white' : 'bg-slate-900/90 text-slate-400 hover:text-white'}` 
        },
          e('svg', { className: 'h-4 w-4', fill: isFavorite ? 'currentColor' : 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }))
        )
      ),

      // Admin Tools
      isDevMode && e('div', { className: 'absolute bottom-3 left-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300' },
        e('button', { onClick: onEdit, className: 'p-2 bg-emerald-500/90 rounded-lg text-white hover:bg-emerald-500' }, e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' }))),
        e('button', { onClick: onDelete, className: 'p-2 bg-rose-500/90 rounded-lg text-white hover:bg-rose-500' }, e('svg', { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })))
      )
    ),
    e('div', { className: 'p-4' },
      e('div', { className: 'flex items-center justify-between mb-2 gap-2' },
        e('h3', { className: 'font-bold text-white text-lg truncate flex-1 group-hover:text-indigo-400 transition-colors' }, game.title),
        e('span', { className: 'text-[9px] font-black text-indigo-400/80 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 uppercase tracking-widest' }, game.category)
      ),
      e('p', { className: 'text-xs text-slate-400 line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity' }, game.description)
    )
  );
};

export default GameCard;
