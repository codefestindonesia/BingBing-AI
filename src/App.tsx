import '@/output.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Register from '@pages/Register';
import AddProduct from '@pages/AddProduct';
import ProductDetail from '@pages/ProductDetail';
import ProtectedRoute from './routes/ProtectedRoute';
import UnauthorizedRoute from './routes/UnauthorizedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { AgentProvider } from '@ic-reactor/react';
import { ServiceContextProvider } from './contexts/ServiceContext';
import TryOn from '@pages/TryOn';
import Carts from '@pages/Cart';
import Favorite from '@pages/Favorite';
import Checkout from '@pages/CheckOut';
import History from '@pages/History';
import UpdateProfile from '@pages/UpdateProfile';
import UpdateProduct from '@pages/UpdateProduct';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key="login" path="/login" element={<UnauthorizedRoute><Login /></UnauthorizedRoute>} />,
    <Route key="register" path="/register" element={<UnauthorizedRoute><Register /></UnauthorizedRoute>} />,

    <Route key="home" path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />,
    <Route key="profile" path="/profile/:principal" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
    <Route key="addProduct" path="/addProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />,
    <Route key="productDetail" path="/productDetail/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />,
    <Route key="editProduct" path="/editProduct/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />,
    <Route key="tryon" path="/tryon/:id" element={<ProtectedRoute><TryOn /></ProtectedRoute>} />,
    <Route key="cart" path="/cart" element={<ProtectedRoute><Carts /></ProtectedRoute>} />,
    <Route key="favorite" path="/favorite" element={<ProtectedRoute><Favorite /></ProtectedRoute>} />,
    <Route key="checkout" path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />,
    <Route key="history" path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />,
    <Route key="editProfile" path="/editProfile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />,
  ]),
);

export default function App() {

  return (
    <AgentProvider withProcessEnv>
      <ServiceContextProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ServiceContextProvider>
    </AgentProvider>
  );
}