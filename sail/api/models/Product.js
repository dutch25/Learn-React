/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    image: { type: 'string' },
    category: { type: 'string', defaultsTo: 'Chưa phân loại' },
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  // Lifecycle Callbacks
  afterUpdate: async function (updatedRecord, proceed) {
    try {
      const redis = await sails.helpers.redisClient();
      await redis.del(`product:${updatedRecord.id}`);
      sails.log.info(`[CACHE CLEAR] Đã xóa cache của sản phẩm ${updatedRecord.id} vì vừa cập nhật.`);
    } catch (err) {
      sails.log.error('Lỗi khi xóa cache Redis:', err);
    }
    return proceed();
  },

  afterDestroy: async function (destroyedRecord, proceed) {
    try {
      const redis = await sails.helpers.redisClient();
      await redis.del(`product:${destroyedRecord.id}`);
      sails.log.info(`[CACHE CLEAR] Đã xóa cache của sản phẩm ${destroyedRecord.id} vì đã xóa khỏi DB.`);
    } catch (err) {
      sails.log.error('Lỗi khi xóa cache Redis:', err);
    }
    return proceed();
  }

};

