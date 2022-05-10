import React from 'react';
import { createRoot } from 'react-dom/client';
import { NakupniSeznam } from './components/NakupniSeznam';
import './style.css';

const App = () => (
  <div className="container">
    <NakupniSeznam/>
  </div>
);

createRoot(
  document.querySelector('#app')
).render(<App />);
