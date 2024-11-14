import React, { useState } from "react";
import { ethers } from "ethers"; // Import ethers
import { db } from "../Firebase/firebase"; // Correct the import path
import { collection, setDoc, doc } from "firebase/firestore"; // Correct Firestore imports

const ConnectWallet = ({ onWalletConnected }) => {
    const [walletAddress, setWalletAddress] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
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
            alert("Please install a crypto wallet like MetaMask.");
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
            {walletAddress && <p>Wallet Connected: {walletAddress}</p>}
        </div>
    );
};

export default ConnectWallet;
