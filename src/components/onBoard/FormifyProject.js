import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { db } from "../Firebase/firebase";
import { collection, doc, setDoc } from 'firebase/firestore';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco


function FormifyProject({ walletAddress, onBusinessClaimed }) {

    const searchBoxRef = useRef(null);
    const [step, setStep] = useState(1);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [isBusinessClaimed, setIsBusinessClaimed] = useState(false); // Track claim status
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const { disconnect } = useDisconnect();


    //get necesserry function from useAccount
    const { address, isConnected, chain } = useAccount();


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


    //Handle wallet data store
    const handleWalletAddress = async () => {
        try {
            const addressDataCollection = collection(db, "stores");

            // Use the same storeId to reference the same document
            const userDocRef = doc(addressDataCollection, storeId); // Use storeId to reference the same document

            await setDoc(userDocRef, {
                wallet_chain: chain?.name || "Unknown", // Include wallet chain
                wallet_address: address || "No address", // Include wallet address
                onboardingStep: 2, // Update onboarding step
            }, { merge: true }); // Merge to avoid overwriting existing data

            console.log("Owner data saved successfully to Firestore with store ID:", storeId);
        } catch (error) {
            console.error("Error saving owner data to Firestore:", error);
        }
    }


    //state for control empty input and next btn enabling
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    })


    const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };


    // Handle search box places
    const handleSearchBoxPlaces = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = place.geometry.location;

            const businessDetails = {
                name: place.name || "No name available",
                address: place.formatted_address || "Address Not found",
                lat: location.lat(),
                lng: location.lng(),
                phone: place.formatted_phone_number || "Contact not available",
            };

            setMapCenter({
                lat: location.lat(),
                lng: location.lng(),
            });
            setSelectedBusiness(businessDetails); // Set selected business
        } else {
            console.warn("No places found in search results.");
        }
    };

    // Handle map click to set business info
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        setMapCenter({ lat, lng });

        // Set the business details when clicking on the map (custom name and phone or default)
        setSelectedBusiness({
            lat,
            lng,
            address: "Default address",
            name: "Custom Location",  // Default name when clicking on the map
            phone: "N/A",  // Default phone number when clicking on the map
        });
    };


    // Handle business claim from map and save to Firestore
    const handleClaimBusiness = async () => {
        setLoading(true);
        if (selectedBusiness) {
            try {
                const userDataCollection = collection(db, "stores");
                const businessDocRef = doc(userDataCollection); // Create a new document reference
                const newStoreId = businessDocRef.id; // Firestore-generated unique ID

                // Save the business claim data along with wallet information
                await setDoc(businessDocRef, {
                    business: selectedBusiness,
                    onboardingStep: 2,
                    storeId: newStoreId, // Save the store ID
                    wallet_chain: chain?.name || "Unknown", // Include wallet chain
                    wallet_address: address || "No address", // Include wallet address
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

    //handle owner data save
    const handleSaveOwnerData = async (ownerData) => {
        try {
            const userDataCollection = collection(db, "users");

            // Use the same storeId to reference the same document
            const userDocRef = doc(userDataCollection, storeId); // Use storeId to reference the same document

            await setDoc(userDocRef, {
                owner: ownerData, // Save owner data
                onboardingStep: 2, // Update onboarding step
            }, { merge: true }); // Merge to avoid overwriting existing data

            console.log("Owner data saved successfully to Firestore with store ID:", storeId);
        } catch (error) {
            console.error("Error saving owner data to Firestore:", error);
        }
    };


    //handle submit step2
    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        // Ensure storeId is available
        if (!storeId) {
            console.error("Store ID is not available. Please claim the business first.");
            return;
        }
        // Gather owner data from the form
        const ownerData = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            associatedStore: storeId, // Link the user to the claimed store
        };
        await handleSaveOwnerData(ownerData); // Save owner data
        handleNext(); // Move to the next step
    };


    return (
        <div className="flex   bg-gray-100">
            <div className="w-1/3 lg:h-auto 2xl:h-screen bg-gradient-to-t from-[#0a091a] via-[#161330] to-[#0a091a] text-white flex flex-col text-start  pt-[200px]  px-8">
                <h1 className="text-4xl font-semibold mb-6 leading-2">Welcome to Crypto Wallet!</h1>
                <p className="text-gray-300   mb-6">
                    Connect your wallet to start interacting with your crypto assets.
                    Create an account and explore the crypto world like never before.
                </p>
                <p className="text-gray-300 font-semibold mb-10">Sign up now for secure and seamless crypto transactions.</p>

            </div>

            <div className="w-2/3  bg-white px-14 pt-14">
                <div className="">
                    <div className="flex items-center space-x-2">
                        {/* Only display the current step */}
                        {step === 1 && <span className="text-2xl flex items-center font-bold text-gray-800">Step 1 <span className="text-gray-600 ms-8  text-xl font-semibold">Select Business on Map</span></span>}
                        {step === 2 && <span className="text-2xl font-bold text-gray-800">Step 2 <span className="text-gray-600 ms-8  text-xl font-semibold">Fill out the form if you are business Owner</span></span>}
                        {step === 3 && <span className="text-2xl font-bold text-gray-800">Step 3 <span className="text-gray-600 ms-8  text-xl font-semibold">Connect to crypto wallet</span></span>}
                        {step === 4 && <span className="text-2xl font-bold text-gray-800">Step 4</span>}
                        {step === 5 && <span className="text-2xl font-bold text-gray-800">Step 5</span>}
                    </div>

                    <div className="w-full h-[10px] mt-4 flex gap-4 rounded-full overflow-hidden">
                        <div className={`flex-1  rounded-full h-full ${step > 1 ? "bg-green-500" : step === 1 ? "bg-blue-500 " : "bg-gray-200"}`}></div>
                        <div className={`flex-1  rounded-full h-full ${step > 2 ? "bg-green-500" : step === 2 ? "bg-blue-500 " : "bg-gray-200"}`}></div>
                        <div className={`flex-1  rounded-full h-full ${step > 3 ? "bg-green-500" : step === 3 ? "bg-blue-500 " : "bg-gray-200"}`}></div>
                        <div className={`flex-1  rounded-full h-full ${step > 4 ? "bg-green-500" : step === 4 ? "bg-blue-500 " : "bg-gray-200"}`}></div>
                        <div className={`flex-1  rounded-full h-full ${step === 5 ? "bg-blue-500" : "bg-gray-200"}`}></div>
                    </div>

                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="text-start relative mt-14   mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Select Business on Map</h2>
                        <p className="text-gray-500 mb-2">👋 Let's start your dream journey</p>

                        <LoadScript
                            googleMapsApiKey="AIzaSyDOEDZEEqWAyWNyKpBNrhF9Cxti0AfRVDU"
                            libraries={["places"]}

                        >
                            {/* Search Box - Positioned outside of GoogleMap */}
                            <div className="search-box-container   " style={{ position: "relative", top: "50px", left: "60%", transform: "translateX(-50%)", zIndex: 1, width: "70%" }}>
                                <StandaloneSearchBox
                                    onLoad={(ref) => (searchBoxRef.current = ref)}
                                    onPlacesChanged={handleSearchBoxPlaces}
                                >
                                    <input type="text" className="p-2 border rounded w-full sm:w-3/4 lg:w-2/4" placeholder="Search for businesses" />






                                </StandaloneSearchBox>
                            </div>

                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                zoom={12}
                                center={mapCenter}
                                onClick={handleMapClick}  // Handling click on the map
                            >
                                {selectedBusiness && (
                                    <Marker position={{ lat: selectedBusiness.lat, lng: selectedBusiness.lng }} />
                                )}
                            </GoogleMap>

                            {selectedBusiness ? (
                                <div className="mt-6 mb-10">
                                    <div className="flex flex-col gap-4 ">
                                        <div className="flex gap-10">
                                            <h3 className="text-lg"> <span className="font-semibold">📌 Selected Business:</span> {selectedBusiness.name}  </h3>
                                            <p> <span className="font-semibold">📞 Contact:</span> {selectedBusiness.phone}  </p>
                                        </div>
                                        <div className="flex gap-10">
                                            <p> <span className="font-semibold">🌍 Latitude:</span> {selectedBusiness.lat} </p>
                                            <p> <span className="font-semibold">📍 Longitude:</span> {selectedBusiness.lng} </p>
                                        </div>
                                        <div className="flex gap-10">
                                            <p> <span className="font-semibold">🏠 Address:</span> {selectedBusiness.address} </p>

                                        </div>
                                    </div>

                                    <button
                                        className={`w-1/4  btn-style  mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        onClick={handleClaimBusiness}
                                        disabled={loading} // Disable button while saving
                                    >
                                        {loading ? 'Saving...' : '✨ Claim this Business'}
                                    </button>
                                </div>

                            ) : (
                                <div className="font-semibold mt-6 pb-10">
                                    <h3>⚠️ No Business Selected </h3>
                                </div>
                            )}
                        </LoadScript>


                        <button
                            onClick={handleNext}
                            className={`w-1/4 absolute text-sm bottom-0 right-0 mt-4 btn-style ${isBusinessClaimed ? '' : 'opacity-50 cursor-not-allowed'
                                }`}
                            disabled={!isBusinessClaimed} // Disable until business is claimed
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="text-start relative mt-14  ">
                        <h2 className="text-2xl font-semibold mb-4">Fill out the form if you are business owner and want to accept USDC in your business</h2>
                        <p className="text-gray-500 mb-2">👋 Let's start your dream journey</p>

                        <form className="space-y-4 mb-6 mt-6" onSubmit={handleSubmitStep2}>
                            <div className="flex w-full gap-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        placeholder="Enter name here"
                                        className="mt-1 p-2 border text-sm border-gray-300 rounded w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        placeholder="Enter name here"
                                        className="mt-1 p-2 border text-sm border-gray-300 rounded w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Work email"
                                    className="mt-1 p-2 border text-sm border-gray-300 rounded w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Enter phone"
                                    className="mt-1 p-2 border text-sm border-gray-300 rounded w-full focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={handlePrevious}
                                    type="button"
                                    className="btn-style w-1/4 rounded">Previous</button>

                                <button
                                    type="submit"
                                    className={`btn-style w-1/4 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!isFormValid}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="text-start relative mt-14  ">
                        <h2 className="text-2xl font-semibold mb-4">Connect a crypto wallet</h2>
                        <p className="text-gray-500 mb-2">👋 This will be your wallet address for USDC payments</p>

                        <div className="mt-10">

                            <ConnectButton />



                            {isConnected && (
                                <button
                                    onClick={handleDisconnect}
                                    className="btn-style ml-4"
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={handlePrevious}
                                type="button"
                                className="btn-style w-1/4 rounded">Previous</button>

                            <button
                                onClick={async () => {
                                    await handleWalletAddress();
                                    if (isBusinessClaimed) {
                                        handleNext();
                                    }
                                }}
                                className={`btn-style w-1/4 rounded ${!isConnected ? " opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!isConnected}>
                                Next
                            </button>
                            
                        </div>

                    </div>



                )}

                {/* Step 4 */}
                {step === 4 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Security settings</h2>
                        <p className="text-gray-500 mb-4">Ensure your account is secure.</p>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" placeholder="Enter password" className="mt-1 p-2 border text-sm border-gray-300 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" placeholder="Confirm password" className="mt-1 p-2 border text-sm border-gray-300 rounded w-full" />
                            </div>
                        </form>
                        <div className="flex justify-between">
                            <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                            <button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 5 */}
                {step === 5 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Final review</h2>
                        <p className="text-gray-500 mb-4">Review your information before submitting.</p>
                        <div className="space-y-4">
                            <div><strong>First Name:</strong> [First Name]</div>
                            <div><strong>Last Name:</strong> [Last Name]</div>
                            <div><strong>Email:</strong> [Email]</div>
                            <div><strong>Experience:</strong> [Experience]</div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                            <button onClick={handleNext} className="bg-green-500 text-white py-2 px-4 rounded">Submit</button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default FormifyProject;
