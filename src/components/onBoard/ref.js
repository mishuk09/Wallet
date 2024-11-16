import { getDoc } from 'firebase/firestore';


const [businessAddress, setBusinessAddress] = useState("");
const [businessPhone, setBusinessPhone] = useState("");


const fetchBusinessData = async (storeId) => {
    try {
        const userDataCollection = collection(db, "stores");
        const businessDocRef = doc(userDataCollection, storeId);
        const docSnap = await getDoc(businessDocRef);

        if (docSnap.exists()) {
            const businessData = docSnap.data();
            return {
                address: businessData.business.address,
                phone: businessData.business.phone
            };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching business data:", error);
        return null;
    }
};



useEffect(() => {
    const getBusinessData = async () => {
        if (storeId) {
            const businessData = await fetchBusinessData(storeId);
            if (businessData) {
                setBusinessAddress(businessData.address);
                setBusinessPhone(businessData.phone);
            }
        }
    };

    getBusinessData();
}, [storeId]);



<div>
    <div><strong>Business Address:</strong> {businessAddress || "Loading..."}</div>
    <div><strong>Business Phone:</strong> {businessPhone || "Loading..."}</div>
</div>













<div>

</div>



const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
const [code, setCode] = useState("");

const [isCodeCorrect, setIsCodeCorrect] = useState(false);



const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (code === "1234") {
        setIsCodeCorrect(true);
        console.log("Code is correct!");
        // Optionally reset the code input or hide it after submission
        setCode(""); // Reset the code input
    } else {
        setIsCodeCorrect(false);
        alert("Incorrect code. Please try again.");
    }
};




{
    step === 4 && (
        <div className="text-start relative mt-14">
            <h2 className="text-2xl font-semibold mb-4">Verify ownership of your Business</h2>
            <p className="text-gray-500 mb-2">✅ Let's connect and verify</p>

            <div className="mt-6">
                <div>
                    🏛️ <span className="font-semibold">Business address:</span> {businessAddress}
                </div>
                <div>
                    📞<span className="font-semibold"> Business phone:</span> {businessPhone}
                </div>
            </div>

            <div className="mt-10 flex gap-4">
                <div className="h-10 w-1/4 text-xl tracking-widest rounded border-blue-500 border-2 flex items-center text-center justify-center">
                    {businessPhone}
                </div>
                <button
                    onClick={() => setIsCodeInputVisible(true)}
                    className="h-10 w-[200px] text-sm tracking-widest rounded border-blue-500 border-2 flex items-center text-center justify-center">
                    📞 Call Now
                </button>
            </div>

            {isCodeInputVisible && (
                <form onSubmit={handleCodeSubmit} className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Enter 4-digit code:</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={4}
                        className="mt-1 p-2 border text-sm border-gray-300 rounded w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                        Submit Code
                    </button>
                </form>
            )}

            <div className="flex justify-between mt-[150px] mb-10">
                <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                <button
                    onClick={handleNext}
                    className={`bg-blue-500 text-white py-2 px-4 rounded ${!isCodeCorrect ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isCodeCorrect}>
                    Next
                </button>
            </div>
        </div>
    )
}




<p></p>



const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);

const handleCodeChange = (index, value) => {
    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(0, 1); // Limit to one character
    setCodeDigits(newDigits);

    // Move to the next input field if the current one is filled
    if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`).focus();
    }
};

const handleCodeSubmit = (e) => {
    e.preventDefault();
    const code = codeDigits.join("");
    if (code === "1234") {
        setIsCodeCorrect(true);
        console.log("Code is correct!");
        setCodeDigits(["", "", "", ""]); // Reset the code input
    } else {
        setIsCodeCorrect(false);
        alert("Incorrect code. Please try again.");
    }
};

