import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { db } from "../Firebase/firebase";
import { collection, doc, setDoc } from 'firebase/firestore';

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

const BusinessSearch = ({ walletAddress, onBusinessClaimed }) => {  // Corrected prop name to onBusinessClaimed
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const searchBoxRef = useRef(null);

    // Handle search box places
    const handleSearchBoxPlaces = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = place.geometry.location;

            // Ensure that we always get the correct details for name and phone
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

    // Handle business claim and save to Firestore
    const handleClaimBusiness = async () => {
        if (selectedBusiness) {
            // Store business details in Firestore under `googleMap > userData`
            try {
                const userDataCollection = collection(db, "googleMap");
                const businessDocRef = doc(userDataCollection, walletAddress);
                await setDoc(businessDocRef, {
                    business: selectedBusiness,
                    onboardingStep: 2,
                });
                console.log("Business claimed and saved to Firestore successfully.");

                // Trigger the callback to parent to move to the next step
                if (onBusinessClaimed) {
                    onBusinessClaimed(selectedBusiness);  // Pass selected business details back to parent
                }
            } catch (error) {
                console.error("Error storing business data in Firestore:", error);
            }
        }
    };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDOEDZEEqWAyWNyKpBNrhF9Cxti0AfRVDU"
            libraries={["places"]}
        >
            {/* Search Box - Positioned outside of GoogleMap */}
            <div className="search-box-container" style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1, width: "80%" }}>
                <StandaloneSearchBox
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={handleSearchBoxPlaces}
                >
                    <input
                        type="text"
                        placeholder="Search for businesses"
                        style={{
                            padding: "10px",
                            fontSize: "15px",
                            width: "100%",
                            boxSizing: "border-box",
                            borderRadius: "5px",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                        }}
                    />
                </StandaloneSearchBox>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={mapCenter}
                onClick={(event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    setMapCenter({ lat, lng });
                    setSelectedBusiness((prevBusiness) => ({
                        ...prevBusiness,
                        lat,
                        lng,
                        name: prevBusiness?.name || "Custom Location",
                        phone: prevBusiness?.phone || "N/A",
                    }));
                }}
            >
                {selectedBusiness && (
                    <Marker position={{ lat: selectedBusiness.lat, lng: selectedBusiness.lng }} />
                )}
            </GoogleMap>

            {selectedBusiness ? (
                <div className="container mt-6">
                    <h3><span className="font-semibold">Selected Business:</span> {selectedBusiness.name}</h3>
                    <p><span className="font-semibold">Contact:</span> {selectedBusiness.phone}</p>
                    <p><span className="font-semibold">Latitude:</span> {selectedBusiness.lat}</p>
                    <p><span className="font-semibold">Longitude:</span> {selectedBusiness.lng}</p>
                    <button
                        className="w-1/2 p-2 bg-blue-600 rounded text-white mt-6"
                        onClick={handleClaimBusiness} // Save to Firestore on button click
                    >
                        Claim this Business
                    </button>
                </div>
            ) : (
                <div>
                    <h3>No business selected</h3>
                </div>
            )}
        </LoadScript>
    );
};

export default BusinessSearch;
