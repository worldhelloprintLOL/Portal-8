
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from './data/games.js';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GameViewer from './components/GameViewer.js';

const e = React.createElement;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('nova-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('nova-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedGame = useMemo(() => 
    GAMES_DATA.find(g => g.id === selectedGameId), 
  [selectedGameId]);

  const toggleFavorite = (event, gameId) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  };

  const gameGrid = e('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
    filteredGames.map(game => e(GameCard, {
      key: game.id,
      game,
      onPlay: setSelectedGameId,
      isFavorite: favorites.includes(game.id),
      onToggleFavorite: toggleFavorite
    }))
  );

  const emptyState = e('div', { className: 'flex flex-col items-center justify-center py-20 text-center' },
    e('div', { className: 'w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4' },
      e('svg', { className: 'h-10 w-10 text-slate-600', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
        e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
      )
    ),
    e('h3', { className: 'text-xl font-semibold text-slate-300' }, 'No games found'),
    e('p', { className: 'text-slate-500 max-w-xs mt-2' }, "We couldn't find any games matching your search.")
  );

  return e('div', { className: 'min-h-screen flex flex-col bg-slate-950' },
    e(Navbar, {
      onSearch: setSearchQuery,
      activeCategory,
      onCategoryChange: setActiveCategory,
      onGoHome: () => { setActiveCategory('All'); setSearchQuery(''); setSelectedGameId(null); }
    }),
    e('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6' },
      !searchQuery && activeCategory === 'All' && e('div', { className: 'mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 md:px-12 md:py-16 shadow-2xl shadow-indigo-500/20' },
        e('div', { className: 'relative z-10 max-w-2xl' },
          e('h2', { className: 'text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight' }, 'Level Up Your ', e('span', { className: 'text-indigo-200' }, 'Free Time')),
          e('p', { className: 'text-indigo-100 text-lg mb-8 max-w-md' }, 'Fast, unblocked, and free. Play the web\'s best games in premium quality.'),
          e('button', { 
            className: 'px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg',
            onClick: () => setSelectedGameId('slope')
          }, 'Play Slope Now')
        )
      ),
      e('div', { className: 'flex items-center justify-between mb-6' },
        e('h2', { className: 'text-xl font-bold text-slate-100' }, 
          searchQuery ? `Search results for "${searchQuery}"` : `${activeCategory} Games`,
          e('span', { className: 'ml-2 text-slate-500 text-sm font-normal' }, `(${filteredGames.length})`)
        )
      ),
      filteredGames.length > 0 ? gameGrid : emptyState
    ),
    selectedGame && e(GameViewer, { game: selectedGame, onClose: () => setSelectedGameId(null) })
  );
};

export default App;
