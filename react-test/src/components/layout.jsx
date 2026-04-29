import "./layout.css";
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Button from "./Button";




export default function Layout() {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }

  return (
    <div className="cms-container">
      <header className="cms-header">
        <h1 className="cms-title"><Link to="/" style={{ textDecoration: 'none' }}>CMS</Link></h1>
      </header>
      <div className="cms-body">
        <aside className="cms-sidebar">
          <nav>
            <ul>
              <button onClick={toggleTheme} className="theme-toggle">{theme === "light" ? "Dark Mode" : "Light Mode"}</button>

              <li><Link to="/products" className="LinkDay" >Products</Link></li>
              {user?.role === 'manager' && (
                <li><Link to="/manage" className="LinkDay" >Add Product</Link></li>
              )}
              <li><Link to="/about" className="LinkDay" >About</Link></li>
              <hr />
              {token ? (
                <>
                  <p style={{ fontSize: '18px' }}>Hi, {user.fullName}!</p>
                  <Button onClick={handleLogout} className="btn-logout">Đăng Xuất</Button>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="LinkDay" >Login</Link></li>
                  <li><Link to="/register" className="LinkDay" >Register</Link></li>
                </>
              )}


            </ul>
          </nav>
        </aside>

        <main className="cms-content"><Outlet /></main>
      </div>
    </div>
  );
}