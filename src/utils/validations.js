const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("name not valid");
  } else if (!firstName.length < 4 && !lastName.length > 50) {
    throw new Error("name should be wnough length");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("need strong pasword");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("need strong pasword");
  }
};
const validateLoginData = (req) => {
  const { emailId, password } = req.body;
};

module.exports = { validateSignUpData, validateLoginData };
