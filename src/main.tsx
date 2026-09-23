import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
//funciones , configuraciones y demas cosas que se necesiten para el proyecto
