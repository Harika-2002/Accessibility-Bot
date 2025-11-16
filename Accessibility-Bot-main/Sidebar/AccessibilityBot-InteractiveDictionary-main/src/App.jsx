import React, { useContext } from 'react'
import Main from './components/Main/Main'
import { Context } from './context/Context'
import './App.css'
import logo from './components/Sidebar/bot.jpeg'

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(Context);

  // Derive locale and direction for basic localization support
  const locale = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en';
  const langPrefix = locale.split('-')[0];
  const rtlLangs = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLangs.includes(langPrefix);

  return (
    // Keep full width by default but set lang/dir attributes for localization
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`} lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="app-header" role="banner">
        <div className="brand">
          <img src={logo} alt="Accessibility bot logo" />
          <div>
            <strong>Accessibility Bot</strong>
          </div>
        </div>

        <div>
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="app-body">
        <Main />
      </div>
    </div>
  )
}

export default App
