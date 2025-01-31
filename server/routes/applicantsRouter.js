const express = require('express');
const router = express.Router();

/* require recruiter is authentication middlware */
const { requireApplicant } = require('../middleware');

const applicantsController = require('../controller/applicantsController');

router.post('/register', applicantsController.register);
router.post('/login', applicantsController.login);
router.get('/checkLogin', requireApplicant, applicantsController.checkLogin);
router.get('/logout', requireApplicant, applicantsController.logout);
router.delete('/delete', requireApplicant, applicantsController.delete);

module.exports = router;
