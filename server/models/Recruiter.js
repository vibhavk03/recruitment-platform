const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const recruiterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    organisation: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* hasing password before saving to the db - using mongose hooks */
recruiterSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); /* hash only if password is modified */
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* static method to login user */
recruiterSchema.statics.login = async function (email, password) {
  const recruiter = await this.findOne({ email });
  if (recruiter) {
    const auth = await bcrypt.compare(password, recruiter.password);
    if (auth) {
      return recruiter;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const Recruiter = new mongoose.model('recruiter', recruiterSchema);

module.exports = Recruiter;
