import express from 'express';
import Profile from '../models/Profile';
import authorizeUser from '../helpers/middleware/authorize';


const router = express.Router();


authorizeUser(router);

/**
 * @route GET api/v1/profile/getProfile
 * @desc  Get Profile
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const profileModel = Profile(req.query);
    const profile = await profileModel.userProfile(req.query.id);
    return res.status(200).json({
      status: 'Success',
      profile,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 * @route POST api/v1/profile/change_password
 * @desc  Change user password
 * @access  Private
 */
router.post('/change_password', async (req, res) => {
  const profileModel = Profile(req.body);
  try {
    const presentUser = await profileModel.userProfile(req.query.id);
    if (presentUser) {
      const passwordMatch = await profileModel
        .comPassword(req.body.oldPassword, presentUser.hashed_password);
      if (passwordMatch) {
        const newPassword = profileModel.newPassword(req.body.newPassword, req.query.id);
        return res.status(200).json({
          status: 'success',
          message: 'Password reset successfull',
        });
      }
      return res.status(401).json({
        status: 'failed',
        errors: 'Passwords do not match',
      });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

/**
 * @route POST api/v1/profile/edit_profile
 * @desc  edit user profile
 * @access  Private
 */
router.post('/edit_profile', async (req, res) => {
  const profileModel = Profile(req.body);
  try {
    const newProfile = await profileModel.newProfile(req.body, req.query.id);
    if (newProfile) {
      return res.status(200).json({
        status: 'Success',
        message: 'Profile Update Successful',
        newProfile,
      });
    }
    return res.status(400).json({ message: 'Failed to update profile data.' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

export default router;
