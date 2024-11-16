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