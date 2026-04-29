import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Mật khẩu xác nhận không khớp!');
    }

    try {
      await axios.post('http://localhost:1337/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      alert('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi đăng ký, email có thể đã tồn tại');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng Ký Tài Khoản</h2>
        <div className="form-group">
          <label>Họ và Tên:</label>
          <input 
            type="text" name="fullName" 
            value={formData.fullName} onChange={handleChange} required 
          />
        </div>
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
        <div className="form-group">
          <label>Xác nhận mật khẩu:</label>
          <input 
            type="password" name="confirmPassword" 
            value={formData.confirmPassword} onChange={handleChange} required 
          />
        </div>
        <button type="submit" className="btn-auth">Đăng Ký</button>
        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </form>
    </div>
  );
};

export default Register;