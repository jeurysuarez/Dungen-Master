import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Los estilos ahora se gestionan directamente en index.html a través del CDN de Tailwind.
// import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);