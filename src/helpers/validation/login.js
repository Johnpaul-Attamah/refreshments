import validator from 'validator';
import isEmpty from './is-empty';

export default function validateLoginInput(data) {
  const errors = {};

  // eslint-disable-next-line no-param-reassign
  data.email = !isEmpty(data.email) ? data.email : '';
  // eslint-disable-next-line no-param-reassign
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }


  if (validator.isEmpty(data.password)) {
    errors.password = 'password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
