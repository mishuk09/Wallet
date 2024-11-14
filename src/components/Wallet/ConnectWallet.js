import React, { useState } from "react";
import { ethers } from "ethers"; // Import ethers
import { db } from "../Firebase/firebase"; // Correct the import path
import { collection, setDoc, doc } from "firebase/firestore"; // Correct Firestore imports

const ConnectWallet = ({ onWalletConnected }) => {
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState('');
    const [walletNotDetected, setWalletNotDetected] = useState(false); // Add state for checking MetaMask

    const connectWallet = async () => {
        if (window.ethereum) {
            setWalletNotDetected(false); // Reset the wallet not detected state when MetaMask is found
            try {
                // Initialize provider using the Ethereum provider
                const provider = new ethers.providers.Web3Provider(window.ethereum); // Use Web3Provider here
                console.log('detected');

                // Request accounts
                await provider.send("eth_requestAccounts", []);

                // Get signer and wallet address
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setWalletAddress(address);

                // Save to db (Firestore)
                const userDocRef = doc(db, "users", address); // Reference to the user document
                await setDoc(userDocRef, {
                    walletAddress: address,
                    onboardingStep: 1,
                });

                // Notify parent component
                onWalletConnected(address);
            } catch (error) {
                console.error('Error connecting to wallet:', error);
                alert('Error connecting to wallet');
            }
        } else {
            setWalletNotDetected(true); // Set state to show the message when MetaMask is not detected
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                onClick={connectWallet}
                className="flex items-center justify-center px-6 w-1/2 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Connect Wallet
                <img
                    src="https://images.ctfassets.net/9sy2a0egs6zh/1aBiNLUwIFbHSCkLHZHNHx/b67214bf14b6c8cb721ce0acb60ef51c/Snaps-Security-Fox.svg"
                    alt="MetaMask Icon"
                    className="ml-2 h-6 w-6"  // `ml-2` adds margin to the left of the icon to give space between the text and icon
                />
            </button>
            {walletAddress && <p className="mt-4 text-xl text-gray-700"><span className="font-bold">Wallet Connected:</span> {walletAddress}</p>}
            {walletNotDetected && (
                <p className="mt-4 text-xl text-red-600">
                    Add MetaMask Wallet in your Browser to connect.
                </p>
            )}
        </div>
    );
};

export default ConnectWallet;
