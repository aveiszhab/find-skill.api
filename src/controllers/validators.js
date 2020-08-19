const postcodeRegex = /[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}/i;
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


const validatePostcode = (v) => {
  return postcodeRegex.test(v);
};

const validateEmail = (email) => {
  return emailRegex.test(email);
};


module.exports = { validatePostcode, validateEmail };
