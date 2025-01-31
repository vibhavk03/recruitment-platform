const express = require('express');
const router = express.Router();

/* require recruiter is authentication middlware */
const { requireRecruiter } = require('../middleware');

const recruitersController = require('../controller/recruitersController');

router.post('/register', recruitersController.register);
router.post('/login', recruitersController.login);
router.get('/checkLogin', requireRecruiter, recruitersController.checkLogin);
router.get('/logout', requireRecruiter, recruitersController.logout);
router.delete('/delete', requireRecruiter, recruitersController.delete);

module.exports = router;
