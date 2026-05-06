module.exports = {
  getTopViews: async function (req, res) {
    try {
      const redis = await sails.helpers.redisClient();

      // Lệnh ZREVRANGE lấy theo thứ tự giảm dần (Top đầu)
      const topIdsWithScores = await redis.zrevrange('product_rankings', 0, 9, 'WITHSCORES');

      if (!topIdsWithScores.length) {
        return res.json([]);
      }

      // Tách mảng [id, score, id, score...] thành Object dễ dùng
      const ids = [];
      const scoresMap = {};
      for (let i = 0; i < topIdsWithScores.length; i += 2) {
        const id = topIdsWithScores[i];
        const score = topIdsWithScores[i + 1];
        ids.push(id);
        scoresMap[id] = score;
      }

      // Lấy thông tin sản phẩm này từ MongoDB
      const products = await Product.find({ id: ids });

      // Gắn điểm số (view count) vào và sắp xếp lại cho chuẩn thứ tự Top
      const result = products.map(p => ({
        ...p,
        views: parseInt(scoresMap[p.id]) || 0
      })).sort((a, b) => b.views - a.views);

      return res.json(result);
    } catch (err) {
      sails.log.error('Lỗi khi lấy Top Views:', err);
      return res.serverError(err);
    }
  }
};
