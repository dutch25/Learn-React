import Layout from './components/layout.jsx';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ManageProduct from './pages/ManageProduct.jsx';
import Products from './pages/ProductsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';


function App() {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsAuth(!!localStorage.getItem('token'));
      const user = localStorage.getItem('user');
      setUserRole(user ? JSON.parse(user).role : null);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('login', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('login', handleStorage);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={isAuth ? <ManageProduct /> : <Navigate to="/login" />} />
          <Route 
            path="manage" 
            element={isAuth && userRole === 'manager' ? <ManageProduct /> : <Navigate to="/products" />} 
          />
          <Route path="products" element={<ProductsPage />} />
          <Route path="about" element={<h1>About Page</h1>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
