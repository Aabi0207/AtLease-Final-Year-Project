import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerOnlyRoute from './components/CustomerOnlyRoute';
import Home from './pages/Home';
import RoleLoginPage from './pages/RoleLoginPage';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddWarehousePage from './pages/AddWarehousePage';
import Warehouses from './pages/Warehouses';
import WarehouseDetail from './pages/WarehouseDetail';
import BookingFlow from './pages/BookingFlow';
import PaymentFlow from './pages/PaymentFlow';
import CertificatesPage from './pages/CertificatesPage';
import CertificatePage from './pages/CertificatePage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen text-[var(--text)]">
            <Navbar />
            <main className="pt-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/certificate/:id" element={<CertificatePage />} />
                <Route path="/login" element={<RoleLoginPage role="customer" />} />
                <Route path="/login/customer" element={<RoleLoginPage role="customer" />} />
                <Route path="/login/vendor" element={<RoleLoginPage role="vendor" />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<CustomerOnlyRoute />}>
                  <Route path="/marketplace" element={<Warehouses />} />
                  <Route path="/warehouses" element={<Warehouses />} />
                  <Route path="/warehouses/:id" element={<WarehouseDetail />} />
                  <Route path="/book/:id" element={<BookingFlow />} />
                  <Route path="/book/:id/payment" element={<PaymentFlow />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-warehouse" element={<AddWarehousePage />} />
                  <Route path="/edit-warehouse/:id" element={<AddWarehousePage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
