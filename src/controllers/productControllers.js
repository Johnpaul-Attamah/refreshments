import express from 'express';
import Product from '../models/Product';
import validateProducts from '../helpers/validation/product';
import authorizeUser from '../helpers/middleware/authorize';
import cloudinary from '../utils/cloudinary';
import upload from '../utils/multer';


const router = express.Router();

/**
 * @route GET api/v1/menu
 * @desc  Get Product menu
 * @access  Public
 */
router.get('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const menu = await product.getMenu();
    if (menu[0]) {
      return res.status(200).json({
        status: 'success',
        message: 'menu Fetched successfully!',
        menu,
      });
    }
    return res.status(404).json({ message: 'There is no Product in the menu' });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
/**
 * @route GET api/v1/menu/:productId
 * @desc  Get Product by product id
 * @access  Public
 */
router.get('/:productId', async (req, res) => {
  const products = new Product(req.params);
  try {
    const product = await products.getMenuByProductNumber(req.params.productId);
    if (product) {
      return res.status(200).json({
        status: 'success',
        message: 'product Fetched successfully!',
        product,
      });
    }
    return res.status(404).json({ message: 'The product with given id was not found.' });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

authorizeUser(router);
/**
 * @route GET api/v1/menu/:productId
 * @desc  Get Product by admin id
 * @access  Public
 */
router.get('/:userId/products', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const products = new Product(req.params);
    try {
      const product = await products.getMenuByAdminId(req.params.userId);
      if (product) {
        return res.status(200).json({
          status: 'success',
          message: 'product Fetched successfully!',
          product,
        });
      }
      return res.status(404).json({ message: 'This Admin has not added product yet.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route POST api/v1/menu
 * @desc  Add Product to menu
 * @access  Private
 */
router.post('/', upload.single('image'), async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    const { errors, isValid } = validateProducts(req.body);
    try {
      if (!isValid) {
        return res.status(400).json({ errors });
      }
      const product = new Product(req.body);
      const productExist = await product.checkItemExistBefore(req.body);
      if (!productExist) {
        const result = await cloudinary
          .uploader.upload(req.file.path, { upload_preset: 'fast_food' });
          const newProduct = await product.createProduct(req.query.id, result.secure_url, result.public_id);
        if (newProduct) {
          const createdBy = await product.createdBy(newProduct.user_id);
          return res.status(201).json({
            status: 'success',
            message: 'product added successfully',
            newProduct,
            createdBy,
          });
        }
        return res.status(500).json({ error: 'Problem adding product' });
      }
      errors.name = 'Product name already exists';
      return res.status(422).json({
        status: 'failed',
        errors,
        name: productExist.name,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route PUT api/v1/menu/products/:productId
 * @desc  Update a product in menu
 * @access  Private
 */
router.put('/products/:productId', upload.single('image'), async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    const { errors, isValid } = validateProducts(req.body);
    try {
      if (!isValid) {
        return res.status(400).json({ errors });
      }
      const products = new Product(req.body);
      const product = await products.getMenuByProductNumber(req.params.productId);
      if (product) {
        let result;
        if (req.file) {
          await cloudinary.uploader.destroy(product[0].cloudinary_id);
          result = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: 'fast_food',
          });
        }
        const data = {
          name: req.body.name || product[0].name,
          productImg: result ? result.secure_url : product[0].product_img,
          cloudinaryId: result ? result.public_id : product[0].cloudinary_id,
          quantity: req.body.quantity || product[0].quantity,
          price: req.body.price || product[0].price,
          description: req.body.description || product[0].description,
          productNumber: product[0].product_number,
        };
        const editMenu = await products.editMenu(data);
        if (editMenu) {
          const updatedBy = await products.createdBy(req.query.id);
          return res.status(200).json({
            status: 'success',
            message: 'product updated successfully',
            product: editMenu,
            updatedBy,
          });
        }
        return res.status(400).json({
          error: 'Problem updating product',
        });
      }
      return res.status(404).json({ message: 'The product with given id was not found.' });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route DELETE api/v1/menu/products/:productId
 * @desc  Delete a product from the menu
 * @access  Private
 */
router.delete('/products/:productId', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    try {
      const products = new Product(req.params);
      const product = await products.getMenuByProductNumber(req.params.productId);
      if (product[0]) {
        await cloudinary.uploader.destroy(product[0].cloudinary_id);
        const deleteMenu = await products.deleteProduct(req.query.id, product[0].product_number);
        if (deleteMenu.value) {
          const deletedBy = await products.createdBy(req.query.id);
          return res.status(200).json({
            status: 'success',
            message: 'product deleted successfully',
            deletedBy,
          });
        }
        return res.status(400).json({
          error: 'Problem deleting product',
        });
      }
      return res.status(404).json({ message: 'The product with given id was not found.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});


export default router;
