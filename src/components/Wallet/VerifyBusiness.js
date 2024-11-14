import React, { useState } from "react";
import { db } from "../Firebase/firebase"; // Correct import path

const VerifyBusiness = ({ walletAddress, business, onVerificationComplete }) => {
    const [securityCode, setSecurityCode] = useState("");
    const correctCode = "1234"; // Example code, replace with real verification

    const handleVerifyCode = async () => {
        if (securityCode === correctCode) {
            await db.collection("users").doc(walletAddress).update({
                verified: true,
                onboardingStep: 3,
            });
            onVerificationComplete(); // Notify parent component
        } else {
            alert("Incorrect code. Try again.");
        }
    };

    return (
        <div className="max-w-md mt-10 mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4"> {business.name}</h3>
            <p className="text-lg text-gray-600 mb-6">Call : {business.phone} for the security code.</p>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter Security Code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={handleVerifyCode}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Verify Code
            </button>
        </div>

    );
};

export default VerifyBusiness;
