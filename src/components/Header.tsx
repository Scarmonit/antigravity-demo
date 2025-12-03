import React from 'react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ theme, toggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>🚀 Antigravity Demo</h1>
        <p className="subtitle">
          Production-ready web application built with Antigravity IDE
        </p>
      </div>
      <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
