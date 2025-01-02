import React from 'react';
import ReactDOM from 'react-dom'; // Use ReactDOM from react-dom in React 17
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Use ReactDOM.render for React 17
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Target the root element
);
reportWebVitals();
