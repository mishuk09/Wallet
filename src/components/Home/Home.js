import React, { useEffect, useRef, useState } from 'react';
import underimg from './img/underimg.png';
import verify from './img/verify.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";


const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco


const Home = () => {

    const [verifiedBusinesses, setVerifiedBusinesses] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    const [businessData, setBusinessData] = useState(null); // State to store fetched business data
    const [verificationMessageVisible, setVerificationMessageVisible] = useState(false)
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [user, setUser] = useState({
        walletAddress: null,
        isVerified: false,
        location: null,
    });

    const [userLocation, setUserLocation] = useState(null); // State for user's location
    // const [user, setUser]
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
    // const fetchBusinessData = async () => {
    //     if (address) {
    //         try {
    //             const userDataCollection = collection(db, "stores");
    //             const q = query(userDataCollection, where("wallet_address", "==", address));
    //             const querySnapshot = await getDocs(q);

    //             if (!querySnapshot.empty) {
    //                 const businessInfo = querySnapshot.docs.map(doc => ({
    //                     id: doc.id,
    //                     ...doc.data()
    //                 }));
    //                 setBusinessData(businessInfo);

    //                 // Set verification message visibility based on the verification status of the first business
    //                 if (businessInfo[0].isVerified) {
    //                     setVerificationMessageVisible(false); // Hide message if verified
    //                     setIsBusinessVerified(true);
    //                 } else {
    //                     setVerificationMessageVisible(true); // Show message if not verified
    //                     setIsBusinessVerified(false)
    //                 }
    //             } else {
    //                 console.log("No matching business found.");
    //                 setVerificationMessageVisible(false); // Hide message if no business found
    //                 setIsBusinessVerified(false)
    //             }
    //         } catch (error) {
    //             console.error("Error fetching business data:", error);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     fetchBusinessData();
    // }, [address]); // Fetch data when the address changes



    // User state declaration


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

                    // Check if the business is verified
                    if (businessInfo[0].isVerified) {
                        setUser({
                            walletAddress: address,
                            isVerified: true,
                            location: { lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng },
                        });
                        setMapCenter({ lat: businessInfo[0].business.lat, lng: businessInfo[0].business.lng });
                    } else {
                        setUser({ ...user, isVerified: false, location: null }); // Reset user location if not verified
                    }
                } else {
                    console.log("No matching business found.");
                    setUser({ ...user, isVerified: false, location: null }); // Reset user location if no business found
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
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



                {/* Business Data Display */}
                {
                    isConnected ? (
                        businessData && businessData.length > 0 ? (
                            <div className='mt-12 w-full'>
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




                {/* Verified Businesses Map Section */}
                <div className='w-full mt-12 mb-10'>
                    <h2 className='text-xl font-semibold text-gray-800 text-center mb-4'>
                        Verified Businesses Near You
                    </h2>
                    {/* Map Container */}
                    <div className='w-full h-[400px] bg-white rounded-lg shadow-lg'>
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
                                        position={{ lat: business.business.lat, lng: business.business.lng }} // Ensure lat/lng are in your business data
                                        title={business.business.name} // Optional: show business name on hover
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;
