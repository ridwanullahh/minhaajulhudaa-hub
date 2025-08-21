import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAllPlatforms } from './lib/platform-db.ts';

const rootElement = document.getElementById('root');

// A simple function to render the app
const renderApp = () => {
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
};

// Check if initialization has been done
const isInitialized = localStorage.getItem('db_initialized_v2');

if (!isInitialized) {
    // Show a basic loading message while the database sets up for the first time
    if (rootElement) {
        rootElement.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h2>Setting up Platform for the First Time...</h2><p>This may take a moment.</p></div>';
    }

    initializeAllPlatforms().then(() => {
        localStorage.setItem('db_initialized_v2', 'true');
        renderApp();
    }).catch(error => {
        if (rootElement) {
            rootElement.innerHTML = `<div style="color:red; text-align:center; padding: 2rem;"><h2>Initialization Failed</h2><p>${error.message}</p></div>`;
        }
    });
} else {
    // If already initialized, render the app immediately
    renderApp();
}
