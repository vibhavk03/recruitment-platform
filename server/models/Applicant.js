const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const applicantSchema = new mongoose.Schema(
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
    profileSummary: {
      type: String,
      trim: true,
      required: false,
    },
    skills: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      ],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one skill is required',
      },
    },
    resumeUrl: {
      type: String,
      required: false,
      trim: true,
    },
    currentRole: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    currentCompensation: {
      type: String,
      required: true,
    },
    currentLocation: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    preferredRole: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    preferredCompensation: {
      type: String,
      required: true,
    },
    preferredLocation: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      ],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one location is required',
      },
    },
  },
  {
    timestamps: true,
  }
);

/* hasing password before saving to the db - using mongose hooks */
applicantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); /* hash only if password is modified */
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* static method to login user */
applicantSchema.statics.login = async function (email, password) {
  const applicant = await this.findOne({ email });
  if (applicant) {
    const auth = await bcrypt.compare(password, applicant.password);
    if (auth) {
      return applicant;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const Applicant = new mongoose.model('applicant', applicantSchema);

module.exports = Applicant;
