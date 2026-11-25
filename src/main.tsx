import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import type { BeforeInstallPromptEvent } from './hooks/usePWAInstall';

// Capture beforeinstallprompt early so it is never missed during the splash screen
window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  window.__deferredPwaPrompt = e as BeforeInstallPromptEvent;
});

// Register PWA service worker for standalone mobile installation & offline support
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
