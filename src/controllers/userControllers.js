import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import validateRegisterInput from '../helpers/validation/register';
import validateLoginInput from '../helpers/validation/login';
import authorizeUser from '../helpers/middleware/authorize';

dotenv.config();


const router = express.Router();

/**
 * @route Post api/v1/auth/register
 * @desc  Create account
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  try {
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const userModel = new User(req.body);
    const emailExists = await userModel.checkUserExistBefore(req.body);
    if (!emailExists) {
      const newUser = await userModel.createUser();
      return res.status(200).json({
        status: 'Success',
        newUser,
        message: 'Account Created Successfully',
      });
    }
    errors.email = 'Email already exists';
    return res.status(422).json({
      status: 'failed',
      errors,
      email: emailExists.email,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const userModel = new User(req.body);
  try {
    const user = await userModel.loginUser();
    switch (user.code) {
      case 1:
        errors.email = 'User not found';
        return res.status(404).json({
          status: 'failed',
          errors,
        });
      case 2:
      { const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        role1: user.role1,
        role2: user.role2,
      };
      const token = jwt.sign(payload, process.env.SECRET_OR_KEY, {
        expiresIn: 3600,
      });
      return res.status(200).json({
        status: 'success',
        message: 'You are logged in!',
        token: `Bearer ${token}`,
      }); }
      default:
        errors.password = 'Password incorrect';
        return res.status(401).json({
          status: 'failed',
          errors,
        });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
});

/**
 * Authorized users
 * Private routes
 */
authorizeUser(router);

router.get('/current', (req, res) => {
  res.json({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    phone: req.body.phone,
    address: req.body.address,
    role1: req.body.role1,
    role2: req.body.role2,
  });
});


export default router;
