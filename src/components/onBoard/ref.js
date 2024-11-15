import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FormifyProject from './components/onBoard/FormifyProject';
import Home from './components/Home/Home';

import { Chain, configureChains, createClient, WagmiConfig, infuraProvider } from 'wagmi'; // Import infuraProvider
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'; // Correct the import

const { chains, provider } = configureChains([Chain.Base], [infuraProvider()]); // Add correct provider
const wagmiClient = createClient({
  autoConnect: true,
  provider,
});

function App() {

  // Define the handleBusinessClaimed function to handle business claiming logic
  const handleBusinessClaimed = (claimedBusiness) => {
    console.log("Business claimed:", claimedBusiness);
    // Add any further logic here if needed
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <Router>
            <Routes>

              <Route
                path='/register'
                element={
                  <FormifyProject
                    walletAddress="some-wallet-address"
                    onBusinessClaimed={handleBusinessClaimed}
                  />
                }
              />
              <Route path='/' element={<Home />} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
