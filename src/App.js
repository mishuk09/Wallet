import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BusinessSearch from './components/GoogleMap/BusinessSearch';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<BusinessSearch />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
