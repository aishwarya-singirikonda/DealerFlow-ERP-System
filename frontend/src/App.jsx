import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dealers from "./pages/Dealers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import OrderDetails from "./pages/OrderDetails";

// Dealer Pages
import DealerLogin from "./pages/DealerLogin";
import DealerDashboard from "./pages/DealerDashboard";

// Temporary pages (we will create these next)
import DealerProducts from "./pages/DealerProducts";
import DealerOrders from "./pages/DealerOrders";
import DealerPayments from "./pages/DealerPayments";
import DealerProfile from "./pages/DealerProfile";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import DealerProtectedRoute from "./components/DealerProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Admin Routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dealers"
          element={
            <ProtectedRoute>
              <Dealers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* Dealer Routes */}

        <Route
          path="/dealer/login"
          element={<DealerLogin />}
        />

        <Route
  path="/dealer/dashboard"
  element={
    <DealerProtectedRoute>
      <DealerDashboard />
    </DealerProtectedRoute>
  }
/>
        <Route
          path="/dealer/products"
          element={
            <DealerProtectedRoute>
              <DealerProducts />
            </DealerProtectedRoute>
          }
        />

        <Route
          path="/dealer/orders"
          element={
            <DealerProtectedRoute>
              <DealerOrders />
            </DealerProtectedRoute>
          }   
        />

        <Route
          path="/dealer/payments"
          element={
            <DealerProtectedRoute>
              <DealerPayments />
            </DealerProtectedRoute>
          }
        />

        <Route
          path="/dealer/profile"
          element={
            <DealerProtectedRoute>
              <DealerProfile />
            </DealerProtectedRoute>
          } 
        />

        <Route
          path="/users"
          element={<Users />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;