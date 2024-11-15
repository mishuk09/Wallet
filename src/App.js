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

  // Define the handleBusinessClaimed function to handle business claiming logic
  const handleBusinessClaimed = (claimedBusiness) => {
    console.log("Business claimed:", claimedBusiness);
    // Add any further logic here if needed
  };

  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path='/register' element={<FormifyProject walletAddress="some-wallet-address" onBusinessClaimed={handleBusinessClaimed} />
          } />
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
