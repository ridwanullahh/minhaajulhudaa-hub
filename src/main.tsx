import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render the app. Database initialization runs inside App's useEffect
// so the UI loads immediately and initializes in the background.
createRoot(document.getElementById("root")!).render(<App />);
