"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _userControllers = _interopRequireDefault(require("../controllers/userControllers"));

var _profileControllers = _interopRequireDefault(require("../controllers/profileControllers"));

var _adminControllers = _interopRequireDefault(require("../controllers/adminControllers"));

var _productControllers = _interopRequireDefault(require("../controllers/productControllers"));

var _orderControllers = _interopRequireDefault(require("../controllers/orderControllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = app => {
  app.use('/api/v1/auth', _userControllers.default);
  app.use('/api/v1/profile', _profileControllers.default);
  app.use('/api/v1/admin', _adminControllers.default);
  app.use('/api/v1/menu', _productControllers.default);
  app.use('/api/v1/orders', _orderControllers.default);
};

var _default = router;
exports.default = _default;