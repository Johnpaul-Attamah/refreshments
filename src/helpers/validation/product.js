/* eslint-disable no-param-reassign */
import validator from 'validator';

import isEmpty from './is-empty';

export default function validateProducts(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.productImg = !isEmpty(data.productImg) ? data.productImg : '';
  data.quantity = !isEmpty(data.quantity) ? data.quantity : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Product name must be between 2 and 30 characters';
  }
  if (!validator.isLength(data.productImg, { min: 6, max: 300 })) {
    errors.productImg = 'Not a valid product url';
  }
  if (!validator.isLength(data.description, { min: 20, max: 1500 })) {
    errors.description = 'Descriptions must be more than 20 characters';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Product name field is required';
  }

  if (validator.isEmpty(data.productImg)) {
    errors.productImg = 'Product image is required';
  }

  if (data.quantity.length === 0) {
    errors.quantity = 'Product quantity is required';
  }

  if (data.price.length === 0) {
    errors.price = 'Product Price field is required';
  }

  if (validator.isEmpty(data.description)) {
    errors.description = 'Product Description is required';
  }

  if (isNaN(data.quantity)) {
    errors.quantity = 'Quantity must be a number';
  }
  if (isNaN(data.price)) {
    errors.price = 'Price must be a number';
  }

  if ((!Number.isNaN(data.quantity)) && (data.quantity.toString().indexOf('.') !== -1)) {
    errors.quantity = 'Quantity must be an integer';
  }
  if ((!Number.isNaN(data.price)) && (data.price.toString().indexOf('.') === -1) && (data.price.length !== 0)) {
    errors.price = 'Price must be a floating point number';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
