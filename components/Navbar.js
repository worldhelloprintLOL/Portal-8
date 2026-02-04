
import React from 'react';

const e = React.createElement;

const Navbar = ({ onSearch, activeCategory, categories, onCategoryChange, onGoHome }) => {
  return e('nav', { className: 'sticky top-0 z-50 px-4 py-6 sm:px-6' },
    e('div', { className: 'max-w-7xl mx-auto glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl' },
      
      // Logo
      e('div', { className: 'flex items-center gap-3 cursor-pointer group', onClick: onGoHome },
        e('div', { className: 'w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300' },
          e('svg', { className: 'h-7 w-7 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 },
            e('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })
          )
        ),
        e('h1', { className: 'text-2xl font-bold font-logo bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity' }, 'NOVA')
      ),

      // Search
      e('div', { className: 'relative w-full md:w-80 lg:w-96 group' },
        e('input', {
          type: 'text',
          placeholder: 'Search the arcade...',
          className: 'w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-6 pl-14 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all duration-300',
          onChange: (event) => onSearch(event.target.value)
        }),
        e('svg', { className: 'h-5 w-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
          e('path', { d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
        )
      ),

      // Categories
      e('div', { className: 'flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0' },
        categories.map(cat => e('button', {
          key: cat,
          onClick: () => onCategoryChange(cat),
          className: `px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
            activeCategory === cat 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
          }`
        }, cat))
      )
    )
  );
};

export default Navbar;
