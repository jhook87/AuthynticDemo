import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.css';

const container = document.getElementById('root');

if (container) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    container
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((error) => console.error('Service worker registration failed', error));
  });
}
