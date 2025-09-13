import { RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import React from 'react';

import { router } from './router';

import './styles/globals.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);