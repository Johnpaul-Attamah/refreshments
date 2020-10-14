"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _User = _interopRequireDefault(require("../models/User"));

var _register = _interopRequireDefault(require("../helpers/validation/register"));

var _login = _interopRequireDefault(require("../helpers/validation/login"));

var _authorize = _interopRequireDefault(require("../helpers/middleware/authorize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const router = _express.default.Router();
/**
 * @route Post api/v1/auth/register
 * @desc  Create account
 * @access  Public
 */


router.post('/register', async (req, res) => {
  const {
    errors,
    isValid
  } = (0, _register.default)(req.body);

  try {
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const userModel = new _User.default(req.body);
    const emailExists = await userModel.checkUserExistBefore(req.body);

    if (!emailExists) {
      const newUser = await userModel.createUser();
      return res.status(200).json({
        status: 'Success',
        newUser,
        message: 'Account Created Successfully'
      });
    }

    errors.email = 'Email already exists';
    return res.status(422).json({
      status: 'failed',
      errors,
      email: emailExists.email
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
});
/**
 * @route Post api/v1/auth/login
 * @desc  user login
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const {
    errors,
    isValid
  } = (0, _login.default)(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userModel = new _User.default(req.body);

  try {
    const user = await userModel.loginUser();

    switch (user.code) {
      case 1:
        errors.email = 'User not found';
        return res.status(404).json({
          status: 'failed',
          errors
        });

      case 2:
        {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            role: user.role
          };

          const token = _jsonwebtoken.default.sign(payload, process.env.SECRET_OR_KEY, {
            expiresIn: 3600
          });

          return res.status(200).json({
            status: 'success',
            message: 'You are logged in!',
            token: `Bearer ${token}`
          });
        }

      default:
        errors.password = 'Password incorrect';
        return res.status(401).json({
          status: 'failed',
          errors
        });
    }
  } catch (err) {
    return res.status(500).json({
      err
    });
  }
});
/**
 * Authorized users
 * Private routes
 */

(0, _authorize.default)(router);
/**
 * @route GET api/v1/auth/current
 * @desc  get current user
 * @access  Private
 */

router.get('/current', (req, res) => {
  res.json({
    id: req.query.id,
    name: req.query.name,
    email: req.query.email,
    avatar: req.query.avatar,
    phone: req.query.phone,
    address: req.query.address,
    role: req.query.role
  });
});
var _default = router;
exports.default = _default;