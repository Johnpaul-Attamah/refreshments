"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _moment = _interopRequireDefault(require("moment"));

var _dbConnection = _interopRequireDefault(require("../helpers/dbConnection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getProfileData = state => ({
  async userProfile(userId) {
    try {
      const result = await _dbConnection.default.query('SELECT * FROM users WHERE user_id = $1 ', [userId]);

      if (result.rows[0]) {
        return result.rows[0];
      }

      return false;
    } catch (err) {
      return err;
    }
  }

});

const getProfileByUserId = state => ({
  async userProfile(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE user_id = $1',
      values: [userId]
    };

    try {
      const result = await _dbConnection.default.query(query);
      const user = result.rows[0];

      if (user) {
        return result.rows[0];
      }

      return false;
    } catch (error) {
      return error;
    }
  }

});

const comparePassword = state => ({
  async comPassword(password, oldPassword) {
    try {
      const passwordMatch = await _bcryptjs.default.compare(password, oldPassword);

      if (passwordMatch) {
        return true;
      }

      return false;
    } catch (err) {
      return err;
    }
  }

});

const changePassword = state => ({
  async newPassword(password, userId) {
    try {
      const hash = await _bcryptjs.default.hash(password, 10);
      const query = {
        text: `UPDATE users 
          SET hashed_password = $1, modified_date = $2
          WHERE user_id = $3 RETURNING *`,
        values: [hash, (0, _moment.default)(new Date()), userId]
      };
      const updatedUser = await _dbConnection.default.query(query);
      return updatedUser.rows[0];
    } catch (err) {
      return err;
    }
  }

});

const editProfileData = state => ({
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
        values: [profileFields.name, profileFields.email, profileFields.phone, profileFields.address, (0, _moment.default)(new Date()), profileFields.user]
      };
      const profileResult = await _dbConnection.default.query('SELECT * FROM users WHERE user_id = $1 ', [profileFields.user]);

      if (profileResult.rows[0]) {
        const profileVals = await _dbConnection.default.query(query);

        if (profileVals.rows[0]) {
          return profileVals.rows[0];
        }

        return false;
      }

      return false;
    } catch (err) {
      return err;
    }
  }

});

function Profile(name, email, password, phone, address) {
  const profile = {
    name,
    email,
    password,
    phone,
    address
  };
  return Object.assign(profile, getProfileData(profile), editProfileData(profile), getProfileByUserId(profile), comparePassword(profile), changePassword(profile));
}

var _default = Profile;
exports.default = _default;