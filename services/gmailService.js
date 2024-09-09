const { google } = require('googleapis');
const oauth2Client = require('../config/gmailConfig');

async function fetchGmailEmails() {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const res = await gmail.users.messages.list({
          userId: 'me',
          maxResults: 10,
          labelIds: ['INBOX'],
          q: 'is:unread',
        });
        const messages = res.data.messages || [];
        // Fetch full details of each message
    const fullMessages = await Promise.all(
        messages.map(async (message) => {
            const fullMessage = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full', // Ensure the full message details are retrieved
            });
            return fullMessage.data;
        })
    );

    return fullMessages;
}catch (error) {
        console.error('Error fetching Gmail emails:', error);
        throw error;
      }
    }

async function sendGmailReply(email, content) {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    if (!email.payload || !email.payload.headers) {
        throw new Error("Email payload or headers are missing.");
      }

      const fromHeader = email.payload.headers.find(header => header.name === 'From');
    const subjectHeader = email.payload.headers.find(header => header.name === 'Subject');

    // Check if required headers are available
    if (!fromHeader || !subjectHeader) {
      throw new Error("Required headers (From, Subject) are missing.");
    }
    const rawMessage = [
        `To: ${email.payload.headers.find(header => header.name === 'From').value}`,
        `From: me`,
        `Subject: Re: ${email.payload.headers.find(header => header.name === 'Subject').value}`,
        '',
        content,
    ].join('\n');

    const encodedMessage = Buffer.from(rawMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
}

module.exports = { fetchGmailEmails, sendGmailReply };
