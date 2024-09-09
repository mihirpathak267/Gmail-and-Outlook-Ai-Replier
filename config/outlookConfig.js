const OUTLOOK_AUTHORIZE_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`;
const OUTLOOK_TOKEN_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
const REDIRECT_URI = 'http://localhost:3000/auth/outlook/mailreplier';

module.exports = { OUTLOOK_AUTHORIZE_URL, OUTLOOK_TOKEN_URL, REDIRECT_URI };