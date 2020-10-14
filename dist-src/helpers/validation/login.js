"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateLoginInput;

var _validator = _interopRequireDefault(require("validator"));

var _isEmpty = _interopRequireDefault(require("./is-empty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateLoginInput(data) {
  const errors = {}; // eslint-disable-next-line no-param-reassign

  data.email = !(0, _isEmpty.default)(data.email) ? data.email : ''; // eslint-disable-next-line no-param-reassign

  data.password = !(0, _isEmpty.default)(data.password) ? data.password : '';

  if (!_validator.default.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (_validator.default.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (_validator.default.isEmpty(data.password)) {
    errors.password = 'password field is required';
  }

  return {
    errors,
    isValid: (0, _isEmpty.default)(errors)
  };
}