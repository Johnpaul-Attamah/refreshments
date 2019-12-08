import bcrypt from 'bcryptjs';
import moment from 'moment';
import pool from '../helpers/dbConnection';

const getProfileData = (state) => ({
  async userProfile(userId) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE user_id = $1 ', [userId]);
      if (result.rows[0]) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  },
});

const getProfileByUserId = (state) => ({
  async userProfile(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE user_id = $1',
      values: [userId],
    };
    try {
      const result = await pool.query(query);
      const user = result.rows[0];
      if (user) {
        return result.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  },
});
const comparePassword = (state) => ({
  async comPassword(password, oldPassword) {
    try {
      const passwordMatch = await bcrypt.compare(password, oldPassword);
      if (passwordMatch) {
        return true;
      }
      return false;
    } catch (err) {
      return err;
    }
  },
});

const changePassword = (state) => ({
  async newPassword(password, userId) {
    try {
      const hash = await bcrypt.hash(password, 10);
      const query = {
        text: `UPDATE users 
          SET hashed_password = $1, modified_date = $2
          WHERE user_id = $3 RETURNING *`,
        values: [hash, moment(new Date()), userId],
      };
      const updatedUser = await pool.query(query);
      return updatedUser.rows[0];
    } catch (err) {
      return err;
    }
  },
});

const editProfileData = (state) => ({
  async newProfile(profile, userId) {
    try {
      // Get fields
      const profileFields = {};
      profileFields.user = userId;
      if (profile.name) profileFields.name = profile.name;
      if (profile.email) profileFields.email = profile.email;
      if (profile.phone) profileFields.phone = profile.phone;
      if (profile.address) profileFields.address = profile.address;

      const query = {
        text: `UPDATE users 
            SET name = $1, email = $2, phone_number = $3, address = $4, modified_date = $5
            WHERE user_id = $6 RETURNING *`,
        values: [profileFields.name, profileFields.email,
          profileFields.phone, profileFields.address,
          moment(new Date()), profileFields.user],
      };
      const profileResult = await pool.query('SELECT * FROM users WHERE user_id = $1 ', [profileFields.user]);
      if (profileResult.rows[0]) {
        const profileVals = await pool.query(query);
        if (profileVals.rows[0]) {
          return profileVals.rows[0];
        }
        return false;
      }
      return false;
    } catch (err) {
      return err;
    }
  },
});

function Profile(name, email, password, phone, address) {
  const profile = {
    name,
    email,
    password,
    phone,
    address,
  };
  return Object.assign(
    profile,
    getProfileData(profile),
    editProfileData(profile),
    getProfileByUserId(profile),
    comparePassword(profile),
    changePassword(profile),
  );
}


export default Profile;
