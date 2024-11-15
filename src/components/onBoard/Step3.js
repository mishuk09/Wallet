import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi"; // Wagmi hooks for wallet connection
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import { collection, doc, setDoc } from "firebase/firestore"; // Firebase methods

const Step3 = ({ storeId, handleNext }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletChain, setWalletChain] = useState("Base");
    const [loading, setLoading] = useState(false);

    // Wagmi hooks
    const { isConnected, address, connector } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    // Use the wallet address from Wagmi if connected
    useEffect(() => {
        if (address) {
            setWalletAddress(address);
        }
    }, [address]);

    const handleSaveWalletData = async () => {
        if (!storeId || !walletAddress || !walletChain) {
            console.error("Missing data. Make sure all fields are filled.");
            return;
        }

        try {
            const usersCollection = collection(db, "users");

            // Use the same storeId as the document ID for consistency
            const userDocRef = doc(usersCollection, storeId);

            // Save wallet address and chain to Firestore
            await setDoc(userDocRef, {
                wallet_address: walletAddress,
                wallet_chain: walletChain
            }, { merge: true });

            console.log("Wallet data saved successfully with store ID:", storeId);
            handleNext(); // Move to next step
        } catch (error) {
            console.error("Error saving wallet data to Firestore:", error);
        }
    };

    const isFormValid = walletAddress && walletChain === "Base";

    return (
        <div className="text-start relative mt-14">
            <h2 className="text-2xl font-semibold mb-4">
                Connect Your Crypto Wallet
            </h2>
            <p className="text-gray-500 mb-2">👋 This will be your wallet address for USDC payments</p>

            <div className="flex justify-center mt-6">
                {/* Connect Button using RainbowKit */}
                <ConnectButton />
            </div>

            {isConnected && walletAddress && (
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700">Your wallet address:</p>
                    <p className="text-blue-600">{walletAddress}</p>
                    <p className="mt-2 text-sm text-gray-500">Selected Chain: {walletChain}</p>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={handleSaveWalletData}
                    className={`btn-style w-1/4 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isFormValid}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step3;
