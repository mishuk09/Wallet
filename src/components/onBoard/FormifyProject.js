import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { db } from "../Firebase/firebase";
import { collection, doc, setDoc } from 'firebase/firestore';

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco


function FormifyProject({ walletAddress, onBusinessClaimed }) {
    const [step, setStep] = useState(1);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const searchBoxRef = useRef(null);

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
            name: "Custom Location",  // Default name when clicking on the map
            phone: "N/A",  // Default phone number when clicking on the map
        });
    };

    // Handle business claim and save to Firestore
    const handleClaimBusiness = async () => {
        if (selectedBusiness) {
            try {
                const userDataCollection = collection(db, "googleMap");
                const businessDocRef = doc(userDataCollection, walletAddress);
                await setDoc(businessDocRef, {
                    business: selectedBusiness,
                    onboardingStep: 2,
                });
                console.log("Business claimed and saved to Firestore successfully.");

                if (onBusinessClaimed) {
                    onBusinessClaimed(selectedBusiness); // Pass selected business details back to parent
                }
            } catch (error) {
                console.error("Error storing business data in Firestore:", error);
            }
        }
    };


    return (
        <div className="flex   bg-gray-100">
            <div className="w-1/3 h-auto bg-gradient-to-t from-[#0a091a] via-[#161330] to-[#0a091a] text-white flex flex-col text-start  pt-[200px]  px-8">
                <h1 className="text-4xl font-semibold mb-6 leading-2">Welcome to Crypto Wallet!</h1>
                <p className="text-gray-300   mb-6">
                    Connect your wallet to start interacting with your crypto assets.
                    Create an account and explore the crypto world like never before.
                </p>
                <p className="text-gray-300 font-semibold mb-10">Sign up now for secure and seamless crypto transactions.</p>

            </div>

            <div className="w-2/3  bg-white p-14">
                <div className="">
                    <div className="flex items-center space-x-2">
                        {/* Only display the current step */}
                        {step === 1 && <span className="text-2xl flex items-center font-bold text-gray-800">Step 1 <span className="text-gray-600 ms-8  text-xl font-semibold">Select Business on Map</span></span>}
                        {step === 2 && <span className="text-2xl font-bold text-gray-800">Step 2</span>}
                        {step === 3 && <span className="text-2xl font-bold text-gray-800">Step 3</span>}
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
                    <div className="text-start relative mt-14 mb-8">
                        <h2 className="text-3xl font-semibold mb-4">Select Business on Map</h2>
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
                                    <input
                                        type="text"
                                        className="p-2 w-2/4 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search for businesses"
                                    />

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
                                <div className="  mt-6 mb-10">
                                    <h3><span className="font-semibold">Selected Business:</span> {selectedBusiness.name}</h3>
                                    <p><span className="font-semibold">Contact:</span> {selectedBusiness.phone}</p>
                                    <p><span className="font-semibold">Latitude:</span> {selectedBusiness.lat}</p>
                                    <p><span className="font-semibold">Longitude:</span> {selectedBusiness.lng}</p>
                                    <button
                                        className="  w-1/4  bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2   rounded mt-6"
                                        onClick={handleClaimBusiness} // Save to Firestore on button click
                                    >
                                        Claim this Business
                                    </button>
                                </div>
                            ) : (
                                <div className="font-semibold mt-6">
                                    <h3>⚠️ No Business Selected </h3>
                                </div>
                            )}
                        </LoadScript>



                        <button onClick={handleNext} className="w-1/4 absolute right-0  mt-4 bg-blue-500 hover:bg-white hover:text-black hover:ring-1 hover:ring-blue-600 duration-100 transition-all text-white py-2   rounded">Next</button>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Set work preferences</h2>
                        <p className="text-gray-500 mb-4">Choose at least 3 interests to get started.</p>
                        {/* <div className="grid grid-cols-2 gap-4 mb-4">
                            {["Challenging work", "Diversity and inclusion", "Innovative product", "Meaningful work",
                                "Progressive leadership", "Great tech and tools", "Data driven decision", "Transparency and respect",
                                "Working with great people", "Development and progression", "Flexibility and wellbeing"].map((interest, index) => (
                                    <button key={index} className="py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-blue-100">
                                        {interest}
                                    </button>
                                ))}
                        </div> */}
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input type="text" placeholder="Enter name here" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input type="text" placeholder="Enter name here" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input type="email" placeholder="Work email" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tell us about what you do</label>
                                <input type="text" placeholder="Enter your tagline..." className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                        </form>
                        <div className="flex justify-between">
                            <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                            <button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Complete your profile</h2>
                        <p className="text-gray-500 mb-4">Tell us more about your experience</p>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience</label>
                                <textarea placeholder="Share your experience..." className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                        </form>
                        <div className="flex justify-between">
                            <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                            <button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded">Next</button>
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
                                <input type="password" placeholder="Enter password" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" placeholder="Confirm password" className="mt-1 p-2 border border-gray-300 rounded w-full" />
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
        </div>
    );
}

export default FormifyProject;
