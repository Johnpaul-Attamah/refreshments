"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateRegisterInput;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("./is-empty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-extra-semi */

/* eslint-disable no-param-reassign */
function validateRegisterInput(data) {
  const errors = {};
  data.name = !(0, _isEmpty.default)(data.name) ? data.name : '';
  data.email = !(0, _isEmpty.default)(data.email) ? data.email : '';
  data.password = !(0, _isEmpty.default)(data.password) ? data.password : '';
  data.password2 = !(0, _isEmpty.default)(data.password2) ? data.password2 : '';
  data.phone = !(0, _isEmpty.default)(data.phone) ? data.phone : '';
  data.homeAddress = !(0, _isEmpty.default)(data.homeAddress) ? data.homeAddress : '';

  if (!_validator.default.isLength(data.name, {
    min: 2,
    max: 30
  })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (!_validator.default.isLength(data.password, {
    min: 6,
    max: 30
  })) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (!_validator.default.isLength(data.phone, {
    min: 10,
    max: 11
  })) {
    errors.phone = 'Mobile number too short';
  }

  if (!_validator.default.isLength(data.homeAddress, {
    min: 10,
    max: 1500
  })) {
    errors.address = 'Address must be more than 10 characters';
  }

  if (_validator.default.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (_validator.default.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (_validator.default.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (_validator.default.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (_validator.default.isEmpty(data.phone)) {
    errors.phone = 'Mobile Number is required';
  }

  if (_validator.default.isEmpty(data.homeAddress)) {
    errors.address = 'Address field is required';
  }

  if (!_validator.default.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!_validator.default.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (!!_validator.default.matches(data.phone, [/^[0][1-9]\d{9}$|^[1-9]\d{9}$/g])) {
    errors.phone = 'Invalid phone number';
  }

  return {
    errors,
    isValid: (0, _isEmpty.default)(errors)
  };
}