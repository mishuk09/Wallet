import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BusinessSearch from './components/GoogleMap/BusinessSearch';
import { useState } from 'react';
import ConnectWallet from './components/Wallet/ConnectWallet';
import HomeScreen from './components/Wallet/HomeScreen';
import VerifyBusiness from './components/Wallet/VerifyBusiness';
import FormifyProject from './components/onBoard/FormifyProject';
import Home from './components/Home/Home';

function App() {
  const [step, setStep] = useState(1); // Step to control the flow
  const [walletAddress, setWalletAddress] = useState(null); // Store wallet address
  const [selectedBusiness, setSelectedBusiness] = useState(null); // Store the selected business

  // Callback for handling wallet connection
  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    setStep(2); // Move to step 2 after wallet connection
  };

  // Callback for handling business claim
  const handleBusinessClaimed = (business) => {
    setSelectedBusiness(business);  // Update selected business
    setStep(3);  // Move to the next step after claiming business
  };

  // Callback for when business verification is complete
  const handleVerificationComplete = () => {
    setStep(4); // Final step after verification
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={
            <div>
              {step === 1 && <ConnectWallet onWalletConnected={handleWalletConnected} />}
              {step === 2 && walletAddress && <BusinessSearch walletAddress={walletAddress} onBusinessClaimed={handleBusinessClaimed} />}
              {step === 3 && selectedBusiness && <VerifyBusiness walletAddress={walletAddress} business={selectedBusiness} onVerificationComplete={handleVerificationComplete} />}
              {step === 4 && <HomeScreen />}
            </div>
          } />
          <Route path='/register' element={<FormifyProject />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
