import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Store from './pages/Store';
import Admin from './pages/Admin';
import DriverPortal from './pages/DriverPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/drivers" element={<DriverPortal />} />
        <Route path="/driver" element={<DriverPortal />} />
        <Route path="/entregador" element={<DriverPortal />} />
        <Route path="/entregadores" element={<DriverPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
