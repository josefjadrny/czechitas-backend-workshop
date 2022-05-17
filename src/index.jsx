import React from 'react';
import { createRoot } from 'react-dom/client';
import { SeznamKnizek } from './components/SeznamKnizek';
import { NakupniSeznam } from './components/NakupniSeznam';
import './style.css';

const App = () => (
  <div className="container">
    <NakupniSeznam/>
    <SeznamKnizek/>
  </div>
);

createRoot(
  document.querySelector('#app')
).render(<App />);
