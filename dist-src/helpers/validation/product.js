"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateProducts;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("./is-empty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function validateProducts(data) {
  const errors = {};
  data.name = !(0, _isEmpty.default)(data.name) ? data.name : '';
  data.productImg = !(0, _isEmpty.default)(data.productImg) ? data.productImg : '';
  data.quantity = !(0, _isEmpty.default)(data.quantity) ? data.quantity : '';
  data.price = !(0, _isEmpty.default)(data.price) ? data.price : '';
  data.description = !(0, _isEmpty.default)(data.description) ? data.description : '';

  if (!_validator.default.isLength(data.name, {
    min: 2,
    max: 30
  })) {
    errors.name = 'Product name must be between 2 and 30 characters';
  }

  if (!_validator.default.isLength(data.productImg, {
    min: 6,
    max: 300
  })) {
    errors.productImg = 'Not a valid product url';
  }

  if (!_validator.default.isLength(data.description, {
    min: 20,
    max: 1500
  })) {
    errors.description = 'Descriptions must be more than 20 characters';
  }

  if (_validator.default.isEmpty(data.name)) {
    errors.name = 'Product name field is required';
  }

  if (_validator.default.isEmpty(data.productImg)) {
    errors.productImg = 'Product image is required';
  }

  if (data.quantity.length === 0) {
    errors.quantity = 'Product quantity is required';
  }

  if (data.price.length === 0) {
    errors.price = 'Product Price field is required';
  }

  if (_validator.default.isEmpty(data.description)) {
    errors.description = 'Product Description is required';
  }

  if (isNaN(data.quantity)) {
    errors.quantity = 'Quantity must be a number';
  }

  if (isNaN(data.price)) {
    errors.price = 'Price must be a number';
  }

  if (!Number.isNaN(data.quantity) && data.quantity.toString().indexOf('.') !== -1) {
    errors.quantity = 'Quantity must be an integer';
  }

  if (!Number.isNaN(data.price) && data.price.toString().indexOf('.') === -1 && data.price.length !== 0) {
    errors.price = 'Price must be a floating point number';
  }

  return {
    errors,
    isValid: (0, _isEmpty.default)(errors)
  };
}