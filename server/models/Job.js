const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
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
    type: {
      type: String,
      required: true,
      enum: {
        values: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
        message: `{VALUE} is not supported, please try one of these values ['Full-Time', 'Part-Time', 'Contract', 'Internship']`,
      },
    },
    skillsRequired: {
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
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Closed', 'On Hold'],
      default: 'Open',
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'recruiter',
      required: true,
    },
    applicants: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'applicant',
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: [
            'Applied',
            'Shortlisted',
            'Not Shortlisted',
            'Contacted by Email',
            'Contacted over Phone',
          ],
          default: 'Applied',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = new mongoose.model('job', jobSchema);

module.exports = Job;
