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
    const [loading, setLoading] = useState(false); // Loading state
    const [businessData, setBusinessData] = useState(null); // State to store fetched business data
    const [verificationMessageVisible, setVerificationMessageVisible] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [user, setUser] = useState({
        walletAddress: null,
        isVerified: false,
        location: null,
    });

    const [userLocation, setUserLocation] = useState(null); // State for user's location

    // Handle disconnected wallet
    const handleDisconnect = async () => {
        try {
            await disconnect(); // Call the disconnect function
            console.log("Wallet disconnected");
            setBusinessData(null); // Reset business data
            setVerificationMessageVisible(false);
            setIsBusinessVerified(false)
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };


    // Fetch business data based on wallet address
    const fetchBusinessData = async () => {
        if (address) {
            setLoading(true); // Start loading
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
                        setUser({
                            walletAddress: address,
                            isVerified: true,
                            location: { lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng },
                        });
                        setIsBusinessVerified(true);
                        setVerificationMessageVisible(false); // Hide message if verified
                        setMapCenter({ lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng });
                    } else {
                        setUser({ ...user, isVerified: false, location: null }); // Reset user location if not verified
                        setIsBusinessVerified(false);
                        setVerificationMessageVisible(true); // Show message if not verified
                    }
                } else {
                    console.log("No matching business found.");
                    setUser({ ...user, isVerified: false, location: null }); // Reset user location if no business found
                    setVerificationMessageVisible(false); // Hide message if no business found
                    setIsBusinessVerified(false);
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };


    // Fetch verified businesses from Firestore
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

    // Get user's current location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserLocation(location);
                setMapCenter(location);
            }, (error) => {
                console.error("Error getting user location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Fetch business data
    useEffect(() => {
        fetchBusinessData();
    }, [address]);

    // Fetch verified businesses on component mount
    useEffect(() => {
        fetchVerifiedBusinesses();
    }, []);

    // Get user's location when connected
    useEffect(() => {
        if (isConnected) {
            getUserLocation();
        }
    }, [isConnected]);



    let clickTimeout = null;

    const handleMarkerClick = (business) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null; // Reset timeout
            setSelectedBusiness(null); // Hide the card on double click
        } else {
            clickTimeout = setTimeout(() => {
                setSelectedBusiness(business); // Show the card on single click
                clickTimeout = null; // Reset timeout
            }, 250); // 250ms delay for single click
        }
    };



    
    return (
        <>

            <div className='w-full px-3 md:p-0 relative min-h-auto flex flex-col items-center bg-gray-100'>
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
                    <h1 className=' text-3xl md:text-5xl font-bold text-gray-800'>
                        👋 Welcome to Crypto
                        <span className='text-blue-600 inline-block'>
                            Wallet
                            {/* Image Below Wallet Text */}
                            <div className='mt-[-10px]'>
                                <img src={underimg} alt="undereffect" className='w-[150px] md:w-[200px] h-auto' />
                            </div>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className='text-gray-600 mt-4 font-semibold text-sm mb-4 px-4 text-center'>
                        Connect your wallet to start interacting with your crypto assets.
                    </p>

                    {/* Start Registration Button */}
                    <div className="flex justify-center mt-4 items-center space-x-4">
                        <div className="w-[150px] md:w-[200px]">
                            <a
                                href="/register"
                                className="w-full px-14 md:px-20 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-[0.3s]   transition-all ease-in-out text-white py-2 rounded text-base md:text-lg"
                            >
                                Start
                            </a>
                        </div>
                        <div className="w-auto">
                            {isConnected && (
                                <button
                                    onClick={handleDisconnect}
                                    className=" w-[150px] md:w-[200px] bg-red-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-[0.3s] transition-all ease-in-out text-white py-[8px] md:py-[7px] rounded text-base md:text-lg"
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>
                    </div>



                    {/* Business Data Display */}

                    {
                        isConnected ? (
                            loading ? (
                                <div className="flex items-center mt-20 justify-center h-100">
                                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-4 text-lg font-medium text-gray-700">Loading data...</span>
                                </div>
                            ) : (


                                businessData && businessData.length > 0 ? (
                                    < div className='mt-12 w-full'>
                                        <h1 className='text-xl flex items-center justify-center font-semibold text-gray-800 mb-4 text-center'>
                                            <div>
                                                Business Status
                                            </div>
                                            <div className='flex items-center justify-center ms-2'>
                                                {isBusinessVerified && (

                                                    <img src={verify} className='w-5 h-5' alt="" srcset="" />
                                                )}

                                                {
                                                    verificationMessageVisible && (
                                                        <p>🔓</p>
                                                    )
                                                }

                                            </div>
                                        </h1>
                                        {
                                            businessData.map(business => (
                                                <div key={business.id} className='p-4 rounded-lg bg-white shadow-lg md-04'>
                                                    <p className='font-bold'>{business.name}</p>
                                                    {
                                                        business.business && (
                                                            <>
                                                                <p>🏠 <span className='font-semibold'>Address : </span>{business.business.address}</p>
                                                                <p>📞 <span className='font-semibold'>Phone : </span>{business.business.phone}</p>
                                                                {
                                                                    // Check if the business is not verified
                                                                    !business.isVerified && (
                                                                        <p className='text-red-500 text-sm mt-2'>
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
                                            ⚠️ Your Business not found. Let's Register!
                                        </h2>
                                        <p className='mt-2 text-gray-600'>
                                            Please ensure your wallet address is linked to a verified business.
                                        </p>
                                    </div>
                                ))
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
            </div >

            {/* Verified Businesses Map Section */}
            <div className=' bg-gray-100'>
                <div className='w-[80%] mx-auto pt-14 pb-16 '>
                    <h2 className='text-xl mb-6 font-semibold text-gray-800 text-center'>
                        Verified Businesses Near You
                    </h2>
                    {/* Map Container */}
                    <div className='relative w-full h-full border-2 p-1  bg-white rounded-lg shadow-lg'>
                        {/* Replace this with an actual map, e.g., Google Maps */}
                        <LoadScript
                            googleMapsApiKey="AIzaSyDOEDZEEqWAyWNyKpBNrhF9Cxti0AfRVDU"
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
                                        position={{ lat: business.business.lat, lng: business.business.lng }}
                                        title={business.business.name}
                                        onClick={() => handleMarkerClick(business)} // Use the new click handler
                                    />
                                ))}
                            </GoogleMap>

                           
                            {selectedBusiness && (
                                <div className="overlay">
                                    <div className={`absolute duration-75 transition-all top-4 cursor-pointer left-4 bg-gray-50 text-start rounded-lg shadow-lg p-4 business-card ${selectedBusiness ? 'show' : ''}`}>
                                        <h3 className="font-bold mb-1">💼  {selectedBusiness.business.name}</h3>
                                        <p>
                                            <span className="font-semibold">📌 Address: </span>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.business.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className='text-blue-500 hover:underline'
                                            >
                                                <span className='text-sm'>{selectedBusiness.business.address}</span>
                                            </a>
                                        </p>
                                        <p className='flex items-center'>
                                            <span className="font-semibold">🔒  Status: </span>
                                            {isBusinessVerified && (
                                                <img src={verify} className='w-4 h-4 ms-2' alt="" />
                                            )}
                                        </p>
                                        <button
                                            onClick={() => setSelectedBusiness(null)} // To close the card
                                            className="mt-2 absolute top-0 right-3"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}


                        </LoadScript>
                    </div>
                </div ></div >
        </>
    );
};

export default Home;
