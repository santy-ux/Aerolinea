import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@materializecss/materialize/dist/css/materialize.min.css';
import '../css/variables.css';
import '../css/base.css';
import '../css/navbar.css';
import '../css/hero.css';
import '../css/features.css';
import '../css/waitlist.css';
import '../css/footer.css';
import '../js/theme-toggle.js';
import '../js/scroll-animations.js';
import '../js/mobile-menu.js';
import '../js/particle-background.js';
import '../js/main.js';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
