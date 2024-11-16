import React, { useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

const Home = () => {
    const [isBusinessClaimed, setIsBusinessClaimed] = useState(false); // Track claim status
    const { address, isConnected, chain } = useAccount();
    const { disconnect } = useDisconnect();

    //handle dinconnected wallet
    const handleDisconnect = async () => {
        try {
            await disconnect(); // Call the disconnect function
            console.log("Wallet disconnected");
            setIsBusinessClaimed(false); // Reset any relevant state if needed
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    return (
        <div className='w-full relative min-h-screen flex flex-col items-center bg-gray-100'>
            {/* Wallet Connect Section */}
            <div className='absolute  p-4 top-2 right-2'>

                <div className='flex'>
                    <div>
                        <ConnectButton />
                    </div>
                    <div>

                        {isConnected && (
                            <button
                                onClick={handleDisconnect}
                                className="bg-white rounded-xl py-2 px-4  text-base font-semibold  ml-4  ms-3"
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex flex-col items-center justify-center mt-36'>
                {/* Home Title */}
                <h1 className='text-5xl font-bold text-gray-800'>
                    👋 Welcome to Crypto
                    <span className='text-blue-600 inline-block'>
                        Wallet
                        {/* Image Below Wallet Text */}
                        <div className='mt-[-10px]'>
                            <img src={underimg} alt="undereffect" className='w-[200px] h-auto' />
                        </div>
                    </span>
                </h1>

                {/* Description */}
                <p className='text-gray-600 mt-4 font-semibold text-sm mb-4 px-4 text-center'>
                    Connect your wallet to start interacting with your crypto assets.
                </p>

                {/* Start Registration Button */}
                <a href='/register' className='mt-4 w-1/4 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2   rounded text-lg '>
                    Start
                </a>

                {/* Verified Businesses Map Section */}
                <div className='w-full mt-12 mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                        Verified Businesses Near You
                    </h2>
                    {/* Map Container */}
                    <div className='w-full h-[400px] bg-white rounded-lg shadow-lg'>
                        {/* Replace this with an actual map, e.g., Google Maps */}
                        <p className='text-center text-gray-600 py-16'>Map will be displayed here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
