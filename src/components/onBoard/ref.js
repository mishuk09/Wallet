import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mainnet, sepolia, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Include all the chains you want to use
const chains = [mainnet, sepolia, polygon, optimism, arbitrum, base];

// WalletConnect Cloud projectId
const projectId = "your_project_id_here"; // Replace with your actual WalletConnect projectId

// Create the WAGMI config
const config = getDefaultConfig({
    appName: "My DApp",
    projectId, // WalletConnect projectId for v2 functionality
    chains,
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                {/* RainbowKitProvider with Base chain as default */}
                <RainbowKitProvider chains={chains} initialChain={base}>
                    <App />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();






// Get the connected account using wagmi
const { address, isConnected, chain } = useAccount(); // Use the useAccount hook

// Handle claim business and save to Firestore
const handleClaimBusiness = async () => {
    setLoading(true);
    if (selectedBusiness) {
        try {
            const userDataCollection = collection(db, "stores");
            const businessDocRef = doc(userDataCollection);
            const storeId = businessDocRef.id;

            // Save the business claim data with wallet info
            await setDoc(businessDocRef, {
                business: selectedBusiness,
                onboardingStep: 2,
                storeId,
                wallet_chain: chain?.name, // Save wallet chain name
                wallet_address: address // Save wallet address
            });

            setIsBusinessClaimed(true);
            console.log("Business claimed and saved to Firestore with store ID:", storeId);

            if (onBusinessClaimed) {
                onBusinessClaimed({ ...selectedBusiness, storeId }); // Pass store ID to parent
            }

            setStoreId(storeId);
        } catch (error) {
            console.error("Error storing business data in Firestore:", error);
        } finally {
            setLoading(false);
        }
    }
};


{
    step === 3 && (
        <div className="text-start relative mt-14">
            <h2 className="text-2xl font-semibold mb-4">Connect a crypto wallet</h2>
            <p className="text-gray-500 mb-2">👋 This will be your wallet address for USDC payments</p>

            <div className="mt-10">
                <ConnectButton />
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={handlePrevious}
                    type="button"
                    className="btn-style w-1/4 rounded">Previous</button>

                <button
                    onClick={handleClaimBusiness} // Call handleClaimBusiness on button click
                    className={`btn-style w-1/4 rounded ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isConnected}
                >
                    Next
                </button>
            </div>
        </div>
    )
}