import ReactDOM from 'react-dom/client';
import React from 'react';

import App from './App.tsx';

import './global.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />,
  </React.StrictMode>,
);
