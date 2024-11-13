import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import { db } from "../Firebase/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

const BusinessSearch = ({ walletAddress, onBusinessSelected }) => {
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const searchBoxRef = useRef(null);

    const handleSearchBoxPlaces = async () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = place.geometry.location;

            // Log the selected place details for debugging
            console.log("Selected place details:", place);

            // Fallbacks for missing fields
            const businessDetails = {
                name: place.name || "No name available",
                lat: location.lat(),
                lng: location.lng(),
                phone: place.formatted_phone_number || "Contact not available",
            };

            // Set map center and selected business state
            setMapCenter({
                lat: location.lat(),
                lng: location.lng(),
            });
            setSelectedBusiness(businessDetails);

            // Update Firestore with business details
            try {
                const userDocRef = doc(collection(db, "users"), walletAddress);
                await updateDoc(userDocRef, {
                    business: businessDetails,
                    onboardingStep: 2,
                });
                onBusinessSelected(businessDetails);
            } catch (error) {
                console.error("Error updating Firestore document:", error);
            }
        } else {
            console.warn("No places found in search results.");
        }
    };

    const handleMapClick = (event) => {
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
    };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDOEDZEEqWAyWNyKpBNrhF9Cxti0AfRVDU"  // Replace with your actual API key
            libraries={["places"]}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={mapCenter}
                onClick={handleMapClick}
            >
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
                        }}
                    />
                </StandaloneSearchBox>

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
                    <button className="w-1/2 p-2 bg-blue-600 rounded text-white mt-6" onClick={() => onBusinessSelected(selectedBusiness)}>Claim this Business</button>
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
