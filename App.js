import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from './data/games.js';
import { CONFIG_DATA } from './data/config.js';
import Navbar from './components/Navbar.js';
import GameCard from './components/GameCard.js';
import GameViewer from './components/GameViewer.js';
import PortalAi from './components/PortalAi.js';

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
  
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [genreToRemove, setGenreToRemove] = useState('');
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

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

  useEffect(() => {
    if (isAppLoaded) {
      localStorage.setItem('portal8_games', JSON.stringify(games));
      localStorage.setItem('portal8_cats', JSON.stringify(categories.filter(c => c !== 'All')));
    }
  }, [games, categories, isAppLoaded]);

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
    localStorage.setItem('portal8_favs', JSON.stringify(newFavs));
  };

  const handleSaveGame = (data) => {
    const id = editingGame ? editingGame.id : 'game_' + Date.now();
    const newGames = editingGame ? games.map(g => g.id === id ? { ...data, id } : g) : [...games, { ...data, id }];
    setGames(newGames);
    setShowGameForm(false);
    setEditingGame(null);
  };

  const exportConfig = () => {
    const configObj = { games, categories: categories.filter(c => c !== 'All') };
    const code = `export const CONFIG_DATA = ${JSON.stringify(configObj, null, 2)};`;
    navigator.clipboard.writeText(code);
    setShowExportModal(true);
  };

  const filteredGames = useMemo(() => games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeCategory === 'All' || g.category === activeCategory)
  ), [games, searchQuery, activeCategory]);

  const popularGames = useMemo(() => games.filter(g => g.isPopular), [games]);
  const selectedGame = useMemo(() => games.find(g => g.id === selectedGameId), [selectedGameId, games]);

  const GameForm = () => {
    const [formData, setFormData] = useState(editingGame || { 
      title: '', 
      htmlContent: '', 
      url: '', 
      sourceType: editingGame?.url ? 'url' : 'html', 
      category: categories[1] || 'Action', 
      thumbnail: '', 
      description: '', 
      isPopular: false 
    });

    return e('div', { className: 'fixed inset-0 z-[110] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4' },
      e('div', { className: 'bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-fade-up overflow-y-auto max-h-[90vh]' },
        e('h2', { className: 'text-2xl font-bold text-white mb-6 font-logo' }, editingGame ? 'Edit Record' : 'Add To Library'),
        e('div', { className: 'space-y-6' },
          e('div', { className: 'grid grid-cols-2 gap-4' },
            e('div', { className: 'space-y-2' },
              e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Game Title'),
              e('input', { placeholder: 'Name', value: formData.title, onChange: v => setFormData({...formData, title: v.target.value}), className: 'w-full bg-slate-800 border-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500' })
            ),
            e('div', { className: 'space-y-2' },
              e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Category'),
              e('select', { value: formData.category, onChange: v => setFormData({...formData, category: v.target.value}), className: 'w-full bg-slate-800 border-none p-4 rounded-xl text-white outline-none' }, 
                categories.filter(c => c !== 'All').map(c => e('option', { key: c, value: c }, c))
              )
            )
          ),
          
          e('div', { className: 'space-y-2' },
            e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Source Type'),
            e('div', { className: 'flex p-1 bg-slate-950 rounded-xl' },
              e('button', { 
                onClick: () => setFormData({...formData, sourceType: 'html'}),
                className: `flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.sourceType === 'html' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`
              }, 'HTML CODE'),
              e('button', { 
                onClick: () => setFormData({...formData, sourceType: 'url'}),
                className: `flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.sourceType === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`
              }, 'EXTERNAL URL')
            )
          ),

          formData.sourceType === 'html' ? 
            e('div', { className: 'space-y-2' },
              e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'HTML Content'),
              e('textarea', { placeholder: 'Paste your HTML here...', value: formData.htmlContent, onChange: v => setFormData({...formData, htmlContent: v.target.value}), className: 'w-full bg-slate-950 p-4 rounded-xl text-white h-48 font-mono text-[10px] outline-none border border-white/5' })
            ) :
            e('div', { className: 'space-y-2' },
              e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Game URL (Google Sites, Scratch, etc)'),
              e('input', { placeholder: 'https://example.com/game', value: formData.url, onChange: v => setFormData({...formData, url: v.target.value}), className: 'w-full bg-slate-950 p-4 rounded-xl text-white outline-none border border-white/5' })
            ),

          e('div', { className: 'space-y-2' },
            e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Thumbnail Image URL'),
            e('input', { placeholder: 'Image URL', value: formData.thumbnail, onChange: v => setFormData({...formData, thumbnail: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white outline-none' })
          ),
          
          e('div', { className: 'space-y-2' },
            e('label', { className: 'text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1' }, 'Short Description'),
            e('textarea', { placeholder: 'What is this game about?', value: formData.description, onChange: v => setFormData({...formData, description: v.target.value}), className: 'w-full bg-slate-800 p-4 rounded-xl text-white h-20 outline-none' })
          ),

          e('label', { className: 'flex items-center gap-3 text-slate-300 cursor-pointer select-none' },
            e('input', { type: 'checkbox', className: 'w-5 h-5 rounded accent-indigo-500', checked: formData.isPopular, onChange: v => setFormData({...formData, isPopular: v.target.checked}) }),
            e('span', { className: 'text-sm font-medium' }, 'Feature this game on Trending')
          )
        ),
        e('div', { className: 'flex gap-3 mt-8' },
          e('button', { onClick: () => { setShowGameForm(false); setEditingGame(null); }, className: 'flex-1 py-4 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700 transition-all' }, 'Cancel'),
          e('button', { 
            onClick: () => {
              const finalData = {...formData};
              if (finalData.sourceType === 'html') finalData.url = '';
              else finalData.htmlContent = '';
              handleSaveGame(finalData);
            }, 
            className: 'flex-1 py-4 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20' 
          }, 'Save Changes')
        )
      )
    )
  };

  return e('div', { className: `min-h-screen flex flex-col transition-opacity duration-1000 ${isAppLoaded ? 'opacity-100' : 'opacity-0'}` },
    e(Navbar, { onSearch: setSearchQuery, activeCategory, categories, onCategoryChange: setActiveCategory, onGoHome: () => { setActiveCategory('All'); setSearchQuery(''); setSelectedGameId(null); } }),
    e('button', { onClick: () => setIsAiOpen(!isAiOpen), className: 'fixed top-6 right-6 z-[250] w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-110 transition-all active:scale-95 group border border-white/10' },
      e('div', { className: 'absolute inset-0 rounded-2xl bg-indigo-500 animate-ping opacity-20 pointer-events-none' }),
      e('svg', { className: 'w-7 h-7 text-white group-hover:rotate-12 transition-transform', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
        e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
      )
    ),
    e('main', { className: 'flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6' },
      isDevMode && e('div', { className: 'mb-12 p-8 glass rounded-[2.5rem] border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-6 animate-fade-up' },
        e('div', { className: 'flex items-center gap-5' },
          e('div', { className: 'w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float' }, 
            e('svg', { className: 'h-8 w-8 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2.5 }, e('path', { d: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }))
          ),
          e('div', null, e('h3', { className: 'text-xl font-bold text-white font-logo' }, 'ADMIN PANEL'))
        ),
        e('div', { className: 'flex flex-wrap justify-center gap-3' },
          e('button', { onClick: () => setShowGenreModal(true), className: 'bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl text-[10px] font-black tracking-widest transition-colors' }, 'NEW GENRE'),
          e('button', { onClick: () => setShowRemoveModal(true), className: 'bg-rose-900/40 text-rose-400 hover:bg-rose-900/60 px-5 py-3 rounded-xl text-[10px] font-black tracking-widest transition-colors' }, 'REMOVE GENRE'),
          e('button', { onClick: () => { setEditingGame(null); setShowGameForm(true); }, className: 'bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-[10px] font-black shadow-lg shadow-indigo-600/30 tracking-widest transition-all' }, 'ADD GAME'),
          e('button', { onClick: exportConfig, className: 'bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-colors' }, 'EXPORT CONFIG'),
          e('button', { onClick: () => setIsDevMode(false), className: 'bg-slate-800 text-slate-500 px-5 py-3 rounded-xl text-[10px] font-black tracking-widest transition-colors' }, 'EXIT')
        )
      ),
      !searchQuery && activeCategory === 'All' && popularGames.length > 0 && e('section', { className: 'mb-16 stagger-1 animate-fade-up' },
        e('h2', { className: 'text-2xl font-bold text-white font-logo tracking-tight mb-8' }, 'Trending Now'),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          popularGames.map(game => e(GameCard, { 
            key: game.id, game, isFavorite: favorites.includes(game.id), 
            onToggleFavorite: toggleFavorite, onPlay: setSelectedGameId,
            isDevMode, 
            onEdit: (ev) => { ev.stopPropagation(); setEditingGame(game); setShowGameForm(true); },
            onDelete: (ev) => { ev.stopPropagation(); setGameToDelete(game); }
          }))
        )
      ),
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
            isDevMode, 
            onEdit: (ev) => { ev.stopPropagation(); setEditingGame(game); setShowGameForm(true); },
            onDelete: (ev) => { ev.stopPropagation(); setGameToDelete(game); },
            className: `stagger-${Math.min(idx + 1, 4)}`
          }))
        ) : e('div', { className: 'text-center py-24 text-slate-700 font-logo text-sm' }, 'NO RESULTS FOUND')
      )
    ),
    e('footer', { className: 'bg-slate-900/40 border-t border-white/5 py-16 px-6 mt-20' },
      e('div', { className: 'max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10' },
        e('div', null,
          e('div', { className: 'font-logo font-bold text-indigo-500 text-2xl mb-2' }, 'PORTAL 8'),
          e('p', { className: 'text-slate-500 text-xs max-w-sm tracking-wide' }, 'High-performance unblocked gaming ecosystem.')
        ),
        e('button', { onClick: () => setShowDevLogin(true), className: 'text-[9px] font-black text-slate-700 hover:text-indigo-500 transition-all tracking-widest' }, 'SYSTEM LOGIN')
      )
    ),
    showDevLogin && e('div', { className: 'fixed inset-0 z-[120] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-up' },
      e('div', { className: 'bg-slate-900 border border-indigo-500/20 p-10 rounded-[2.5rem] w-full max-sm shadow-2xl' },
        e('div', { className: 'text-center mb-10' },
          e('div', { className: 'w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl' }, 
             e('svg', { className: 'h-10 w-10 text-white', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }))
          ),
          e('h3', { className: 'text-xl font-bold text-white font-logo' }, 'Security Gate')
        ),
        e('input', { type: 'password', placeholder: 'ACCESS KEY', value: devPassword, onChange: v => setDevPassword(v.target.value), onKeyPress: (ev) => ev.key === 'Enter' && handleDevLogin(), className: 'w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-white mb-6 text-center tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none transition-all' }),
        e('div', { className: 'flex flex-col gap-2' },
          e('button', { onClick: handleDevLogin, className: 'w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-500 transition-all' }, 'UNLOCK'),
          e('button', { onClick: () => { setShowDevLogin(false); setDevPassword(''); }, className: 'w-full py-3 text-slate-500 font-bold text-[10px] hover:text-white transition-all' }, 'CANCEL')
        )
      )
    ),
    showExportModal && e('div', { className: 'fixed inset-0 z-[130] bg-slate-950/95 flex items-center justify-center p-6' },
      e('div', { className: 'bg-slate-900 border border-emerald-500/30 p-10 rounded-[2.5rem] w-full max-w-md animate-fade-up shadow-2xl shadow-emerald-500/10' },
        e('h3', { className: 'text-2xl font-bold text-white font-logo mb-4' }, 'Config Copied!'),
        e('p', { className: 'text-slate-400 text-sm mb-6 leading-relaxed' }, 'Paste the code into data/config.js to update the site for everyone permanently.'),
        e('button', { onClick: () => setShowExportModal(false), className: 'w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-500 transition-all' }, 'OK')
      )
    ),
    showGenreModal && e('div', { className: 'fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6' },
      e('div', { className: 'bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-fade-up' },
        e('h3', { className: 'text-2xl font-bold text-white font-logo mb-6' }, 'New Genre'),
        e('input', { autoFocus: true, placeholder: 'Genre Name', value: newGenreName, onChange: v => setNewGenreName(v.target.value), onKeyDown: (ev) => ev.key === 'Enter' && handleConfirmAddGenre(), className: 'w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white mb-6 outline-none focus:ring-2 focus:ring-indigo-500 transition-all' }),
        e('div', { className: 'flex gap-3' },
          e('button', { onClick: () => setShowGenreModal(false), className: 'flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700' }, 'Cancel'),
          e('button', { onClick: () => {
            const cleanName = newGenreName.trim();
            if (!cleanName) return;
            if (categories.some(c => c.toLowerCase() === cleanName.toLowerCase())) return alert("This genre already exists.");
            setCategories(prev => [...prev, cleanName]);
            setNewGenreName('');
            setShowGenreModal(false);
          }, className: 'flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-50 shadow-lg shadow-indigo-600/20' }, 'Create')
        )
      )
    ),
    showRemoveModal && e('div', { className: 'fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6' },
      e('div', { className: 'bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-fade-up' },
        e('h3', { className: 'text-2xl font-bold text-white font-logo mb-6' }, 'Remove Genre'),
        e('select', { value: genreToRemove, onChange: v => setGenreToRemove(v.target.value), className: 'w-full bg-slate-800 border border-white/5 p-4 rounded-2xl text-white mb-6 outline-none focus:ring-2 focus:ring-rose-500 transition-all' },
          e('option', { value: '' }, 'Select a genre...'),
          categories.filter(c => c !== 'All').map(cat => e('option', { key: cat, value: cat }, cat))
        ),
        e('div', { className: 'flex gap-3' },
          e('button', { onClick: () => setShowRemoveModal(false), className: 'flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700' }, 'Cancel'),
          e('button', { onClick: () => {
            if (!genreToRemove) return;
            setCategories(prev => prev.filter(c => c !== genreToRemove));
            if (activeCategory === genreToRemove) setActiveCategory('All');
            setGenreToRemove('');
            setShowRemoveModal(false);
          }, className: 'flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-500 shadow-lg shadow-rose-600/20' }, 'Remove')
        )
      )
    ),
    gameToDelete && e('div', { className: 'fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6' },
      e('div', { className: 'bg-slate-900 border border-rose-500/20 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-fade-up text-center' },
        e('div', { className: 'w-20 h-20 bg-rose-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500 pulse-glow' }, e('svg', { className: 'h-10 w-10', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }, e('path', { d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }))),
        e('h3', { className: 'text-2xl font-bold text-white font-logo mb-2' }, 'Purge Record?'),
        e('div', { className: 'flex flex-col gap-3 mt-8' },
          e('button', { onClick: () => { setGames(prev => prev.filter(g => g.id !== gameToDelete.id)); setGameToDelete(null); }, className: 'w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-rose-500 transition-all' }, 'DELETE PERMANENTLY'),
          e('button', { onClick: () => setGameToDelete(null), className: 'w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold text-xs hover:bg-slate-700 transition-all' }, 'CANCEL')
        )
      )
    ),
    showGameForm && e(GameForm),
    selectedGame && e(GameViewer, { game: selectedGame, onClose: () => setSelectedGameId(null) }),
    e(PortalAi, { isOpen: isAiOpen, onClose: () => setIsAiOpen(false), gamesList: games })
  );
};

export default App;