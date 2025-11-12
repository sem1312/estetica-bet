import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./app.jsx"; // Importa tu componente principal App
import './index.css'; // Asegúrate de tener este archivo para los estilos de Tailwind

// Aquí le decimos a React que monte el componente <App />
// en el div con id="root" de tu index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);