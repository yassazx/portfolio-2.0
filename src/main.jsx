import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/mona-sans';
import '@fontsource-variable/bodoni-moda';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
