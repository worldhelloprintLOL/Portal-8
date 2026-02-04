
import React from 'react';

const e = React.createElement;

const GameCard = ({ game, onPlay, isFavorite, onToggleFavorite }) => {
  return e('div', { 
    className: 'group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-slate-700 hover:border-indigo-500',
    onClick: () => onPlay(game.id)
  },
    e('div', { className: 'aspect-video relative overflow-hidden' },
      e('img', { 
        src: game.thumbnail, 
        alt: game.title, 
        className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
      }),
      e('div', { className: 'absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center' },
        e('div', { className: 'bg-indigo-600 p-3 rounded-full' },
          e('svg', { className: 'h-8 w-8 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' })
          )
        )
      ),
      game.isPopular && e('div', { className: 'absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase' }, 'Popular'),
      e('button', {
        className: `absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md ${isFavorite ? 'bg-indigo-600/80 text-white' : 'bg-slate-900/40 text-slate-300'}`,
        onClick: (event) => onToggleFavorite(event, game.id)
      },
        e('svg', { className: 'h-4 w-4', fill: isFavorite ? 'currentColor' : 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
          e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
        )
      )
    ),
    e('div', { className: 'p-4' },
      e('div', { className: 'flex items-center justify-between mb-1' },
        e('h3', { className: 'text-lg font-bold text-slate-100 truncate' }, game.title),
        e('span', { className: 'text-[10px] text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md uppercase' }, game.category)
      ),
      e('p', { className: 'text-slate-400 text-xs line-clamp-2 h-8' }, game.description)
    )
  );
};

export default GameCard;
