import express from 'express';
import Order from '../models/Order';
import validateOrder from '../helpers/validation/order';
import authorizeUser from '../helpers/middleware/authorize';

const router = express.Router();

authorizeUser(router);

/**
 * @route GET api/v1/orders/
 * @desc  Get all orders
 * @access  Private
 */
router.get('/', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    try {
      const orderModel = new Order(req.query);
      const orders = await orderModel.getAllOrders();
      if (orders) {
        return res.status(200).json({
          status: 'success',
          message: 'orders fetched successfully!',
          orders,
        });
      }
      return res.status(404).json({ message: 'No orders found' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route GET api/v1/orders/:orderId
 * @desc  Get an order by orderId
 * @access  Private
 */
router.get('/:orderId', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    try {
      const orderModel = new Order(req.query);
      const order = await orderModel.getOrderById(req.params.orderId);
      if (order) {
        const totalPrice = await orderModel.calculateTotal(order[0].order_id);
        return res.status(200).json({
          status: 'success',
          message: 'order fetched successfully!',
          order,
          totalPrice,
        });
      }
      return res.status(404).json({ message: 'the order with given id was not found.' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route GET api/v1/orders/:userId/my_orders
 * @desc  Get logged in user orders
 * @access  Private
 */
router.get('/:userId/my_orders', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin') || (req.query.role === 'user')) {
    try {
      const orderModel = new Order(req.params);
      const userOrders = await orderModel.getOrdersByUserId(req.params.userId);
      if (userOrders) {
        return res.status(200).json({
          status: 'success',
          message: 'orders fetched successfully!',
          userOrders,
        });
      }
      return res.status(404).json({ message: 'You are yet to place an order!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route GET api/v1/orders/:userId/my_orders/:orderId
 * @desc Get a logged in user order by orderId
 * @access  Private
 */
router.get('/:userId/my_orders/:orderId', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin') || (req.query.role === 'user')) {
    try {
      const orderModel = new Order(req.params);
      const userOrder = await orderModel.getMyOrderByUserId(req.params.userId, req.params.orderId);
      if (userOrder) {
        const totalPrice = await orderModel.calculateTotal(userOrder[0].order_id);
        return res.status(200).json({
          status: 'success',
          message: 'orders fetched successfully!',
          userOrder,
          totalPrice,
        });
      }
      return res.status(404).json({ message: 'No order with the given id found for this user.' });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: 'Access Denied' });
  }
});

/**
 * @route Post api/v1/orders
 * @desc  Place an order
 * @access  Private
 */
router.post('/', async (req, res) => {
  const { errors, isValid } = validateOrder(req.body.items);

  try {
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const orderModel = new Order(req.body);

    const checkProduct = await Promise.all(req.body.items.map((product) => orderModel.peekMenu(product)));
    const productNumbers = [];
    const inputConProdNums = [];
    for (let i = 0; i < checkProduct.length; i += 1) {
      const singleProductCheck = checkProduct[i];
      if (!singleProductCheck) {
        return res.status(404).json({ message: 'product not found in the menu' });
      }
      productNumbers.push(singleProductCheck);
    }
    for (let i = 0; i < productNumbers.length; i += 1) {
      const value = Object.assign(productNumbers[i], req.body.items[i]);
      inputConProdNums.push(value);
    }
    const productArray = [];
    const getNewQuantity = await Promise.all(req.body.items.map((product) => orderModel.checkQuantityINProducts(product.name, product.quantity)));
    if (getNewQuantity[0]) {
      for (let count = 0; count < req.body.items.length; count += 1) {
        if (req.body.items[count].quantity > getNewQuantity[count].quantity) {
          return res.status(400).json({
            message: 'not enough quantity for selected product(s)',
            item: getNewQuantity[count].name,
          });
        }
        getNewQuantity[count].quantity -= req.body.items[count].quantity;
        productArray.push(getNewQuantity[count]);
      }
      if (!req.body.recievingAddress) req.body.recievingAddress = await orderModel.getUserAddress(req.query.id);
      const newOrders = await orderModel.placeOrder(req.body, req.query.id);
      if (newOrders) {
        const fillOrderedProducts = await Promise.all(inputConProdNums.map((inputObj) => orderModel.completeProductOrders(inputObj, newOrders.order_id, (inputObj.price * inputObj.quantity))));
        const updateNewQuantity = await Promise.all(productArray.map((newQuantity) => orderModel.updateNewQuantity(newQuantity.quantity, newQuantity.name)));
        if (updateNewQuantity[0]) {
          return res.status(201).json({
            status: 'Success',
            message: 'order Placed successfully!',
            newOrders,
            productDetails: fillOrderedProducts,
            quantitiesRemaining: updateNewQuantity,
          });
        }
        return res.status(400).json({ message: 'Error updating new Quantity' });
      }
      return res.status(400).json({ error: 'Problem creating orders.' });
    }
    return res.status(400).json({ message: 'unable to get product details' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @route PUT api/v1/orders/:orderId
 * @desc  Update the order status
 * @access  Private
 */
router.put('/:orderId', async (req, res) => {
  if ((req.query.role === 'admin') || (req.query.role === 'superAdmin')) {
    try {
      const adminStatus = ['New', 'Processing', 'Cancelled', 'Complete'];
      if (adminStatus.indexOf(req.body.status) !== -1) {
        const orderModel = new Order(req.body);
        const selectedOrder = await orderModel.getOrderById(req.params.orderId);
        if (selectedOrder) {
          const statusUpdate = await orderModel.updateOrderStatus(req.body.status, req.params.orderId);
          if (statusUpdate) {
            const updatedBy = await orderModel.updatedBy(req.query.id);
            return res.status(200).json({
              status: 'success',
              message: 'status updated successfully',
              statusUpdate,
              updatedBy,
            });
          }
          return res.status(400).json({
            error: 'Problem updating status',
          });
        }
        return res.status(404).json({ message: 'the order with given id was not found.' });
      }
      return res.status(200).json({
        status: 'Success but Failed on Update message',
        message: 'message should be any of ',
        adminStatus,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: 'Access denied.' });
  }
});

export default router;
