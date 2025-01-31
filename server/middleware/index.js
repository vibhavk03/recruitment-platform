require('dotenv').config();
const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');

// TODO: we can refactor this for better modularity

const requireRecruiter = (req, res, next) => {
  const token = req.cookies.jwt;
  /* check if jwt exists and is verified */
  if (token) {
    jwt.verify(token, process.env.MY_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        /* if jwt not valid throw error */
        res.status(400).json({
          message: `error in accessing this route, please login`,
          error: `${err.message}`,
        });
      } else {
        /* if jwt verified then fetch the doctor from db and store it in res.locals */
        const recruiter = await Recruiter.findById(decodedToken.id);
        if (!recruiter) {
          /* if recruiter not found */
          res.status(401).json({
            message: `error in accessing this route, please login`,
            error: `${err.message}`,
          });
        }
        res.locals.recruiter = recruiter;
        next();
      }
    });
  } else {
    /* no token in the request */
    res.status(400).json({
      message: 'error in accessing this route, please login',
    });
  }
};

const requireApplicant = (req, res, next) => {
  const token = req.cookies.jwt;
  /* check if jwt exists and is verified */
  if (token) {
    jwt.verify(token, process.env.MY_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        /* if jwt not valid throw error */
        res.status(400).json({
          message: `error in accessing this route, please login`,
          error: `${err.message}`,
        });
      } else {
        /* if jwt verified then fetch the doctor from db and store it in res.locals */
        const applicant = await Applicant.findById(decodedToken.id);
        if (!applicant) {
          /* if applicant not found */
          res.status(401).json({
            message: `error in accessing this route, please login`,
            error: `${err.message}`,
          });
        }
        res.locals.applicant = applicant;
        next();
      }
    });
  } else {
    /* no token in the request */
    res.status(400).json({
      message: 'error in accessing this route, please login',
    });
  }
};

module.exports = { requireRecruiter, requireApplicant };
