import React, { useState } from 'react';

const e = React.createElement;

const SettingsModal = ({ isOpen, onClose, currentTheme, onThemeToggle, currentCloak, onCloakChange }) => {
  if (!isOpen) return null;

  const cloakOptions = [
    { id: 'default', name: 'Default', title: 'Portal 8 - Arcade', icon: '/favicon.ico' },
    { id: 'google', name: 'Google', title: 'Google', icon: 'https://www.google.com/favicon.ico' },
    { id: 'classroom', name: 'Classroom', title: 'Classes', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
    { id: 'drive', name: 'Drive', title: 'My Drive - Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' }
  ];

  return e('div', { className: 'fixed inset-0 z-[400] bg-black/40 backdrop-blur-sm flex items-center justify-end p-4' },
    e('div', { className: 'w-full max-w-sm h-full max-h-[600px] glass rounded-[2.5rem] border border-white/10 shadow-2xl animate-fade-left flex flex-col overflow-hidden' },
      // Header
      e('div', { className: 'p-8 border-b border-white/5 flex items-center justify-between' },
        e('h2', { className: 'text-xl font-bold text-white font-logo' }, 'SETTINGS'),
        e('button', { onClick: onClose, className: 'text-slate-400 hover:text-white transition-colors' },
          e('svg', { className: 'w-6 h-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' }))
        )
      ),

      // Content
      e('div', { className: 'flex-1 overflow-y-auto p-8 space-y-10' },
        
        // Theme Section
        e('div', { className: 'space-y-4' },
          e('h3', { className: 'text-[10px] font-black tracking-widest text-indigo-400 uppercase' }, 'Visual Experience'),
          e('div', { className: 'flex p-1 bg-black/20 rounded-2xl border border-white/5' },
            e('button', { 
              onClick: () => onThemeToggle('dark'),
              className: `flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${currentTheme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`
            }, 
              e('svg', { className: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, e('path', { d: 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' })),
              e('span', { className: 'text-xs font-bold' }, 'Dark')
            ),
            e('button', { 
              onClick: () => onThemeToggle('light'),
              className: `flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${currentTheme === 'light' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`
            },
              e('svg', { className: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, e('path', { fillRule: 'evenodd', d: 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z', clipRule: 'evenodd' })),
              e('span', { className: 'text-xs font-bold' }, 'Light')
            )
          )
        ),

        // Tab Cloak Section
        e('div', { className: 'space-y-4' },
          e('h3', { className: 'text-[10px] font-black tracking-widest text-indigo-400 uppercase' }, 'Stealth Mode'),
          e('div', { className: 'grid grid-cols-1 gap-2' },
            cloakOptions.map(option => e('button', {
              key: option.id,
              onClick: () => onCloakChange(option),
              className: `w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${currentCloak.id === option.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'}`
            },
              e('div', { className: 'flex items-center gap-3' },
                e('img', { src: option.icon, className: 'w-5 h-5 rounded', alt: '' }),
                e('span', { className: 'text-xs font-bold' }, option.name)
              ),
              currentCloak.id === option.id && e('div', { className: 'w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50' })
            ))
          )
        )
      ),

      // Footer
      e('div', { className: 'p-8 border-t border-white/5 bg-black/20 text-center' },
        e('p', { className: 'text-[9px] font-black text-slate-600 tracking-widest' }, 'PORTAL 8 CORE V2.1.0')
      )
    )
  );
};

export default SettingsModal;