import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAllPlatforms } from './lib/platform-db.ts';

// Initialize the database for all platforms
console.log("Initializing database collections...");
initializeAllPlatforms().then(() => {
  console.log("Database initialization complete.");
  createRoot(document.getElementById("root")!).render(<App />);
}).catch(error => {
    console.error("Database initialization failed:", error);
    // Optionally, render an error message to the user
    createRoot(document.getElementById("root")!).render(
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Fatal Error</h1>
        <p>Could not initialize the database. Please check the console for details.</p>
      </div>
    );
});
