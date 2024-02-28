import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);


root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}
