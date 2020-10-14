"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Product = _interopRequireDefault(require("../models/Product"));

var _product = _interopRequireDefault(require("../helpers/validation/product"));

var _authorize = _interopRequireDefault(require("../helpers/middleware/authorize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();
/**
 * @route GET api/v1/menu
 * @desc  Get Product menu
 * @access  Public
 */


router.get('/', async (req, res) => {
  const product = new _Product.default(req.body);

  try {
    const menu = await product.getMenu();

    if (menu) {
      return res.status(200).json({
        status: 'success',
        message: 'menu Fetched successfully!',
        menu
      });
    }

    return res.status(404).json({
      message: 'There is no Product in the menu'
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
});
/**
 * @route GET api/v1/menu/:productId
 * @desc  Get Product by product id
 * @access  Public
 */

router.get('/:productId', async (req, res) => {
  const products = new _Product.default(req.params);

  try {
    const product = await products.getMenuByProductNumber(req.params.productId);

    if (product) {
      return res.status(200).json({
        status: 'success',
        message: 'product Fetched successfully!',
        product
      });
    }

    return res.status(404).json({
      message: 'The product with given id was not found.'
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
});
(0, _authorize.default)(router);
/**
 * @route GET api/v1/menu/:productId
 * @desc  Get Product by admin id
 * @access  Public
 */

router.get('/:userId/products', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const products = new _Product.default(req.params);

    try {
      const product = await products.getMenuByAdminId(req.params.userId);

      if (product) {
        return res.status(200).json({
          status: 'success',
          message: 'product Fetched successfully!',
          product
        });
      }

      return res.status(404).json({
        message: 'This Admin has not added product yet.'
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access Denied'
    });
  }
});
/**
 * @route POST api/v1/menu
 * @desc  Add Product to menu
 * @access  Private
 */

router.post('/', async (req, res) => {
  if (req.query.role === 'admin' || req.query.role === 'superAdmin') {
    const {
      errors,
      isValid
    } = (0, _product.default)(req.body);

    try {
      if (!isValid) {
        return res.status(400).json({
          errors
        });
      }

      const product = new _Product.default(req.body);
      const productExist = await product.checkItemExistBefore(req.body);

      if (!productExist) {
        const newProduct = await product.createProduct(req.query.id);

        if (newProduct) {
          const createdBy = await product.createdBy(newProduct.user_id);
          return res.status(201).json({
            status: 'success',
            message: 'product added successfully',
            newProduct,
            createdBy
          });
        }

        return res.status(500).json({
          error: 'Problem adding product'
        });
      }

      errors.name = 'Product name already exists';
      return res.status(422).json({
        status: 'failed',
        errors,
        name: productExist.name
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access Denied'
    });
  }
});
/**
 * @route PUT api/v1/menu/products/:productId
 * @desc  Update a product in menu
 * @access  Private
 */

router.put('/products/:productId', async (req, res) => {
  if (req.query.role === 'admin' || req.query.role === 'superAdmin') {
    const {
      errors,
      isValid
    } = (0, _product.default)(req.body);

    try {
      if (!isValid) {
        return res.status(400).json({
          errors
        });
      }

      const products = new _Product.default(req.body);
      const product = await products.getMenuByProductNumber(req.params.productId);

      if (product) {
        const editMenu = await products.editMenu(req.body, product[0].product_number);

        if (editMenu) {
          const updatedBy = await products.createdBy(req.query.id);
          return res.status(200).json({
            status: 'success',
            message: 'product updated successfully',
            product: editMenu,
            updatedBy
          });
        }

        return res.status(400).json({
          error: 'Problem updating product'
        });
      }

      return res.status(404).json({
        message: 'The product with given id was not found.'
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access Denied'
    });
  }
});
/**
 * @route DELETE api/v1/menu/products/:productId
 * @desc  Delete a product from the menu
 * @access  Private
 */

router.delete('/products/:productId', async (req, res) => {
  if (req.query.role === 'admin' || req.query.role === 'superAdmin') {
    try {
      const products = new _Product.default(req.params);
      const product = await products.getMenuByProductNumber(req.params.productId);

      if (product[0]) {
        const deleteMenu = await products.deleteProduct(req.query.id, product[0].product_number);

        if (deleteMenu.value) {
          const deletedBy = await products.createdBy(req.query.id);
          return res.status(200).json({
            status: 'success',
            message: 'product deleted successfully',
            deletedBy
          });
        }

        return res.status(400).json({
          error: 'Problem deleting product'
        });
      }

      return res.status(404).json({
        message: 'The product with given id was not found.'
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      message: 'Access Denied'
    });
  }
});
var _default = router;
exports.default = _default;