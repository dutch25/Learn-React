module.exports = {

  friendlyName: 'Cache product',

  description: 'Lấy sản phẩm từ Redis Cache, nếu không có thì lấy từ MongoDB và tự động lưu vào Cache.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'ID của sản phẩm cần lấy'
    }
  },

  exits: {
    success: {
      description: 'Trả về dữ liệu sản phẩm.',
    },
    notFound: {
      description: 'Không tìm thấy sản phẩm.',
    }
  },

  fn: async function (inputs, exits) {
    const { id } = inputs;
    
    // Gọi Helper redisClient để lấy kết nối dùng chung
    const redis = await sails.helpers.redisClient();
    const cacheKey = `product:${id}`;

    try {
      // 1. Tìm trong Cache trước
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        sails.log.info(`[CACHE HIT] Lấy sản phẩm ${id} từ Redis`);
        return exits.success(JSON.parse(cachedData));
      }

      // 2. Nếu Cache Miss, tìm trong Database
      sails.log.info(`[CACHE MISS] Lấy sản phẩm ${id} từ MongoDB`);
      const product = await Product.findOne({ id: id });

      if (!product) {
        return exits.notFound();
      }

      // 3. Lưu lại vào Cache cho lần sau (hạn dùng 1 tiếng = 3600s)
      await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);

      // Trả về sản phẩm
      return exits.success(product);
    } catch (err) {
      sails.log.error('Lỗi trong quá trình lấy Cache:', err);
      // Fallback: Nếu Redis lỗi, vẫn cố lấy từ DB để hệ thống không sập
      const product = await Product.findOne({ id: id });
      if (!product) return exits.notFound();
      return exits.success(product);
    }
  }

};
