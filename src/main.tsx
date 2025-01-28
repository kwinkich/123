import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/kwinkich/dywe-manifest/refs/heads/main/manifest.json">
            <App />
        </TonConnectUIProvider>
    </StrictMode>,
);
