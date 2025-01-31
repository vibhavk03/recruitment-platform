require('dotenv').config();
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken');

const handleErrors = function (err) {
  let errors = {};

  /* login error handling */
  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered';
  }
  if (err.message === 'incorrect password') {
    errors.email = 'that password is not incorrect';
  }

  /* register error handling */
  /* handle duplicate register */
  if (err.code === 11000 && err.errmsg.includes('email')) {
    errors.email = 'This email is already registered';
    return errors;
  }
  if (err.code === 11000 && err.errmsg.includes('mobileNumber')) {
    errors.mobileNumber = 'This mobileNumber is already registered';
    return errors;
  }
  if (err.message.includes('validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      /* attaching proper error messages to errors object defined above */
      const { message, path } = properties;
      errors[path] = message;
    });
  }

  return errors;
};

/* max age is 1 hour */
const MAX_AGE = 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.MY_SECRET_KEY, {
    expiresIn: MAX_AGE,
  });
};

module.exports = {
  register: async function (req, res) {
    try {
      const applicant = await Applicant.create(req.body);
      /* create a jwt token and send it back in cookies */
      const token = createToken(applicant._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.status(201).send({
        message: 'applicant registered',
        applicant,
      });
    } catch (err) {
      console.log(`error in registering a applicant : ${err}`);
      const errors = handleErrors(err);
      res.status(400).send({
        message: 'error in registering a applicant',
        error: errors,
      });
    }
  },
  login: async function (req, res) {
    const { email, password } = req.body;
    try {
      /* calling static method to login user */
      const applicant = await Applicant.login(email, password);
      /* create a jwt token and send it back in cookies */
      const token = createToken(applicant._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
      res.status(200).json({
        message: 'applicant logged in',
        applicant,
      });
    } catch (err) {
      res.status(400).json({
        message: 'error in login',
        error: err.message,
      });
    }
  },
  checkLogin: function (req, res) {
    /* route to check if logged in successfully */
    res.json({
      message: `you are logged in as ${res.locals.applicant.email}`,
    });
  },
  logout: async function (req, res) {
    /* setting jwt token as empty string with 1 millisecond expiry */
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({
      message: 'logged out successfully!',
    });
  },
  delete: async function (req, res) {
    /* delete the jwt token */
    res.cookie('jwt', '', { maxAge: 1 });
    /* delete the recruiter by ID */
    const applicant = await Applicant.findOneAndDelete({
      _id: res.locals.applicant.id,
    });
    res.json({
      message: 'applicant profile is now deleted',
      deletedApplicant: applicant,
    });
  },
};
