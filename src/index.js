import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mainnet, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//include all the chain that we need,
const chains = [mainnet, sepolia, polygon, optimism, arbitrum, base];

//Wallet cloud projects ID if need then
const projectId = "your-project-id-here";

//create the WAGMI config

const config = getDefaultConfig({
  appName: 'Your App Name',
  projectId,
  chains,
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>

        <RainbowKitProvider chains={chains}>

          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
