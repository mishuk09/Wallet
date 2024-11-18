import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { db } from "../Firebase/firebase";
import { collection, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useNavigate } from 'react-router-dom';
const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco


function FormifyProject({ walletAddress, onBusinessClaimed }) {
    const nevigate = useNavigate(); // Initialize history
    const searchBoxRef = useRef(null);
    const [step, setStep] = useState(1);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [isBusinessClaimed, setIsBusinessClaimed] = useState(false); // Track claim status
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const { disconnect } = useDisconnect();
    const [addressWallet, setAddressWallet] = useState(""); // Initialize wallet address state
    //Fetch business address and phone state
    const [businessAddress, setBusinessAddress] = useState(""); // Store business data in state
    const [businessPhone, setBusinessPhone] = useState("");
    //code verification state
    const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
    // const [code, setCode] = useState("");
    const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const [popup, setPopup] = useState(false);


    //handle code change
    const handleCodeChange = (index, value) => {
        const newDigits = [...codeDigits];
        newDigits[index] = value.slice(0, 1);
        setCodeDigits(newDigits);

        //move to the next input feild if the current one is filled

        if (value && index < 3) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    }
    //handle code submit
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        const code = codeDigits.join("");
        if (code === "1234") {
            setIsCodeCorrect(true);
            console.log("Code is correct");
            setCodeDigits(["", "", "", ""]);
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
            }, 2000)

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



    // Handle wallet data store
    const handleWalletAddress = async () => {
        try {
            const addressDataCollection = collection(db, "stores");
            const q = query(addressDataCollection, where("wallet_address", "==", address)); // Query to find existing address
            const querySnapshot = await getDocs(q); // Execute the query

            // Check if any document with the same wallet_address exists
            if (!querySnapshot.empty) {
                const existingBusiness = querySnapshot.docs[0].data(); // Get the first document's data
                const isVerified = existingBusiness.isVerified; // Check the isVerified status

                if (isVerified) {
                    alert("Your Business & Wallet are already verified.");
                    nevigate('/'); // Navigate to home page
                    return; // Exit the function
                } else {
                    alert("Your wallet is associated with this business but not verified. Please proceed to verification.");
                    handleNext(); // Allow to proceed to step 4 for verification
                    return; // Exit the function
                }
            }

            // If no matching document is found, proceed to store the wallet data
            const userDocRef = doc(addressDataCollection, storeId); // Reference to the document for this business
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


    // When wallet is connected, set the address state
    useEffect(() => {
        if (isConnected) {
            setAddressWallet(address); // Ensure address state is updated
        }
    }, [isConnected, address]);


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
    // const handleClaimBusiness = async () => {
    //     setLoading(true);
    //     if (selectedBusiness) {
    //         try {
    //             const userDataCollection = collection(db, "stores");

    //             // Query to check if the wallet_address already exists in the database
    //             const querySnapshot = await getDocs(query(userDataCollection, where("wallet_address", "==", address)));

    //             // If any document matches, it means the wallet_address is already in use
    //             if (!querySnapshot.empty) {
    //                 const existingBusinessData = querySnapshot.docs[0].data(); // Get the first matching document
    //                 const isVerified = existingBusinessData.isVerified; // Check the isVerified status

    //                 if (isVerified) {
    //                     alert("This wallet address is already associated with a verified business.");
    //                     setLoading(false); // Reset loading state
    //                     return; // Exit the function if the wallet address is already verified
    //                 } else {
    //                     alert("This wallet address is associated with a business but not verified. Please proceed to verification.");
    //                     setIsBusinessClaimed(true); // Set claim status to true to enable the next button
    //                     setStep(4); // Redirect to step 4 for verification
    //                     setLoading(false); // Reset loading state
    //                     return; // Exit the function to allow verification
    //                 }
    //             }

    //             // If the wallet_address is not found, proceed to create a new document
    //             const businessDocRef = doc(userDataCollection); // Create a new document reference
    //             const newStoreId = businessDocRef.id; // Firestore-generated unique ID

    //             // Save the business claim data along with wallet information
    //             await setDoc(businessDocRef, {
    //                 business: selectedBusiness,
    //                 onboardingStep: 2,
    //                 isVerified: false,
    //                 storeId: newStoreId, // Save the store ID
    //                 // wallet_chain: chain?.name || "Unknown", // Include wallet chain
    //                 // wallet_address: address || "No address", // Include wallet address
    //             });

    //             console.log("Business claimed successfully with store ID:", newStoreId);
    //             setStoreId(newStoreId); // Save the storeId in state for later use
    //             setIsBusinessClaimed(true); // Update claim status

    //             // Pass the storeId along with selectedBusiness to the parent component if needed
    //             if (onBusinessClaimed) {
    //                 onBusinessClaimed({ ...selectedBusiness, storeId: newStoreId });
    //             }
    //             handleNext(); // Move to the next step after creating a new business
    //         } catch (error) {
    //             console.error("Error storing business data in Firestore:", error);
    //         } finally {
    //             setLoading(false); // Reset loading state
    //         }
    //     }
    // };


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



    //fetch business data in step 4

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
                }
            }
        } catch (error) {
            console.error("Error fetching business data:", error);
            return null;
        }
    };



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

    return (
        <div className="flex   bg-gray-100">

            {/* Alert for verify business */}
            {popup && (
                <div className="fixed top-2 right-2  " >
                    <div class="flex w-96 shadow-lg rounded-lg">    <div class="bg-green-600 py-4 px-4 rounded-l-lg flex items-center">      <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>    </div>    <div class="px-4 py-4 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">      <div>Business Verified</div>      <button>        <svg xmlns="http://www.w3.org/2000/svg" class="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>      </button>    </div>  </div>
                </div>
            )}
            <div className="w-1/3 fixed top-0 left-0 bg-gradient-to-t from-[#0a091a] via-[#161330] to-[#0a091a] text-white flex flex-col text-start pt-[200px] px-8 h-full">
                <h1 className="text-4xl font-semibold mb-6 leading-2">Welcome to Crypto Wallet!</h1>
                <p className="text-gray-300 mb-6">
                    Connect your wallet to start interacting with your crypto assets.
                    Create an account and explore the crypto world like never before.
                </p>
                <p className="text-gray-300 font-semibold mb-10">Sign up now for secure and seamless crypto transactions.</p>
            </div>

            <div className="w-2/3 ml-[33.33%] h-screen bg-white px-14 pt-14 overflow-y-auto">
                {/* Remaining content goes here */}
                <div className="">
                    <div className="flex items-center space-x-2">
                        {/* Only display the current step */}
                        {step === 1 && <span className="text-2xl flex items-center font-bold text-gray-800">Step 1 <span className="text-gray-600 ms-8  text-xl font-semibold">Select Business on Map</span></span>}
                        {step === 2 && <span className="text-2xl font-bold text-gray-800">Step 2 <span className="text-gray-600 ms-8  text-xl font-semibold">Fill out the form if you are business Owner</span></span>}
                        {step === 3 && <span className="text-2xl font-bold text-gray-800">Step 3 <span className="text-gray-600 ms-8  text-xl font-semibold">Connect to crypto wallet</span></span>}
                        {step === 4 && <span className="text-2xl font-bold text-gray-800">Step 4 <span className="text-gray-600 ms-8  text-xl font-semibold">Verify ownership of your business</span></span>}
                        {step === 5 && <span className="text-2xl font-bold text-gray-800">Step 5 <span className="text-gray-600 ms-8  text-xl font-semibold">Finished Your Registrations</span></span>}
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
                    <div className="text-start relative mt-12   mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Select Business on Map</h2>
                        <p className="text-gray-500 ">👋 Let's start your dream journey</p>

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
                                        {/* <div className="flex gap-10">
                                            <p> <span className="font-semibold">🌍 Latitude:</span> {selectedBusiness.lat} </p>
                                            <p> <span className="font-semibold">📍 Longitude:</span> {selectedBusiness.lng} </p>
                                        </div> */}
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
                    <div className="text-start relative mt-12  ">
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
                    <div className="text-start relative mt-12  ">
                        <h2 className="text-2xl font-semibold mb-4">This will be your wallet address for USDC payments</h2>
                        <p className="text-gray-500 mb-2">👋 Let's connect and verify</p>

                        <div className="mt-10 flex">


                            <div>
                                <ConnectButton />
                            </div>


                            <div>

                                {isConnected && (
                                    <button
                                        onClick={handleDisconnect}
                                        className="btn-style ml-4  ms-10"
                                    >
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-[200px] mb-16">
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
                {

                    step === 4 && (
                        <div className="text-start relative mt-12">
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

                            <div className="mt-10 flex mb-10 gap-4">
                                <div className="h-10 w-1/3 text-xl tracking-widest rounded border-blue-500 border-2 flex items-center text-center justify-center">
                                    {businessPhone}
                                </div>
                                <button
                                    onClick={() => setIsCodeInputVisible(true)}
                                    className="h-10 w-[150px] text-sm tracking-widest rounded border-blue-500 border-2 flex items-center text-center justify-center">
                                    📞 Call Now
                                </button>
                            </div>



                            {isCodeInputVisible && (
                                <form onSubmit={handleCodeSubmit} className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit code:</label>

                                    <div className="flex gap-4 items-center text-center  ">
                                        <div className="flex space-x-2 mt-1">
                                            {codeDigits.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`code-input-${index}`}
                                                    type="text"
                                                    value={digit}
                                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                                    maxLength={1}
                                                    className="w-10 h-10 text-center border text-sm border-gray-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                                    required
                                                />
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            className="  bg-green-600 text-white text-sm px-4 ms-4 w-100 h-10 rounded">
                                            Submit Code
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="flex justify-between mt-14 mb-10">
                                <button onClick={handlePrevious} className="btn-style w-1/4 rounded">Previous</button>
                                <button
                                    onClick={handleNext}
                                    className={`btn-style w-1/4 rounded ${!isCodeCorrect ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!isCodeCorrect}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Step 5 */}
                {step === 5 && (
                    <div className="text-start   relative mt-12">
                        <h2 className="text-2xl font-semibold mb-4">You are Almoas't There</h2>
                        <p className="text-gray-500 mb-16">✅ Let's finished  </p>

                        <a href="/" className="bg-green-600 mt-20 text-white text-sm py-2 px-10 rounded-full">

                            Finish
                            {/* <div className="mt-20">
                                <div class="frame"  >
                                    <input type="checkbox" id="button" class="hidden input-section" />
                                    <label for="button" class="button  bg-green-600">Finish<img src="https://100dayscss.com/codepen/checkmark-green.svg" alt="alertimg" /></label>
                                    <svg class="circle">
                                        <circle cx="30" cy="30" r="29" />
                                    </svg>
                                </div>
                            </div> */}
                        </a>






                        <div className="flex justify-between mt-[200px] mb-10">
                            <button onClick={handlePrevious} className="btn-style w-1/4 rounded">Previous</button>
                            {/* <button
                                onClick={handleNext}
                                className={`btn-style w-1/4 rounded ${!isCodeCorrect ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!isCodeCorrect}>
                                Next
                            </button> */}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default FormifyProject;
