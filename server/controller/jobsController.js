require('dotenv').config();
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const { default: mongoose } = require('mongoose');

const handleErrors = function (err) {
  let errors = {};
  if (err.message.includes('validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      /* attaching proper error messages to errors object defined above */
      const { message, path } = properties;
      errors[path] = message;
    });
  }
  return errors;
};

module.exports = {
  create: async function (req, res) {
    try {
      const job = await Job.create({
        ...req.body,
        recruiter: res.locals.recruiter._id,
      });
      res.status(201).send({
        message: 'job created',
        job,
      });
    } catch (err) {
      console.log(`error in creating a job: ${err}`);
      const errors = handleErrors(err);
      res.status(400).send({
        message: 'error in creating a job',
        error: errors,
      });
    }
  },
  checkLogin: function (req, res) {
    /* route to check if logged in successfully */
    res.json({
      message: `you are logged in as a recruiter: ${res.locals.recruiter.email}`,
    });
  },
  delete: async function (req, res) {
    /* delete the job by ID */
    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({
      message: 'job is now deleted',
      deletedJob: job,
    });
  },
  getAllCreated: async function (req, res) {
    try {
      const recruiterId = res.locals.recruiter._id;
      const jobs = await Job.find({ recruiter: recruiterId })
        .populate(
          'applicants.applicant',
          'email name mobileNumber profileSummary skills resumeUrl currentRole currentCompensation currentLocation preferredRole preferredCompensation preferredLocation'
        )
        .sort({
          createdAt: -1,
        });
      res.status(200).json({
        message: 'Jobs created by recruiter fetched successfully',
        jobs,
      });
    } catch (err) {
      console.error(`Error fetching jobs by recruiter: ${err}`);
      res.status(500).json({
        message: 'Error fetching jobs by recruiter',
        error: err.message,
      });
    }
  },
  getAllJobs: async function (req, res) {
    try {
      const jobs = await Job.find()
        .populate('recruiter', 'name organisation')
        .populate(
          'applicants.applicant',
          'email name mobileNumber profileSummary skills resumeUrl currentRole currentCompensation currentLocation preferredRole preferredCompensation preferredLocation'
        );
      res.status(200).json({
        message: 'All jobs fetched successfully',
        jobs,
      });
    } catch (err) {
      console.error(`Error fetching jobs: ${err}`);
      res
        .status(500)
        .json({ message: 'Error fetching jobs', error: err.message });
    }
  },
  apply: async function (req, res) {
    try {
      const { jobId } = req.params;
      const applicantId = res.locals.applicant._id;

      /* find the job */
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      /* check if the applicant has already applied */
      const alreadyApplied = job.applicants.some((app) =>
        app.applicant.equals(applicantId)
      );
      if (alreadyApplied) {
        return res
          .status(400)
          .json({ message: 'You have already applied for this job' });
      }

      /* Add applicant to the job's applicants list */
      job.applicants.push({
        applicant: applicantId,
        status: 'Applied',
        appliedAt: new Date(),
      });
      await job.save();

      res.status(200).json({
        message: 'Application submitted successfully',
        job,
      });
    } catch (error) {
      console.log(`Error in applying for job: ${err}`);
      res
        .status(500)
        .json({ message: 'Error applying for job', error: err.message });
    }
  },
  getApplied: async function (req, res) {
    try {
      const applicantId = res.locals.applicant._id;

      /* fetch jobs where the applicant has applied */
      const jobs = await Job.find({
        'applicants.applicant': applicantId,
      })
        .populate('recruiter', 'name email organisation')
        .populate(
          'applicants.applicant',
          'email name mobileNumber profileSummary skills resumeUrl currentRole currentCompensation currentLocation preferredRole preferredCompensation preferredLocation'
        );

      res.status(200).json({
        message: 'Applied jobs fetched successfully',
        jobs,
      });
    } catch (err) {
      console.error(`Error fetching applied jobs: ${err}`);
      res
        .status(500)
        .json({ message: 'Error fetching applied jobs', error: err.message });
    }
  },
  updateJobStatus: async function (req, res) {
    try {
      const { jobId } = req.params;
      const { status } = req.body;
      const recruiterId = res.locals.recruiter._id;

      const validStatuses = ['Open', 'Closed', 'On Hold'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid job status' });
      }

      /* update job only if recruiter owns it */
      const job = await Job.findOneAndUpdate(
        { _id: jobId, recruiter: recruiterId },
        { status },
        { new: true }
      );
      if (!job) {
        return res
          .status(404)
          .json({ message: 'Job not found or unauthorized' });
      }

      res.status(200).json({
        message: 'Job status updated successfully',
        job,
      });
    } catch (err) {
      console.error(`Error updating job status: ${err}`);
      res
        .status(500)
        .json({ message: 'Error updating job status', error: err.message });
    }
  },
  updateApplicantStatus: async function (req, res) {
    try {
      const { jobId, applicantId } = req.params;
      const { status } = req.body;
      const recruiterId = res.locals.recruiter._id;

      /* allowed applicant statuses */
      const validStatuses = [
        'Applied',
        'Shortlisted',
        'Not Shortlisted',
        'Contacted by Email',
        'Contacted over Phone',
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid applicant status' });
      }

      /* find job and ensure recruiter owns it */
      const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
      if (!job) {
        return res
          .status(404)
          .json({ message: 'Job not found or unauthorized' });
      }

      /* find the applicant in the job's applicants array */
      const applicantIndex = job.applicants.findIndex(
        (app) => app.applicant.toString() === applicantId
      );
      if (applicantIndex === -1) {
        return res.status(404).json({ message: 'Applicant not found in job' });
      }

      /* update applicant status */
      job.applicants[applicantIndex].status = status;
      await job.save();

      res.status(200).json({
        message: 'applicant status updated successfully',
        updatedApplicant: job.applicants[applicantIndex],
      });
    } catch (err) {
      console.error(`Error updating applicant status: ${err}`);
      res.status(500).json({
        message: 'error in updating applicant status',
        error: err.message,
      });
    }
  },
};
