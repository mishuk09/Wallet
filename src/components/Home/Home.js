import React from 'react';
import underimg from './img/underimg.png';

const Home = () => {
    return (
        <div className='w-full relative min-h-screen flex flex-col items-center bg-gray-100'>
            {/* Wallet Connect Section */}
            <div className='absolute p-4 top-2 right-2'>
                <button className='bg-blue-500 text-sm text-white px-4 py-2 rounded-md'>
                    Wallet Connect
                </button>
            </div>

            {/* Main Content */}
            <div className='flex flex-col items-center justify-center mt-24'>
                {/* Home Title */}
                <h1 className='text-5xl font-bold text-gray-800'>
                👋 Welcome to Crypto
                    <span className='text-blue-600 inline-block'>
                        Wallet
                        {/* Image Below Wallet Text */}
                        <div className='mt-[-10px]'>
                            <img src={underimg} alt="Under Image" className='w-[200px] h-auto' />
                        </div>
                    </span>
                </h1>

                {/* Description */}
                <p className='text-gray-600 mt-6 font-semibold text-sm mb-4 px-4 text-center'>
                    Connect your wallet to start interacting with your crypto assets.
                </p>

                {/* Start Registration Button */}
                <button className='bg-blue-500 hover:bg-blue-600 duration-75 text-white mt-6 px-10 py-3 rounded-md text-lg mb-10'>
                    Start
                </button>
            </div>
        </div>
    );
};

export default Home;
