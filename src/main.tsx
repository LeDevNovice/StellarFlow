import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import App from './App';
import './index.css';

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
  <StrictMode>  
    <App />
  </StrictMode>);
}
