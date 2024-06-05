import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ColorModeScript } from '@node-real/uikit';
import { theme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript {...theme.config} />
    <App />
  </React.StrictMode>
);
