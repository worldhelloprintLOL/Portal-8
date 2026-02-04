
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from './data/games.js';
import Navbar from './components/Navbar.jsx';
import GameCard from './components/GameCard.jsx';
import GameViewer from './components/GameViewer.jsx';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('nova-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to local storage
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

  const handlePlay = (gameId) => {
    setSelectedGameId(gameId);
  };

  const toggleFavorite = (e, gameId) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar 
        onSearch={setSearchQuery} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        onGoHome={() => {
          setActiveCategory('All');
          setSearchQuery('');
          setSelectedGameId(null);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6">
        {!searchQuery && activeCategory === 'All' && (
          <div className="mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 md:px-12 md:py-16 shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Level Up Your <span className="text-indigo-200">Free Time</span>
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-md">
                Fast, unblocked, and free. Play the web's best games in premium quality without the lag.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handlePlay('slope')}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Play Slope Now
                </button>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://picsum.photos/seed/${i + 20}/40/40`} className="w-10 h-10 rounded-full border-2 border-indigo-600" alt="user" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-700 flex items-center justify-center text-[10px] font-bold text-white">
                    +10k
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-20 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="100" fill="white" />
              </svg>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {searchQuery ? `Search results for "${searchQuery}"` : `${activeCategory} Games`}
            <span className="text-slate-500 text-sm font-normal">({filteredGames.length})</span>
          </h2>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={handlePlay}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300">No games found</h3>
            <p className="text-slate-500 max-w-xs mt-2">We couldn't find any games matching your search. Try a different term or category!</p>
          </div>
        )}

        {favorites.length > 0 && !searchQuery && activeCategory === 'All' && (
          <div className="mt-16 border-t border-slate-800 pt-10">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Your Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {GAMES_DATA.filter(g => favorites.includes(g.id)).map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlay={handlePlay}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-logo font-bold text-slate-100">NOVA ARCADE</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">The premium destination for school-safe, unblocked browser games.</p>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Request a Game</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a>
          </div>
          
          <div className="text-slate-500 text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} Nova Arcade Studio. All rights reserved.<br/>
            Games are provided for educational entertainment.
          </div>
        </div>
      </footer>

      {selectedGame && (
        <GameViewer 
          game={selectedGame} 
          onClose={() => setSelectedGameId(null)} 
        />
      )}
    </div>
  );
};

export default App;
