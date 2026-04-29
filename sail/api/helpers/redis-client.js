const Redis = require('ioredis');
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

redis.on('connect', () => {
  sails.log.info('Đã kết nối thành công tới Redis Server!');
});

redis.on('error', (err) => {
  sails.log.error('Lỗi kết nối Redis:', err);
});

module.exports = {

  friendlyName: 'Redis client',

  description: 'Cung cấp kết nối dùng chung tới Redis',

  inputs: {

  },

  exits: {

    success: {
      description: 'Trả về instance của ioredis.',
    },

  },

  fn: async function (inputs) {
    return redis;
  }

};
