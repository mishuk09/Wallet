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
        <div>
            <h3>Business: {business.name}</h3>
            <p>Call {business.phone} for the security code.</p>
            <input
                type="text"
                placeholder="Enter Security Code"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
            />
            <button onClick={handleVerifyCode}>Verify Code</button>
        </div>
    );
};

export default VerifyBusiness;
