const express = require('express');
const router = express.Router();

const jobsController = require('../controller/jobsController');

/* authentication middlware */
const { requireRecruiter, requireApplicant } = require('../middleware');

router.post('/create', requireRecruiter, jobsController.create);
router.get('/checkLogin', requireRecruiter, jobsController.checkLogin);
router.delete('/:jobId/delete', requireRecruiter, jobsController.delete);
router.get('/getAllCreated', requireRecruiter, jobsController.getAllCreated);
router.patch(
  '/:jobId/updateJobStatus',
  requireRecruiter,
  jobsController.updateJobStatus
);
router.patch(
  '/:jobId/applicants/:applicantId/updateApplicantStatus',
  requireRecruiter,
  jobsController.updateApplicantStatus
);

router.get('/getAllJobs', requireApplicant, jobsController.getAllJobs);
router.post('/:jobId/apply', requireApplicant, jobsController.apply);
router.get('/getApplied', requireApplicant, jobsController.getApplied);

module.exports = router;
