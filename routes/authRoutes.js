const express = require('express');
const router = express.Router();
const passport = require('passport');
const { OUTLOOK_AUTHORIZE_URL, OUTLOOK_TOKEN_URL, REDIRECT_URI } = require('../config/outlookConfig');
const oauth2Client = require('../config/gmailConfig');
const { scheduleEmailProcessing } = require('../jobs/emailProcessor');

const SCOPES = [
    'openid',
    'https://outlook.office.com/mail.read',
    'https://outlook.office.com/mail.send',
  ];
  
// Gmail authentication
router.get('/gmail', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send','https://www.googleapis.com/auth/gmail.modify', 'profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
}));

router.get('/google/auto-replier', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    
    scheduleEmailProcessing('gmail');
    res.redirect('/process-emails/process-gmails');
});

// Outlook authentication
router.get('/outlook', (req, res) => {
    const authUrl = `${OUTLOOK_AUTHORIZE_URL}?client_id=${process.env.OUTLOOK_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&response_mode=query&scope=${SCOPES.join(' ')}&state=12345`;
    res.redirect(authUrl);
});

router.get('/outlook/mailreplier', async (req, res) => {
    const { code } = req.query;
    const tokenResponse = await fetch(OUTLOOK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.OUTLOOK_CLIENT_ID,
            client_secret: process.env.OUTLOOK_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        })
    });
    const tokenData = await tokenResponse.json();
    req.session.accessToken = tokenData.access_token;
    scheduleEmailProcessing('outlook');
    res.redirect('/process-emails/process-outlook');
});

module.exports = router;
