const express = require('express');
const router = express.Router();

const recruitersRouter = require('./recruitersRouter');
const applicantsRouter = require('./applicantsRouter');
// const jobsRouter = require('./jobsRouter');

/* require doctor is authentication middlware */
// const { requireRecruiter } = require('../middleware');

router.use('/recruiters', recruitersRouter);
router.use('/applicants', applicantsRouter);
// router.use('/jobs', jobsRouter);

module.exports = router;
