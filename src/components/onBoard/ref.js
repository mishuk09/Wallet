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










{/* Business Data Display */ }
{
    isConnected ? (
        businessData && businessData.length > 0 ? (
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
                    ⚠️ Your Business not verified. Let's verify it!
                </h2>
                <p className='mt-2 text-gray-600'>
                    Please ensure your wallet address is linked to a verified business.
                </p>
            </div>
        )
    ) : (
        <div className='mt-12 text-center'>
            <h2 className='text-xl font-semibold text-gray-800'>
                🔑 Please connect your wallet to access your business information.
            </h2>
            <p className='mt-2 text-gray-600'>
                Once connected, you will be able to see your verified business details.
            </p>
        </div>
    )
}







{
    businessData && businessData.length > 0 ? (
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

    )
}







// Handle wallet data store
const handleWalletAddress = async () => {
    try {
        const addressDataCollection = collection(db, "stores");
        const userDocRef = doc(addressDataCollection, storeId); // Use storeId to reference the same document
        const docSnap = await getDoc(userDocRef); // Fetch the document

        if (docSnap.exists()) {
            const businessData = docSnap.data();
            const existingWalletAddress = businessData.wallet_address;

            // Check if the current address matches the stored wallet_address
            if (address === existingWalletAddress) {
                alert("Your Business & Wallet already verified?");
                return; // Exit the function if they match
            }
        }

        // Proceed to store the wallet data if no match is found
        await setDoc(userDocRef, {
            wallet_chain: chain?.name || "Unknown", // Include wallet chain
            wallet_address: address || "No address", // Include wallet address
            onboardingStep: 2, // Update onboarding step
        }, { merge: true }); // Merge to avoid overwriting existing data

        handleNext(); // Move to the next step
        console.log("Owner data saved successfully to Firestore with store ID:", storeId);
    } catch (error) {
        console.error("Error saving owner data to Firestore:", error);
    }
}










import { useHistory } from 'react-router-dom'; // Import useHistory

// Inside your component
const FormifyProject = ({ walletAddress, onBusinessClaimed }) => {
    const history = useHistory(); // Initialize history

    // Handle wallet data store
    const handleWalletAddress = async () => {
        try {
            const addressDataCollection = collection(db, "stores");
            const userDocRef = doc(addressDataCollection, storeId); // Use storeId to reference the same document
            const docSnap = await getDoc(userDocRef); // Fetch the document

            if (docSnap.exists()) {
                const businessData = docSnap.data();
                const existingWalletAddress = businessData.wallet_address;

                // Check if the current address matches the stored wallet_address
                if (address === existingWalletAddress) {
                    alert("Your Business & Wallet already verified?");
                    history.push('/'); // Navigate to home page after alert
                    return; // Exit the function if they match
                }
            }

            // Proceed to store the wallet data if no match is found
            await setDoc(userDocRef, {
                wallet_chain: chain?.name || "Unknown", // Include wallet chain
                wallet_address: address || "No address", // Include wallet address
                onboardingStep: 2, // Update onboarding step
            }, { merge: true }); // Merge to avoid overwriting existing data

            handleNext(); // Move to the next step
            console.log("Owner data saved successfully to Firestore with store ID:", storeId);
        } catch (error) {
            console.error("Error saving owner data to Firestore:", error);
        }
    }

    // ... rest of your component
}







