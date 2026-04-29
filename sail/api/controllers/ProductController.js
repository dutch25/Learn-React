/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path');

module.exports = {

  getCategories: async function (req, res) {
    try {
      const products = await Product.find();
      // Extract unique non-empty categories
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      return res.json(categories);
    } catch (err) {
      return res.serverError(err);
    }
  },

  find: async function (req, res) {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const search = req.query.search || '';

      let query = {
        skip: skip,
        limit: limit
      };

      if (search) {
        query.where = { name: { contains: search } };
      }

      const products = await Product.find(query);
      const total = await Product.count(query.where || {});

      return res.json({
        data: products,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      return res.serverError(err);
    }
  },

  findOne: async function (req, res) {
    try {
      const product = await Product.findOne({ id: req.params.id });
      if (!product) return res.notFound('Không tìm thấy sản phẩm');
      return res.json(product);
    } catch (err) {
      return res.serverError(err);
    }
  },

  create: async function (req, res) {

    req.file('image').upload({
      maxBytes: 10000000,
      dirname: path.resolve(sails.config.appPath, 'assets/images/products')
    }, async function done(err, uploadedFiles) {
      if (err) return res.serverError(err);

      let imageRelativePath = null;
      if (uploadedFiles.length > 0) {
        const filename = path.basename(uploadedFiles[0].fd);
        imageRelativePath = `/images/products/${filename}`;
      }

      try {
        let categoryName = req.body.category ? req.body.category.trim() : '';
        if (categoryName) {
          categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
        } else {
          categoryName = 'Chưa phân loại';
        }

        const newProduct = await Product.create({
          name: req.body.name,
          price: Number(req.body.price),
          image: imageRelativePath,
          category: categoryName
        }).fetch();

        return res.status(201).json(newProduct);
      } catch (dbErr) {
        return res.serverError(dbErr);
      }
    });
  },

  update: async function (req, res) {
    const productId = req.params.id;

    req.file('image').upload({
      maxBytes: 10000000,
      dirname: path.resolve(sails.config.appPath, 'assets/images/products')
    }, async function done(err, uploadedFiles) {
      if (err) return res.serverError(err);

      let categoryName = req.body.category ? req.body.category.trim() : '';
      if (categoryName) {
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
      } else {
        categoryName = 'Chưa phân loại';
      }

      let updateData = {
        name: req.body.name,
        price: Number(req.body.price),
        category: categoryName
      };

      if (uploadedFiles.length > 0) {
        const filename = path.basename(uploadedFiles[0].fd);
        updateData.image = `/images/products/${filename}`;
      }

      try {
        const updatedProduct = await Product.updateOne({ id: productId }).set(updateData);
        if (!updatedProduct) return res.notFound();
        return res.json(updatedProduct);
      } catch (dbErr) {
        return res.serverError(dbErr);
      }
    });
  },

  destroy: async function (req, res) {
    try {
      const deletedProduct = await Product.destroyOne({ id: req.params.id });
      if (!deletedProduct) return res.notFound();
      return res.ok({ message: 'Xóa thành công', deletedProduct });
    } catch (err) {
      return res.serverError(err);
    }
  },



};

