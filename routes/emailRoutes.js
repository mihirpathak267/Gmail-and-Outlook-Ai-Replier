const express = require('express');
const router = express.Router();
const { processGmailEmails } = require('../controllers/gmailController');
const { processOutlookEmails } = require('../controllers/outlookController');

// Process Gmail emails
router.get('/process-gmails', processGmailEmails);

// Process Outlook emails
router.get('/process-outlook', processOutlookEmails);

module.exports = router;