const handleClaimBusiness = async () => {
    setLoading(true);
    if (selectedBusiness) {
        try {
            const userDataCollection = collection(db, "stores");

            // Query to check if the wallet_address already exists in the database
            const querySnapshot = await getDocs(query(userDataCollection, where("wallet_address", "==", address)));

            // If any document matches, it means the wallet_address is already in use
            if (!querySnapshot.empty) {
                alert("This wallet address is already associated with a business.");
                setLoading(false); // Reset loading state
                return; // Exit the function if the wallet address already exists
            }

            // If the wallet_address is not found, proceed to create a new document
            const businessDocRef = doc(userDataCollection); // Create a new document reference
            const newStoreId = businessDocRef.id; // Firestore-generated unique ID

            // Save the business claim data along with wallet information
            await setDoc(businessDocRef, {
                business: selectedBusiness,
                onboardingStep: 2,
                isVerified: false,
                storeId: newStoreId, // Save the store ID
                // wallet_chain: chain?.name || "Unknown", // Include wallet chain
                // wallet_address: address || "No address", // Include wallet address
            });

            console.log("Business claimed successfully with store ID:", newStoreId);
            setStoreId(newStoreId); // Save the storeId in state for later use
            setIsBusinessClaimed(true); // Update claim status

            // Pass the storeId along with selectedBusiness to the parent component if needed
            if (onBusinessClaimed) {
                onBusinessClaimed({ ...selectedBusiness, storeId: newStoreId });
            }
        } catch (error) {
            console.error("Error storing business data in Firestore:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    }
};





// Handle wallet data store
const handleWalletAddress = async () => {
    try {
        const addressDataCollection = collection(db, "stores");
        const userDocRef = doc(addressDataCollection, storeId); // Use storeId to reference the same document
        const docSnap = await getDoc(userDocRef); // Fetch the document

        if (docSnap.exists()) {
            const businessData = docSnap.data();
            const existingWalletAddress = businessData.wallet_address;
            const isVerified = businessData.isVerified; // Check the isVerified status

            // Check if the current address matches the stored wallet_address
            if (address === existingWalletAddress) {
                if (isVerified) {
                    alert("Your Business & Wallet are already verified.");
                    nevigate('/'); // Navigate to home page
                } else {
                    alert("Your wallet is associated with this business but not verified. Please proceed to verification.");
                    handleNext(); // Allow to proceed to step 4 for verification
                }
                return; // Exit the function after handling the case
            }
        }

        // Proceed to store the wallet data if no match is found
        await setDoc(userDocRef, {
            wallet_chain: chain?.name || "Unknown", // Include wallet chain
            wallet_address: address || "No address", // Include wallet address
            onboardingStep: 2, // Update onboarding step
        }, { merge: true }); // Merge to avoid overwriting existing data

        handleNext(); // Move to the next step
        console.log("Owner data saved successfully to Firestore with store ID:", storeId);
    } catch (error) {
        console.error("Error saving owner data to Firestore:", error);
    }
}





useEffect(() => {
    const getBusinessData = async () => {
        if (storeId) {
            // Fetch business data using storeId for new users
            const businessData = await fetchBusinessData(storeId);
            if (businessData) {
                setBusinessAddress(businessData.address);
                setBusinessPhone(businessData.phone);
            }
        } else if (address) {
            // If storeId is not available, fetch using wallet_address for existing users
            const userDataCollection = collection(db, "stores");
            const querySnapshot = await getDocs(query(userDataCollection, where("wallet_address", "==", address)));
            if (!querySnapshot.empty) {
                const existingBusinessData = querySnapshot.docs[0].data(); // Get the first matching document
                setBusinessAddress(existingBusinessData.business.address);
                setBusinessPhone(existingBusinessData.business.phone);
            }
        }
    };
    getBusinessData();
}, [storeId, address]); // Dependency array includes storeId and address








////








{/* Business Data Display */ }
{
    isConnected ? (
        businessData && businessData.length > 0 ? (
            <div className='mt-12 w-full'>
                <h1 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
                    ✅ Your Business Status
                </h1>
                {
                    businessData.map(business => (
                        <div key={business.id} className='p-4 rounded-lg shadow-lg md-04'>
                            <p className='font-bold'>{business.name}</p>
                            {
                                business.business && (
                                    <>
                                        <p>🏠 <span className='font-semibold'>Address : </span>{business.business.address}</p>
                                        <p>📞 <span className='font-semibold'>Phone : </span>{business.business.phone}</p>
                                        {
                                            // Check if the business is not verified
                                            !business.isVerified && (
                                                <p className='text-red-500 mt-2'>
                                                    ⚠️ Your business has been added but not verified. Let's verify it!
                                                </p>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        ) : (
            <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg'>
                <h2 className='text-xl font-semibold text-gray-800'>
                    ⚠️ Your Business not found. Let's add it!
                </h2>
                <p className='mt-2 text-gray-600'>
                    Please ensure your wallet address is linked to a verified business.
                </p>
            </div>
        )
    ) : (
        <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg md-04'>
            <h2 className='text-xl font-semibold text-gray-800'>
                🔑 Please connect your wallet to access your business information.
            </h2>
            <p className='mt-2 text-gray-600'>
                Once connected, you will be able to see your verified business details.
            </p>
        </div>
    )
}











import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {
    const [businessData, setBusinessData] = useState(null); // State to store fetched business data
    const [verificationMessageVisible, setVerificationMessageVisible] = useState(false); // State for verification message visibility
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Handle disconnected wallet
    const handleDisconnect = async () => {
        try {
            await disconnect(); // Call the disconnect function
            console.log("Wallet disconnected");
            setBusinessData(null); // Reset business data
            setVerificationMessageVisible(false); // Reset verification message visibility
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

                    // Set verification message visibility based on the verification status of the first business
                    if (businessInfo[0].isVerified) {
                        setVerificationMessageVisible(false); // Hide message if verified
                    } else {
                        setVerificationMessageVisible(true); // Show message if not verified
                    }
                } else {
                    console.log("No matching business found.");
                    setVerificationMessageVisible(false); // Hide message if no business found
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

                {/* Verification Message */}
                {verificationMessageVisible && (
                    <p className='text-red-500 mt-4 font-semibold text-sm mb-4 px-4 text-center'>
                        ⚠️ Your business has been added but not verified. Let's verify it!
                    </p>
                )}

                {/* Start Registration Button */}
                <div className="flex justify-center mt-4 items-center space-x-4">
                    <div className="w-[200px]">
                        <a
                            href="/register"
                            className="w full px-20 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            Start Registration
                        </a>
                    </div>
                </div>
            </div>

            {/* Business Data Display */}
            {
                isConnected ? (
                    businessData && businessData.length > 0 ? (
                        <div className='mt-12 w-full'>
                            <h1 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
                                ✅ Your Business Status
                            </h1>
                            {
                                businessData.map(business => (
                                    <div key={business.id} className='p-4 rounded-lg shadow-lg md-04'>
                                        <p className='font-bold'>{business.name}</p>
                                        {
                                            business.business && (
                                                <>
                                                    <p>🏠 <span className='font-semibold'>Address : </span>{business.business.address}</p>
                                                    <p>📞 <span className='font-semibold'>Phone : </span>{business.business.phone}</p>
                                                    {
                                                        // Check if the business is not verified
                                                        !business.isVerified && (
                                                            <p className='text-red-500 mt-2'>
                                                                ⚠️ Your business has been added but not verified. Let's verify it!
                                                            </p>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg'>
                            <h2 className='text-xl font-semibold text-gray-800'>
                                ⚠️ Your Business not found. Let's add it!
                            </h2>
                            <p className='mt-2 text-gray-600'>
                                Please ensure your wallet address is linked to a verified business.
                            </p>
                        </div>
                    )
                ) : (
                    <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg md-04'>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            🔑 Please connect your wallet to access your business information.
                        </h2>
                        <p className='mt-2 text-gray-600'>
                            Once connected, you will be able to see your verified business details.
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default Home;











import React, { useEffect, useState } from 'react';
import underimg from './img/underimg.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {
    const [businessData, setBusinessData] = useState(null); // State to store fetched business data
    const [verificationMessageVisible, setVerificationMessageVisible] = useState(false); // State for verification message visibility
    const [isBusinessVerified, setIsBusinessVerified] = useState(false); // State for business verification status
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Handle disconnected wallet
    const handleDisconnect = async () => {
        try {
            await disconnect(); // Call the disconnect function
            console.log("Wallet disconnected");
            setBusinessData(null); // Reset business data
            setVerificationMessageVisible(false); // Reset verification message visibility
            setIsBusinessVerified(false); // Reset business verification status
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

                    // Set verification message visibility and business verification status
                    if (businessInfo[0].isVerified) {
                        setVerificationMessageVisible(false); // Hide message if verified
                        setIsBusinessVerified(true); // Set verified status to true
                    } else {
                        setVerificationMessageVisible(true); // Show message if not verified
                        setIsBusinessVerified(false); // Set verified status to false
                    }
                } else {
                    console.log("No matching business found.");
                    setVerificationMessageVisible(false); // Hide message if no business found
                    setIsBusinessVerified(false); // Reset verified status
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

                {/* Verification Message */}
                {verificationMessageVisible && (
                    <p className='text-red-500 mt-4 font-semibold text-sm mb-4 px-4 text-center'>
                        ⚠️ Your business has been added but not verified. Let's verify it!
                    </p>
                )}

                {/* Verified Emoji */}
                {isBusinessVerified && (
                    <p className='text-green-500 mt-4 font-semibold text-sm mb-4 px-4 text-center'>
                        ✅ Your business is verified!
                    </p>
                )}

                {/* Start Registration Button */}
                <div className="flex justify-center mt-4 items-center space-x-4">
                    <div className="w-[200px]">
                        <a
                            href="/register"
                            className="w full px-20 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            Start Registration
                        </a>
                    </div>
                </div>
            </div>

            {/* Business Data Display */}
            {
                isConnected ? (
                    businessData && businessData.length > 0 ? (
                        <div className='mt-12 w-full'>
                            <h1 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
                                ✅ Your Business Status
                            </h1>
                            {
                                businessData.map(business => (
                                    <div key={business.id} className='p-4 rounded-lg shadow-lg md-04'>
                                        <p className='font-bold'>{business.name}</p>
                                        {
                                            business.business && (
                                                <>
                                                    <p>🏠 <span className='font-semibold'>Address : </span>{business.business.address}</p>
                                                    <p>📞 <span className='font-semibold'>Phone : </span>{business.business.phone}</p>
                                                    {
                                                        // Check if the business is not verified
                                                        !business.isVerified && (
                                                            <p className='text-red-500 mt-2'>
                                                                ⚠️ Your business has been added but not verified. Let's verify it!
                                                            </p>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg'>
                            <h2 className='text-xl font-semibold text-gray-800'>
                                ⚠️ Your Business not found. Let's add it!
                            </h2>
                            <p className='mt-2 text-gray-600'>
                                Please ensure your wallet address is linked to a verified business.
                            </p>
                        </div>
                    )
                ) : (
                    <div className='mt-14 text-center w-full p-4 rounded-lg shadow-lg md-04'>
                        <h2 className='text-xl font-semibold text-gray-800'>
                            🔑 Please connect your wallet to access your business information.
                        </h2>
                        <p className='mt-2 text-gray-600'>
                            Once connected, you will be able to see your verified business details.
                        </p>
                    </div>
                )
            }
        </div>
    );
};

export default Home;







const handleClaimBusiness = async () => {
    setLoading(true);
    if (selectedBusiness) {
        try {
            const userDataCollection = collection(db, "stores");

            // Check if the wallet address is empty
            if (!address) {
                // If the wallet_address is empty, proceed to create a new document
                const businessDocRef = doc(userDataCollection); // Create a new document reference
                const newStoreId = businessDocRef.id; // Firestore-generated unique ID

                // Save the business claim data along with wallet information
                await setDoc(businessDocRef, {
                    business: selectedBusiness,
                    onboardingStep: 2,
                    isVerified: false,
                    storeId: newStoreId, // Save the store ID
                    // wallet_chain: chain?.name || "Unknown", // Include wallet chain
                    // wallet_address: address || "No address", // Include wallet address
                });

                console.log("Business claimed successfully with store ID:", newStoreId);
                setStoreId(newStoreId); // Save the storeId in state for later use
                setIsBusinessClaimed(true); // Update claim status

                // Pass the storeId along with selectedBusiness to the parent component if needed
                if (onBusinessClaimed) {
                    onBusinessClaimed({ ...selectedBusiness, storeId: newStoreId });
                }
                handleNext(); // Move to the next step after creating a new business
                setLoading(false); // Reset loading state
                return; // Exit the function
            }

            // Query to check if the wallet_address already exists in the database
            const querySnapshot = await getDocs(query(userDataCollection, where("wallet_address", "==", address)));

            // If any document matches, it means the wallet_address is already in use
            if (!querySnapshot.empty) {
                const existingBusinessData = querySnapshot.docs[0].data(); // Get the first matching document
                const isVerified = existingBusinessData.isVerified; // Check the isVerified status

                // Set the storeId from the existing data
                setStoreId(querySnapshot.docs[0].id); // Set the storeId to the ID of the existing document

                if (isVerified) {
                    alert("This wallet address is already associated with a verified business.");
                    nevigate('/')
                    setLoading(false); // Reset loading state
                    return; // Exit the function if the wallet address is already verified
                } else {
                    alert("This wallet address is associated with a business but not verified. Please proceed to verification.");
                    setIsBusinessClaimed(true); // Set claim status to true to enable the next button
                    setStep(4); // Redirect to step 4 for verification
                    setLoading(false); // Reset loading state
                    return; // Exit the function to allow verification
                }
            }

            // If the wallet_address is not found, proceed to create a new document
            const businessDocRef = doc(userDataCollection); // Create a new document reference
            const newStoreId = businessDocRef.id; // Firestore-generated unique ID

            // Save the business claim data along with wallet information
            await setDoc(businessDocRef, {
                business: selectedBusiness,
                onboardingStep: 2,
                isVerified: false,
                storeId: newStoreId, // Save the store ID
                // wallet_chain: chain?.name || "Unknown", // Include wallet chain
                // wallet_address: address || "No address", // Include wallet address
            });

            console.log("Business claimed successfully with store ID:", newStoreId);
            setStoreId(newStoreId); // Save the storeId in state for later use
            setIsBusinessClaimed(true); // Update claim status

            // Pass the storeId along with selectedBusiness to the parent component if needed
            if (onBusinessClaimed) {
                onBusinessClaimed({ ...selectedBusiness, storeId: newStoreId });
            }
            handleNext(); // Move to the next step after creating a new business
        } catch (error) {
            console.error("Error storing business data in Firestore:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    }
};






const handleWalletAddress = async () => {
    try {
        const addressDataCollection = collection(db, "stores");
        const userDocRef = doc(addressDataCollection, storeId); // Use storeId to reference the same document
        const docSnap = await getDoc(userDocRef); // Fetch the document

        if (docSnap.exists()) {
            const businessData = docSnap.data();
            const existingWalletAddress = businessData.wallet_address;
            const isVerified = businessData.isVerified; // Check the isVerified status

            // Check if the current address matches the stored wallet_address
            if (address && existingWalletAddress && address === existingWalletAddress) {
                if (isVerified) {
                    alert("Your Business & Wallet are already verified.");
                    nevigate('/'); // Navigate to home page
                } else {
                    handleNext(); // Allow to proceed to step 4 for verification
                }
                return; // Exit the function after handling the case
            }
        }

        // Proceed to store the wallet data if no match is found
        await setDoc(userDocRef, {
            wallet_chain: chain?.name || "Unknown", // Include wallet chain
            wallet_address: address || "No address", // Include wallet address
            onboardingStep: 2, // Update onboarding step
        }, { merge: true }); // Merge to avoid overwriting existing data

        handleNext(); // Move to the next step
        console.log("Owner data saved successfully to Firestore with store ID:", storeId);
    } catch (error) {
        console.error("Error saving owner data to Firestore:", error);
    }
};



const { address, isConnected } = useAccount();

// When wallet is connected, set the address state
useEffect(() => {
    if (isConnected) {
        setAddress(address); // Ensure address state is updated
    }
}, [isConnected, address]);













// Handle wallet data store
// const handleWalletAddress = async () => {
//     try {
//         const addressDataCollection = collection(db, "stores");
//         const q = query(addressDataCollection, where("wallet_address", "==", address)); // Query to find existing address
//         const userDocRef = doc(addressDataCollection, storeId); // Reference to the document for this business
//         const querySnapshot = await getDocs(q); // Execute the query
//         const docSnap = await getDoc(userDocRef); // Fetch the document

//         if (docSnap.exists()) {
//             const businessData = docSnap.data();
//             // const existingWalletAddress = businessData.wallet_address;
//             const isVerified = businessData.isVerified; // Check the isVerified status

//             // Check if the current address matches the stored wallet_address
//             // if (address === existingWalletAddress) {
//                 if (!querySnapshot.empty) {
//                 if (isVerified) {
//                     alert("Your Business & Wallet are already verified.");
//                     nevigate('/'); // Navigate to home page
//                 } else {
//                     alert("Your wallet is associated with this business but not verified. Please proceed to verification.");
//                     handleNext(); // Allow to proceed to step 4 for verification
//                 }
//                 return; // Exit the function after handling the case
//             }
//         }


//         // If no matching document is found, proceed to store the wallet data
//         await setDoc(userDocRef, {
//             wallet_chain: chain?.name || "Unknown", // Include wallet chain
//             wallet_address: address || "No address", // Include wallet address
//             onboardingStep: 2, // Update onboarding step
//         }, { merge: true }); // Merge to avoid overwriting existing data

//         handleNext(); // Move to the next step
//         console.log("Owner data saved successfully to Firestore with store ID:", storeId);
//     } catch (error) {
//         console.error("Error saving owner data to Firestore:", error);
//     }
// };














import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../Firebase/firebase";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

function FormifyProject() {
    const [verifiedBusinesses, setVerifiedBusinesses] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const searchBoxRef = useRef(null);

    // Fetch verified businesses from Firestore
    useEffect(() => {
        const fetchVerifiedBusinesses = async () => {
            try {
                const userDataCollection = collection(db, "stores");
                const q = query(userDataCollection, where("isVerified", "==", true)); // Query for verified businesses
                const querySnapshot = await getDocs(q);
                const businesses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVerifiedBusinesses(businesses);
            } catch (error) {
                console.error("Error fetching verified businesses:", error);
            }
        };

        fetchVerifiedBusinesses();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Verified Businesses on Map</h2>
            <LoadScript
                googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
                libraries={["places"]}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={mapCenter}
                >
                    {verifiedBusinesses.map(business => (
                        <Marker
                            key={business.id}
                            position={{ lat: business.business.lat, lng: business.business.lng }} // Ensure lat/lng are in your business data
                            title={business.business.name} // Optional: show business name on hover
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default FormifyProject;













import React, { useEffect, useRef, useState } from 'react';
import underimg from './img/underimg.png';
import verify from './img/verify.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

const Home = () => {
    const [verifiedBusinesses, setVerifiedBusinesses] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [userLocation, setUserLocation] = useState(null); // State for user's location
    const [businessData, setBusinessData] = useState(null);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const handleDisconnect = async () => {
        // ... (existing disconnect logic)
    };

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

                    // Check if the business is verified
                    if (businessInfo[0].isVerified) {
                        setIsBusinessVerified(true);
                        setUser Location({ lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng }); // Set user's location from business data
                        setMapCenter({ lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng }); // Center the map on user's location
                    } else {
                        setIsBusinessVerified(false);
                        setUser Location(null); // Reset user location if not verified
                    }
                } else {
                    console.log("No matching business found.");
                    setIsBusinessVerified(false);
                    setUser Location(null); // Reset user location if no business found
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
            }
        }
    };

    useEffect(() => {
        fetchBusinessData();
    }, [address]);

    // Fetch verified businesses from Firestore
    useEffect(() => {
        const fetchVerifiedBusinesses = async () => {
            try {
                const userDataCollection = collection(db, "stores");
                const q = query(userDataCollection, where("isVerified", "==", true));
                const querySnapshot = await getDocs(q);
                const businesses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVerifiedBusinesses(businesses);
            } catch (error) {
                console.error("Error fetching verified businesses:", error);
            }
        };

        fetchVerifiedBusinesses();
    }, []);

    // Get user's current location
    const getUser Location = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUser Location({ lat: position.coords.latitude, lng: position.coords.longitude });
                setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
            }, (error) => {
                console.error("Error getting user location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Call getUser Location when the user is connected
    useEffect(() => {
        if (isConnected) {
            getUser Location();
        }
    }, [isConnected]);

    return (
        <div className='w-full relative min-h-screen flex ```javascript
        flex-col items-center justify-center'>
            <ConnectButton />
            <div className='map-container'>
                <LoadScript googleMapsApiKey="YOUR_API_KEY">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={10}
                    >
                        {userLocation && (
                            <Marker position={userLocation} />
                        )}
                        {!isBusinessVerified && verifiedBusinesses.map(business => (
                            <Marker key={business.id} position={{ lat: business.business.lat, lng: business.business.lng }} />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default Home;