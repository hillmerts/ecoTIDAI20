import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { createRootStore } from 'stores';

const store = createRootStore();

const container = document.getElementById('root')!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
    <BrowserRouter>
      <App store={store} />
    </BrowserRouter>
  </React.StrictMode>
);