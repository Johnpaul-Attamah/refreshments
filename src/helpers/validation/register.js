/* eslint-disable no-extra-semi */
/* eslint-disable no-param-reassign */
import validator from 'validator';

import isEmpty from './is-empty';

export default function validateRegisterInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.homeAddress = !isEmpty(data.homeAddress) ? data.homeAddress : '';

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters long';
  }
  if (!validator.isLength(data.phone, { min: 10, max: 11 })) {
    errors.phone = 'Mobile number too short';
  }
  if (!validator.isLength(data.homeAddress, { min: 10, max: 1500 })) {
    errors.address = 'Address must be more than 10 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (validator.isEmpty(data.phone)) {
    errors.phone = 'Mobile Number is required';
  }

  if (validator.isEmpty(data.homeAddress)) {
    errors.address = 'Address field is required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }
  if (!!validator.matches(data.phone, [/^[0][1-9]\d{9}$|^[1-9]\d{9}$/g])) {
    errors.phone = 'Invalid phone number';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
