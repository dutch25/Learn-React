const bcrypt = require('bcryptjs');

module.exports = {
  attributes: {
    email: { type: 'string', required: true, unique: true, isEmail: true },
    password: { type: 'string', required: true },
    fullName: { type: 'string' },
    role: { type: 'string', defaultsTo: 'user', isIn: ['user', 'manager'] }
  },
  beforeCreate: async function (valuesToSet, proceed) {
    valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
    return proceed();
  }
};