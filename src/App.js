import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import FormifyProject from './components/onBoard/FormifyProject';
import Home from './components/Home/Home';

function App() {

  // Define the handleBusinessClaimed function to handle business claiming logic
  const handleBusinessClaimed = (claimedBusiness) => {
    console.log("Business claimed:", claimedBusiness);
    
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
