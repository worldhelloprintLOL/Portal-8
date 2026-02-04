import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from './data/games.js';
import { CONFIG_DATA } from './data/config.js';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GameViewer from './components/GameViewer.js';
import PortalAi from './components/PortalAi.js';
import SettingsModal from './components/SettingsModal.js';

const e = React.createElement;

const App = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState(['All']);
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
  
  // Settings State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('portal8_theme') || 'dark');
  const [cloak, setCloak] = useState(JSON.parse(localStorage.getItem('portal8_cloak')) || { id: 'default', title: 'Portal 8 - Arcade', icon: '/favicon.ico' });

  // Genre management
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [genreToRemove, setGenreToRemove] = useState('');
  const [gameToDelete, setGameToDelete] = useState(null);

  // Initialize Data
  useEffect(() => {
    setIsAppLoaded(true);
    let initialGames = GAMES_DATA;
    let initialCats = ['All', 'Action', 'Puzzle', 'Sports', 'Strategy', 'Retro', 'Idle'];
    const savedGames = localStorage.getItem('portal8_games');
    const savedCats = localStorage.getItem('portal8_cats');

    if (CONFIG_DATA) {
      if (Array.isArray(CONFIG_DATA.games)) {
        if (CONFIG_DATA.games.length > 0) initialGames = CONFIG_DATA.games;
        else if (savedGames) initialGames = JSON.parse(savedGames);
      }
      if (Array.isArray(CONFIG_DATA.categories)) {
        if (CONFIG_DATA.categories.length > 0) initialCats = ['All', ...CONFIG_DATA.categories.filter(c => c !== 'All')];
        else if (savedCats) initialCats = ['All', ...JSON.parse(savedCats).filter(c => c !== 'All')];
      }
    }

    setGames(initialGames);
    setCategories(initialCats);
    const savedFavs = localStorage.getItem('portal8_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // Sync Cloak and Theme
  useEffect(() => {
    document.title = cloak.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = cloak.icon;
  }, [cloak]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('portal8_theme', theme);
  }, [theme]);

  const handleCloakChange = (newCloak) => {
    setCloak(newCloak);
    localStorage.setItem('portal8_cloak', JSON.stringify(newCloak));
  };

  const toggleFavorite = (event, gameId) => {
    event.stopPropagation();
    const newFavs = favorites.includes(gameId) ? favorites.filter(id => id !== gameId) : [...favorites, gameId];
    setFavorites(newFavs);
    localStorage.setItem('portal8_favs', JSON.stringify(newFavs));
  };

  const handleSaveGame = (data) => {
    const id = editingGame ? editingGame.id : 'game_' + Date.now();
    const newGames = editingGame ? games.map(g => g.id === id ? { ...data, id } : g) : [...games, { ...data, id }];
    setGames(newGames);
    setShowGameForm(false);
    setEditingGame(null);
  };

  const filteredGames = useMemo(() => games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeCategory === 'All' || g.category === activeCategory)
  ), [games, searchQuery, activeCategory]);

  const popularGames = useMemo(() => games.filter(g => g.isPopular), [games]);
  const selectedGame = useMemo(() => games.find(g => g.id === selectedGameId), [selectedGameId, games]);

  const GameForm = () => {
    const [formData, setFormData] = useState(editingGame || { 
      title: '', htmlContent: '', url: '', sourceType: editingGame?.url ? 'url' : 'html', 
      category: categories[1] || 'Action', thumbnail: '', description: '', isPopular: false 
    });

    return e('div', { className: 'fixed inset-0 z-[110] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4' },
      e('div', { className: 'bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-fade-up overflow-y-auto max-h-[90vh]' },
        e('h2', { className: 'text-2xl font-bold text-white mb-6 font-logo' }, editingGame ? 'Edit Record' : 'Add To Library'),
        e('div', { className: 'space-y-6' },
          e('div', { className: 'grid grid-cols-2 gap-4' },
            e('input', { placeholder: 'Name', value: formData.title, onChange: v => setFormData({...formData, title: v.target.value}), className: 'w-full bg-slate-800 border-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500' }),
            e('select', { value: formData.category, onChange: v => setFormData({...formData, category: v.target.value}), className: 'w-full bg-slate-800 border-none p-4 rounded-xl text-white outline-none' }, 
              categories.filter(c => c !== 'All').map(c => e('option', { key: c, value: c }, c))
            )
          ),
          e('div', { className: 'flex p-1 bg-slate-950 rounded-xl' },
            e('button', { onClick: () => setFormData({...formData, sourceType: 'html'}), className: `flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.sourceType === 'html' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}` }, 'HTML CODE'),
            e('button', { onClick: () => setFormData({...formData, sourceType: 'url'}), className: `flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.sourceType === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}` }, 'EXTERNAL URL')
          ),
          formData.sourceType === 'html' ? 
            e('textarea', { placeholder: 'Paste HTML...', value: formData.htmlContent, onChange: v => setFormData({...formData, htmlContent: v.target.value}), className: 'w-full bg-slate-950 p-4 rounded-xl text-white h-48 font-mono text-[10px] outline-none border border-white/5' }) :
            e('input', { placeholder: 'https://...', value: formData.url, onChange: v => setFormData({...formData, url: v.target.value}), className: 'w-full bg-slate-950 p-4 rounded-xl text-white outline-none border border-white/5' }),
          e('input', { placeholder: 'Thumbnail URL', value: formData.thumbnail, onChange: v => setFormData({...formData, thumbnail: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white outline-none' }),
          e('textarea', { placeholder: 'Description', value: formData.description, onChange: v => setFormData({...formData, description: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white h-20 outline-none' })
        ),
        e('div', { className: 'flex gap-3 mt-8' },
          e('button', { onClick: () => { setShowGameForm(false); setEditingGame(null); }, className: 'flex-1 py-4 bg-slate-800 rounded-xl text-white font-bold' }, 'Cancel'),
          e('button', { onClick: () => handleSaveGame(formData), className: 'flex-1 py-4 bg-indigo-600 rounded-xl text-white font-bold' }, 'Save Changes')
        )
      )
    )
  };

  return e('div', { className: `min-h-screen flex flex-col transition-all duration-1000 main-app ${isAppLoaded ? 'opacity-100' : 'opacity-0'}` },
    e(Navbar, { onSearch: setSearchQuery, activeCategory, categories, onCategoryChange: setActiveCategory, onGoHome: () => { setActiveCategory('All'); setSearchQuery(''); setSelectedGameId(null); } }),
    
    // Actions Group (Top Right)
    e('div', { className: 'fixed top-6 right-6 z-[250] flex flex-col gap-3' },
      e('button', { onClick: () => setIsAiOpen(!isAiOpen), className: 'w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-110 transition-all border border-white/10 group' },
        e('svg', { className: 'w-7 h-7 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }))
      ),
      e('button', { onClick: () => setIsSettingsOpen(true), className: 'w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all border border-white/10 group' },
        e('svg', { className: 'w-7 h-7 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }), e('path', { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }))
      )
    ),

    e('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6' },
      isDevMode && e('div', { className: 'mb-12 p-8 glass rounded-[2.5rem] border border-indigo-500/30 flex items-center justify-between gap-6 animate-fade-up' },
        e('h3', { className: 'text-xl font-bold font-logo text-white' }, 'ADMIN PANEL'),
        e('div', { className: 'flex gap-3' },
          e('button', { onClick: () => setShowGenreModal(true), className: 'bg-slate-800 px-5 py-3 rounded-xl text-[10px] font-black' }, 'NEW GENRE'),
          e('button', { onClick: () => { setEditingGame(null); setShowGameForm(true); }, className: 'bg-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black shadow-lg shadow-indigo-600/30' }, 'ADD GAME'),
          e('button', { onClick: () => setIsDevMode(false), className: 'bg-slate-800 text-slate-500 px-5 py-3 rounded-xl text-[10px] font-black' }, 'EXIT')
        )
      ),
      
      !searchQuery && activeCategory === 'All' && popularGames.length > 0 && e('section', { className: 'mb-16 stagger-1 animate-fade-up' },
        e('h2', { className: 'text-2xl font-bold text-white font-logo tracking-tight mb-8' }, 'Trending Now'),
        e('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
          popularGames.map(game => e(GameCard, { 
            key: game.id, 
            game, 
            isFavorite: favorites.includes(game.id), 
            onToggleFavorite: toggleFavorite, 
            onPlay: setSelectedGameId, 
            isDevMode, 
            onEdit: () => { setEditingGame(game); setShowGameForm(true); }, 
            onDelete: () => setGameToDelete(game) 
          }))
        )
      ),
      
      e('section', { className: 'stagger-2 animate-fade-up' },
        e('div', { className: 'flex items-center justify-between mb-10 pb-4 border-b border-white/5' },
          e('h2', { className: 'text-2xl font-bold text-white font-logo' }, 
            searchQuery ? `SEARCH: ${searchQuery.toUpperCase()}` : `${activeCategory.toUpperCase()} COLLECTION`
          )
        ),
        e('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' },
          filteredGames.map((game, idx) => e(GameCard, { 
            key: game.id, 
            game, 
            isFavorite: favorites.includes(game.id), 
            onToggleFavorite: toggleFavorite, 
            onPlay: setSelectedGameId, 
            isDevMode, 
            onEdit: () => { setEditingGame(game); setShowGameForm(true); }, 
            onDelete: () => setGameToDelete(game),
            className: `stagger-${Math.min(idx + 1, 4)}`
          }))
        )
      )
    ),

    e(PortalAi, { isOpen: isAiOpen, onClose: () => setIsAiOpen(false), gamesList: games }),
    e(SettingsModal, { isOpen: isSettingsOpen, onClose: () => setIsSettingsOpen(false), currentTheme: theme, onThemeToggle: setTheme, currentCloak: cloak, onCloakChange: handleCloakChange }),
    selectedGame && e(GameViewer, { game: selectedGame, onClose: () => setSelectedGameId(null) })
  );
};

export default App;