import isEmpty from './is-empty';

export default function validateOrder(data) {
  const errors = {};
  for (let i = 0; i < data.length; i += 1) {
    data[i].name = !isEmpty(data[i].name) ? data[i].name : '';
    data[i].quantity = !isEmpty(data[i].quantity) ? data[i].quantity : '';

    if (data[i].name.length < 2) {
      errors.name = 'Product name must be greater than 2 characters';
    }

    if (data[i].name.length === 0) {
      errors.name = 'Product name field is required';
    }

    if (data[i].quantity.length === 0) {
      errors.quantity = 'Product quantity is required';
    }

    if (isNaN(data[i].quantity)) {
      errors.quantity = 'Quantity must be a number';
    }
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
