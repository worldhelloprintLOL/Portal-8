
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from './data/games.js';
import { CONFIG_DATA } from './data/config.js';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GameViewer from './components/GameViewer.js';

const e = React.createElement;

const App = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState(['All', 'Action', 'Puzzle', 'Sports', 'Strategy', 'Retro', 'Idle']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [editingGame, setEditingGame] = useState(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load Initial Data
  useEffect(() => {
    setIsAppLoaded(true);
    
    // Priority 1: Official Config File (data/config.js)
    // Priority 2: Local Storage (Personal edits)
    // Priority 3: Default Seed Data (data/games.js)
    
    let initialGames = GAMES_DATA;
    let initialCats = ['All', 'Action', 'Puzzle', 'Sports', 'Strategy', 'Retro', 'Idle'];

    if (CONFIG_DATA && CONFIG_DATA.games) {
      initialGames = CONFIG_DATA.games;
      if (CONFIG_DATA.categories) initialCats = ['All', ...CONFIG_DATA.categories];
    } else {
      const savedGames = localStorage.getItem('nova_games_v2');
      const savedCats = localStorage.getItem('nova_cats_v2');
      if (savedGames) initialGames = JSON.parse(savedGames);
      if (savedCats) initialCats = JSON.parse(savedCats);
    }

    setGames(initialGames);
    setCategories(initialCats);

    const savedFavs = localStorage.getItem('nova_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // Sync to local storage for the current user
  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem('nova_games_v2', JSON.stringify(games));
      localStorage.setItem('nova_cats_v2', JSON.stringify(categories));
    }
  }, [games, categories]);

  const handleDevLogin = () => {
    if (devPassword.trim() === "Hammy2026!!") {
      setIsDevMode(true);
      setShowDevLogin(false);
      setDevPassword('');
    } else {
      alert("INCORRECT KEY. ACCESS DENIED.");
      setDevPassword('');
    }
  };

  const toggleFavorite = (event, gameId) => {
    event.stopPropagation();
    const newFavs = favorites.includes(gameId) ? favorites.filter(id => id !== gameId) : [...favorites, gameId];
    setFavorites(newFavs);
    localStorage.setItem('nova_favs', JSON.stringify(newFavs));
  };

  const handleSaveGame = (data) => {
    const id = editingGame ? editingGame.id : 'game_' + Date.now();
    const newGames = editingGame ? games.map(g => g.id === id ? { ...data, id } : g) : [...games, { ...data, id }];
    
    if (!categories.includes(data.category)) {
      setCategories(prev => [...prev, data.category]);
    }
    
    setGames(newGames);
    setShowGameForm(false);
    setEditingGame(null);
  };

  const deleteGame = (id) => {
    if (confirm("Permanently delete this game from your current view?")) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  const filteredGames = useMemo(() => games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeCategory === 'All' || g.category === activeCategory)
  ), [games, searchQuery, activeCategory]);

  const popularGames = useMemo(() => games.filter(g => g.isPopular), [games]);
  const selectedGame = useMemo(() => games.find(g => g.id === selectedGameId), [selectedGameId, games]);

  const exportConfig = () => {
    const configObj = {
      games: games,
      categories: categories.filter(c => c !== 'All')
    };
    const code = `export const CONFIG_DATA = ${JSON.stringify(configObj, null, 2)};`;
    navigator.clipboard.writeText(code);
    setShowExportModal(true);
  };

  const GameForm = () => {
    const [formData, setFormData] = useState(editingGame || { title: '', htmlContent: '', category: 'Action', thumbnail: '', description: '', isPopular: false });
    return e('div', { className: 'fixed inset-0 z-[110] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4' },
      e('div', { className: 'bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-fade-up' },
        e('h2', { className: 'text-2xl font-bold text-white mb-6 font-logo' }, editingGame ? 'Update Database Record' : 'Add To Library'),
        e('div', { className: 'space-y-4' },
          e('div', { className: 'grid grid-cols-2 gap-4' },
            e('input', { placeholder: 'Game Title', value: formData.title, onChange: v => setFormData({...formData, title: v.target.value}), className: 'bg-slate-800 border-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500' }),
            e('select', { value: formData.category, onChange: v => setFormData({...formData, category: v.target.value}), className: 'bg-slate-800 border-none p-4 rounded-xl text-white' }, 
              categories.filter(c => c !== 'All').map(c => e('option', { key: c, value: c }, c))
            )
          ),
          e('textarea', { placeholder: 'Paste HTML / Iframe / JS Embed Code Here', value: formData.htmlContent, onChange: v => setFormData({...formData, htmlContent: v.target.value}), className: 'w-full bg-slate-950 p-4 rounded-xl text-white h-48 font-mono text-[10px] outline-none focus:ring-1 focus:ring-indigo-500' }),
          e('input', { placeholder: 'Thumbnail URL', value: formData.thumbnail, onChange: v => setFormData({...formData, thumbnail: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white' }),
          e('textarea', { placeholder: 'Game Description', value: formData.description, onChange: v => setFormData({...formData, description: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white h-20' }),
          e('label', { className: 'flex items-center gap-3 text-slate-300 cursor-pointer' },
            e('input', { type: 'checkbox', className: 'w-5 h-5 rounded accent-indigo-500', checked: formData.isPopular, onChange: v => setFormData({...formData, isPopular: v.target.checked}) }),
            'Feature this game in the Popular section'
          )
        ),
        e('div', { className: 'flex gap-3 mt-8' },
          e('button', { onClick: () => { setShowGameForm(false); setEditingGame(null); }, className: 'flex-1 py-4 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700 transition-all' }, 'Cancel'),
          e('button', { onClick: () => handleSaveGame(formData), className: 'flex-1 py-4 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all' }, 'Save Locally')
        )
      )
    );
  };

  return e('div', { className: `min-h-screen flex flex-col transition-opacity duration-1000 ${isAppLoaded ? 'opacity-100' : 'opacity-0'}` },
    e(Navbar, { onSearch: setSearchQuery, activeCategory, categories, onCategoryChange: setActiveCategory, onGoHome: () => { setActiveCategory('All'); setSearchQuery(''); setSelectedGameId(null); } }),
    
    e('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6' },
      
      // IMPROVED DEVELOPER CONSOLE
      isDevMode && e('div', { className: 'mb-12 p-8 glass rounded-[2.5rem] border border-indigo-500/30 shadow-[0_20px_50px_rgba(99,102,241,0.1)] flex flex-col lg:flex-row items-center justify-between gap-6 animate-fade-up' },
        e('div', { className: 'flex items-center gap-5' },
          e('div', { className: 'w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float' }, 
            e('svg', { className: 'h-8 w-8 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }))
          ),
          e('div', null,
            e('h3', { className: 'text-xl font-bold text-white font-logo' }, 'ADMIN PANEL ACTIVE'),
            e('p', { className: 'text-xs text-indigo-400 font-bold mt-1 tracking-widest' }, 'CONTROL VERSION: 2.5.2')
          )
        ),
        e('div', { className: 'flex flex-wrap justify-center gap-3' },
          e('button', { onClick: () => { const n = prompt("New Genre Name:"); if(n) setCategories([...categories, n]); }, className: 'bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl text-[10px] font-black tracking-widest' }, 'NEW GENRE'),
          e('button', { onClick: () => { setEditingGame(null); setShowGameForm(true); }, className: 'bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest shadow-lg shadow-indigo-600/30' }, 'ADD GAME'),
          e('button', { onClick: exportConfig, className: 'bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest' }, 'COPY CONFIG FOR EVERYONE'),
          e('button', { onClick: () => setIsDevMode(false), className: 'bg-slate-800 text-slate-500 px-5 py-3 rounded-xl text-[10px] font-black tracking-widest' }, 'EXIT')
        )
      ),

      // Hero / Trending
      !searchQuery && activeCategory === 'All' && popularGames.length > 0 && e('section', { className: 'mb-16 stagger-1 animate-fade-up' },
        e('div', { className: 'flex items-center gap-4 mb-8' },
          e('div', { className: 'w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center pulse-glow' }, 
            e('svg', { className: 'h-4 w-4 text-white', fill: 'currentColor', viewBox: '0 0 24 24' }, e('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' }))
          ),
          e('h2', { className: 'text-2xl font-bold text-white font-logo tracking-tight' }, 'Trending Now')
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          popularGames.map(game => e(GameCard, { 
            key: game.id, game, isFavorite: favorites.includes(game.id), 
            onToggleFavorite: toggleFavorite, onPlay: setSelectedGameId,
            isDevMode, onEdit: (ev) => { ev.stopPropagation(); setEditingGame(game); setShowGameForm(true); },
            onDelete: (ev) => { ev.stopPropagation(); deleteGame(game.id); }
          }))
        )
      ),

      // Main Grid
      e('section', { className: 'stagger-2 animate-fade-up' },
        e('div', { className: 'flex items-center justify-between mb-10 pb-4 border-b border-white/5' },
          e('h2', { className: 'text-2xl font-bold text-white font-logo' }, 
            searchQuery ? `SEARCH: ${searchQuery.toUpperCase()}` : `${activeCategory.toUpperCase()} COLLECTION`
          )
        ),
        filteredGames.length > 0 ? e('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
          filteredGames.map((game, idx) => e(GameCard, { 
            key: game.id, game, isFavorite: favorites.includes(game.id), 
            onToggleFavorite: toggleFavorite, onPlay: setSelectedGameId,
            isDevMode, onEdit: (ev) => { ev.stopPropagation(); setEditingGame(game); setShowGameForm(true); },
            onDelete: (ev) => { ev.stopPropagation(); deleteGame(game.id); },
            className: `stagger-${Math.min(idx + 1, 4)}`
          }))
        ) : e('div', { className: 'text-center py-24 text-slate-700 font-logo text-sm' }, 'DATA NOT FOUND')
      )
    ),

    // Clean Footer
    e('footer', { className: 'bg-slate-900/40 border-t border-white/5 py-16 px-6 mt-20' },
      e('div', { className: 'max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10' },
        e('div', null,
          e('div', { className: 'font-logo font-bold text-indigo-500 text-2xl mb-2' }, 'NOVA ARCADE'),
          e('p', { className: 'text-slate-500 text-xs max-w-sm tracking-wide' }, 'High-performance unblocked gaming ecosystem. Secure, anonymous, and premium.')
        ),
        e('div', { className: 'flex items-center gap-6' },
          e('button', { onClick: () => setShowDevLogin(true), className: 'text-[9px] font-black tracking-[0.4em] text-slate-700 hover:text-indigo-500 transition-all' }, 'SYSTEM LOGIN')
        )
      )
    ),

    // RE-VAMPED LOGIN (FIXED)
    showDevLogin && e('div', { className: 'fixed inset-0 z-[120] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-up' },
      e('div', { className: 'bg-slate-900 border border-indigo-500/20 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl' },
        e('div', { className: 'text-center mb-10' },
          e('div', { className: 'w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl' }, 
             e('svg', { className: 'h-10 w-10 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }))
          ),
          e('h3', { className: 'text-xl font-bold text-white font-logo mb-2' }, 'Authorization Required'),
          e('p', { className: 'text-slate-500 text-xs' }, 'Enter the developer security key to proceed.')
        ),
        e('input', { 
          type: 'password', 
          placeholder: 'SECURITY KEY', 
          value: devPassword, 
          onChange: v => setDevPassword(v.target.value), 
          onKeyPress: (ev) => ev.key === 'Enter' && handleDevLogin(),
          className: 'w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-white mb-6 text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold' 
        }),
        e('div', { className: 'flex flex-col gap-2' },
          e('button', { onClick: handleDevLogin, className: 'w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-500 transition-all' }, 'UNLOCK SYSTEM'),
          e('button', { onClick: () => { setShowDevLogin(false); setDevPassword(''); }, className: 'w-full py-3 text-slate-500 font-bold text-[10px] hover:text-white transition-all' }, 'CANCEL')
        )
      )
    ),

    // EXPORT SUCCESS MODAL
    showExportModal && e('div', { className: 'fixed inset-0 z-[130] bg-slate-950/95 flex items-center justify-center p-6' },
      e('div', { className: 'bg-slate-900 border border-emerald-500/30 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-fade-up' },
        e('h3', { className: 'text-2xl font-bold text-white font-logo mb-4' }, 'Config Copied!'),
        e('p', { className: 'text-slate-400 text-sm mb-6 leading-relaxed' }, 'The code is in your clipboard. To make your changes show for everyone:'),
        e('div', { className: 'space-y-3 mb-8 text-xs' },
          e('div', { className: 'flex gap-3' }, e('span', { className: 'text-emerald-500 font-bold' }, '1.'), 'Open data/config.js in your code editor.'),
          e('div', { className: 'flex gap-3' }, e('span', { className: 'text-emerald-500 font-bold' }, '2.'), 'Delete everything and PASTE the code.'),
          e('div', { className: 'flex gap-3' }, e('span', { className: 'text-emerald-500 font-bold' }, '3.'), 'Save and refresh the site.')
        ),
        e('button', { onClick: () => setShowExportModal(false), className: 'w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs tracking-widest' }, 'GOT IT!')
      )
    ),

    showGameForm && e(GameForm),
    selectedGame && e(GameViewer, { game: selectedGame, onClose: () => setSelectedGameId(null) })
  );
};

export default App;
