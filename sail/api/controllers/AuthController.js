const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = "your_jwt_secret_key";

module.exports = {
  register: async function (req, res) {
    try {
      const { fullName, email, password } = req.allParams();
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
      
      const newUser = await User.create({
        fullName,
        email,
        password
      }).fetch();

      return res.status(201).json({ 
        message: 'Đăng ký thành công',
        user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName }
      });
    } catch (err) { 
      return res.serverError(err); 
    }
  },

  login: async function (req, res) {
    try {
      const { email, password } = req.allParams();
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

      return res.json({ 
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
      });
    } catch (err) { 
      return res.serverError(err); 
    }
  }
};