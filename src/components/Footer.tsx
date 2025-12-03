import React from 'react';

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="app-footer">
      <p>
        Built with Antigravity • Node.js v22.21.0 • npm 11.6.4
      </p>
      <p className="footer-links">
        <span>🔗 <a href="https://antigravity.google" target="_blank" rel="noopener noreferrer">Documentation</a></span>
        <span>•</span>
        <span>🚀 <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase</a></span>
      </p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
