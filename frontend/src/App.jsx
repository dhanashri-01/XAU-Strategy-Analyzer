import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Strategy from "./pages/Strategy";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
function App() {

  return (

    <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/strategy" element={<Strategy />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/history" element={<History />} />
</Routes>

  );

}

export default App;