// In your JSX
{
    isCodeInputVisible && (
        <form onSubmit={handleCodeSubmit} className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Enter 4-digit code:</label>
            <div className="flex space-x-2 mt-1">
                {codeDigits.map((digit, index) => (
                    <input
                        key={index}
                        id={`code-input-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        maxLength={1}
                        className="w-12 h-12 text-center border text-sm border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        required
                    />
                ))}
            </div>
            <button
                type="submit"
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                Submit Code
            </button>
        </form>
    )
}





<p></p>



import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // Add updateDoc here

// ...

const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const code = codeDigits.join("");
    if (code === "1234") {
        setIsCodeCorrect(true);
        console.log("Code is correct");
        setCodeDigits(["", "", "", ""]);

        // Update the stores document with isVerified: true
        if (storeId) {
            try {
                const userDataCollection = collection(db, "stores");
                const businessDocRef = doc(userDataCollection, storeId); // Reference the document by storeId

                await updateDoc(businessDocRef, {
                    isVerified: true // Update the document with isVerified: true
                });

                console.log("Store document updated with isVerified: true");
            } catch (error) {
                console.error("Error updating store document:", error);
            }
        }
    } else {
        setIsCodeCorrect(false);
        alert("Incorrect code");
    }
};






<p></p>



const showPopupForTwoSeconds = () => {
    setPopup(true); // Show popup
    setTimeout(() => {
        setPopup(false); // Hide popup after 2 seconds
    }, 2000); // 2000 milliseconds = 2 seconds
};

















<p></p>


import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

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
            <div className='absolute p-4 top-2 right-2'>
                <div className='flex'>
                    <div>
                        <ConnectButton />
                    </div>
                    <div>
                        {isConnected && (
                            <button
                                onClick={handleDisconnect}
                                className="bg-white rounded-xl py-2 px-4 text-base font-semibold ml-4 ms-3"
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
                <a href='/register' className='mt-4 w-1/4 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2 rounded text-lg'>
                    Start
                </a>

                {/* Business Data Display */}
                {businessData && (
                    <div className='mt-12'>
                        <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                            Your Business Information
                        </h2>
                        {businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg mb-4'>
                                <p className='font-bold'>{business.name}</p>
                                <p>{business.address}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Verified Businesses Map Section */}
                <div className='w-full mt-12 mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 text-center mb-4 '>
                        Verified Businesses
                    </h2>
                    {/* Here you can implement a map or list of verified businesses */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Example of displaying verified businesses */}
                        {/* This should be replaced with actual data fetching logic */}
                        {businessData && businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg'>
                                <h3 className='font-bold'>{business.name}</h3>
                                <p>{business.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;





import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

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
            <div className='absolute p-4 top-2 right-2'>
                <div className='flex'>
                    <div>
                        <ConnectButton />
                    </div>
                    <div>
                        {isConnected && (
                            <button
                                onClick={handleDisconnect}
                                className="bg-white rounded-xl py-2 px-4 text-base font-semibold ml-4 ms-3"
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
                <a href='/register' className='mt-4 w-1/4 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2 rounded text-lg'>
                    Start
                </a>

                {/* Business Data Display */}
                {businessData && (
                    <div className='mt-12'>
                        <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                            Your Business Information
                        </h2>
                        {businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg mb-4'>
                                <p className='font-bold'>{business.name}</p>
                                {business.business && (
                                    <>
                                        <p>Address: {business.business.address}</p>
                                        <p>Phone: {business.business.phone}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Verified Businesses Map Section */}
                <div className='w-full mt-12 mb-10'>
                    < h2 className='text-xl font-semibold text-gray-800 text-center mb-4 '>
                        Verified Businesses
                    </h2>
                    {/* Here you can implement a map or list of verified businesses */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Example of displaying verified businesses */}
                        {businessData && businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg'>
                                <h3 className='font-bold'>{business.name}</h3>
                                {business.business && (
                                    <>
                                        <p>Address: {business.business.address}</p>
                                        <p>Phone: {business.business.phone}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;













// =================================


import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';

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
                    setBusinessData([]); // Set to empty array to indicate no business found
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
            <div className='absolute p-4 top-2 right-2'>
                <div className='flex'>
                    <div>
                        <ConnectButton />
                    </div>
                    <div>
                        {isConnected && (
                            <button
                                onClick={handleDisconnect}
                                className="bg-white rounded-xl py-2 px-4 text-base font-semibold ml-4 ms-3"
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
                <a href='/register' className='mt-4 w-1/4 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2 rounded text-lg'>
                    Start
                </a>

                {/* Business Data Display */}
                {businessData && businessData.length > 0 ? (
                    <div className='mt-12'>
                        <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                            Your Business Information
                        </h2>
                        {businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg mb-4'>
                                <p className='font-bold'>{business.name}</p>
                                {business.business && (
                                    <>
                                        <p>Address: {business.business.address}</p>
                                        <p>Phone: {business.business.phone}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='mt-12 text-center'>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            Business not verified. Let's verify it!
                        </h2>
                        <p className='text-gray-600 mt-2'>
                            Please ensure your wallet address is linked to a verified business.
                        </p>
                    </div>
                )}

                {/* Verified Businesses Map Section */}
                <div className='w-full mt-12 mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                        Verified Businesses
                    </h2>
                    {/* Here you can implement a map or list of verified businesses */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Example of displaying verified businesses */}
                        {businessData && businessData.map(business => (
                            <div key={business.id} className='bg-white p-4 rounded-lg shadow-lg'>
                                <h3 className='font-bold'>{business.name}</h3>
                                {business.business && (
                                    <>
                                        <p>Address: {business.business.address}</p>
                                        <p>Phone: {business.business.phone}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;