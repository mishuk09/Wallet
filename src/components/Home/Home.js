import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {

    const [businessData, setBusinessData] = useState(null); // State to store fetched business data
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Handle disconnected wallet
    const handleDisconnect = async () => {
        try {
            await disconnect(); // Call the disconnect function
            console.log("Wallet disconnected");
            setBusinessData(null); // Reset business data
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    // Fetch business data based on wallet address
    const fetchBusinessData = async () => {
        if (address) {
            try {
                const userDataCollection = collection(db, "stores");
                const q = query(userDataCollection, where("wallet_address", "==", address));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const businessInfo = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setBusinessData(businessInfo);
                } else {
                    console.log("No matching business found.");
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
            }
        }
    };

    useEffect(() => {
        fetchBusinessData();
    }, [address]); // Fetch data when the address changes


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
                <div className="flex justify-center mt-4 items-center space-x-4">
                    <div className="w-[200px]">
                        <a
                            href="/register"
                            className="w-full px-20 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2 rounded text-lg"
                        >
                            Start
                        </a>
                    </div>
                    <div className="w-auto">
                        {isConnected && (
                            <button
                                onClick={handleDisconnect}
                                className="w-[200px] bg-red-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-[7px] rounded text-lg"
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>

                {businessData && businessData.length > 0 ? (
                    <div className='mt-12'>

                        <h1 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
                            ✅  Your Business Verified
                        </h1>
                        {
                            businessData.map(business => (
                                <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg md-04'>
                                    <p className='font-bold'>{business.name}    </p>
                                    {
                                        business.business && (
                                            <>
                                                <p>🏠 <span className='font-semibold'>Address:</span>{business.business.address}</p>
                                                <p>📞 <span className='font-semibold'>Phone:</span>{business.business.phone}</p>
                                            </>
                                        )
                                    }

                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className='mt-12 text-center'>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            ⚠️ Your Business not verified. Let's verify it!
                        </h2>
                        <p className='mt-2  text-gray-600'>
                            Please ensure your wallet address is linked to a verified business.
                        </p>

                    </div>

                )}


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
