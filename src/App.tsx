import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import CarbonTracker from "./pages/CarbonTracker"
import EcoMarket from './pages/EcoMarket';
import Profile from './pages/Profile';
import Settings from './pages/Setting';


const App = () => {
  return (
      <Router>
      <div > {/* padding to push content below navbar */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/CarbonTracker" element={<CarbonTracker />} />
          <Route path="/EcoMarket" element={<EcoMarket />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
