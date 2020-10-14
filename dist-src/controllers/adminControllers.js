"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Admin = _interopRequireDefault(require("../models/Admin"));

var _authorize = _interopRequireDefault(require("../helpers/middleware/authorize"));

var _Order = _interopRequireDefault(require("./../models/Order"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

(0, _authorize.default)(router);
/**
 * @route Post api/v1/admin/users
 * @desc  Get All Users
 * @access  Private
 */

router.get('/users', async (req, res) => {
  if (req.query.role === 'superAdmin' || req.query.role === 'admin') {
    const adminModel = new _Admin.default(req.query);

    try {
      const users = await adminModel.getUsers();

      if (users) {
        return res.status(200).json({
          status: 'success',
          users
        });
      }

      return res.status(404).json({
        message: 'No users yet!'
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
 * @route Post api/v1/admin/:userId
 * @desc  Get User By Id
 * @access  Private
 */

router.get('/:userId', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const adminModel = new _Admin.default(req.params);

    try {
      const user = await adminModel.getUserById(req.params.userId);

      if (user) {
        return res.status(200).json({
          status: 'success',
          user
        });
      }

      return res.status(500).json({
        message: 'invalid uuid'
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
 * @route Post api/v1/admin/create/:userId
 * @desc  Make a user an admin
 * @access  Private
 */

router.post('/create/:userId', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const adminModel = new _Admin.default(req.params);

    try {
      const admin = await adminModel.getUserById(req.params.userId);

      if (admin) {
        if (admin.role === 'user') {
          const newAdmin = await adminModel.createAdmin(admin.user_id);
          return res.status(201).json({
            status: 'Success',
            message: 'New Admin Created Successfully',
            newAdmin
          });
        }

        return res.status(400).json({
          status: 'failed',
          message: 'User already have admin privilege',
          name: admin.name
        });
      }

      return res.status(404).json({
        message: 'user not found'
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
 * @route Post api/v1/admin/remove/:userId
 * @desc  Make admin a user
 * @access  Private
 */

router.post('/remove/:userId', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const adminModel = new _Admin.default(req.params);

    try {
      const admin = await adminModel.getUserById(req.params.userId);

      if (admin) {
        if (admin.role === 'admin') {
          const oldAdmin = await adminModel.removeAdminRole(admin.user_id);
          return res.status(200).json({
            status: 'Success',
            message: 'Admin modified Successfully',
            oldAdmin
          });
        }

        return res.status(400).json({
          status: 'failed',
          message: 'User does not have admin privilege',
          name: admin.name
        });
      }

      return res.status(500).json({
        message: 'invalid uuid'
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
 * @route DELETE api/v1/admin/deleteUser/:userId
 * @desc  Delete a user
 * @access  Private
 */

router.delete('/deleteUser/:userId', async (req, res) => {
  if (req.query.role === 'superAdmin') {
    const adminModel = new _Admin.default(req.params);

    try {
      const admin = await adminModel.getUserById(req.params.userId);

      if (admin) {
        const deleteUser = await adminModel.removeUser(req.params.userId);

        if (deleteUser) {
          return res.status(200).json({
            status: 'success',
            message: 'user deleted successfully!'
          });
        }

        return res.status(500).json({
          status: 'failed',
          message: 'Problem deleting user'
        });
      }

      return res.status(404).json({
        message: 'user not found'
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
 * @route PUT api/v1/admin/orders/status/:orderId
 * @desc  change status
 * @access  Private
 */

router.put('/orders/status/:orderId', async (req, res) => {
  const errors = {};

  if (req.query.role === 'admin' || req.query.role === 'superAdmin') {
    const adminModel = new _Admin.default(req.body);

    try {
      const statusArray = ['processing...', 'approved', 'rejected', 'completed'];
      const orderModel = new _Order.default(req.body);
      const order = orderModel.getOrderById(req.params.orderId);

      if (order) {
        if (!statusArray.includes(req.body.status)) {
          errors.unKnownStatus = 'invalid value for order Status.';
          return res.status(400).json({
            status: 'failed',
            errors
          });
        }

        const updatedOrderStatus = await adminModel.UpdateOrder(req.params.orderId, req.body.status);

        if (updatedOrderStatus) {
          return res.status(200).json({
            status: 'success',
            msg: 'Order Status updated successfully',
            updatedOrderStatus
          });
        }

        errors.failedStatus = 'There is a problem updating status';
        return res.status(400).json({
          status: 'failed',
          errors
        });
      }

      return res.status(404).json({
        status: 'success',
        msg: 'The order with the given id was not found'
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