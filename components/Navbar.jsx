
import React from 'react';

const Navbar = ({ onSearch, activeCategory, onCategoryChange, onGoHome }) => {
  const categories = ['All', 'Action', 'Puzzle', 'Sports', 'Strategy', 'Retro', 'Idle'];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div 
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-logo bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            NOVA ARCADE
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search for a game..."
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-full py-2 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
