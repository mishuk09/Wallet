import React, { useState } from "react";

function FormifyProject() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-gray-900 text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold mb-6">Start your project with Formify!</h1>
                <p className="text-sm mb-6">
                    Create account, and tell us more about your business goals. We’ll get
                    back to you within 1 working day.
                </p>
                <p className="text-sm mb-10">Curious about what we can do for you? We are happy to tell you more!</p>
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/50" alt="Vincent Staude" className="rounded-full mr-4" />
                    <div>
                        <h2 className="font-bold">Vincent Staude</h2>
                        <p className="text-sm">Support Lead</p>
                        <p className="text-sm">info@picmaticweb.com</p>
                        <p className="text-sm">(123) 456 7890</p>
                    </div>
                </div>
            </div>

            <div className="w-2/3 bg-white p-10">
                <div className="mb-6">
                    <div className="flex items-center space-x-2">
                        <span className={`text-xl ${step >= 1 ? "text-green-500" : "text-gray-400"}`}>Step 1</span>
                        <span className={`text-xl ${step >= 2 ? "text-blue-500" : "text-gray-400"}`}>Step 2</span>
                    </div>
                    <progress value={step} max="3" className="w-full h-1 mt-2 bg-gray-200 rounded-full"></progress>
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Create your account</h2>
                        <p className="text-gray-500 mb-4">👋 Let's start your dream journey</p>
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
                        <button onClick={handleNext} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Set work preferences</h2>
                        <p className="text-gray-500 mb-4">Choose at least 3 interests to get started.</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {["Challenging work", "Diversity and inclusion", "Innovative product", "Meaningful work",
                                "Progressive leadership", "Great tech and tools", "Data driven decision", "Transparency and respect",
                                "Working with great people", "Development and progression", "Flexibility and wellbeing"].map((interest, index) => (
                                    <button key={index} className="py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-blue-100">
                                        {interest}
                                    </button>
                                ))}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={handlePrevious} className="bg-gray-200 text-gray-700 py-2 px-4 rounded">Previous</button>
                            <button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormifyProject;
