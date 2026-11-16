import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
// Self-hosted Urbanist (variable weight, plus italic for the last line of the Highlights costs list)
import '@fontsource-variable/urbanist';
import '@fontsource-variable/urbanist/wght-italic.css';
import './styles/index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
