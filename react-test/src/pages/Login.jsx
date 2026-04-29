import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1337/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('Đăng nhập thành công!');
      window.dispatchEvent(new Event('login'));
      navigate('/products'); 
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Sai tài khoản hoặc mật khẩu';
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" name="email" 
            value={formData.email} onChange={handleChange} required 
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input 
            type="password" name="password" 
            value={formData.password} onChange={handleChange} required 
          />
        </div>
        <button type="submit" className="btn-auth">Đăng Nhập</button>
        <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
      </form>
    </div>
  );
};

export default Login;