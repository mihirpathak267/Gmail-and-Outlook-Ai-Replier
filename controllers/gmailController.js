const { fetchGmailEmails, sendGmailReply } = require('../services/gmailService');
const { categorizeEmail, generateReply } = require('../services/openaiService');

async function processGmailEmails(req, res) {
  try {
    const emails = await fetchGmailEmails();
    for (const email of emails) {
        console.log(email)
      const category = await categorizeEmail(email.content);
      const reply = await generateReply(email.content, category);
      await sendGmailReply(email, reply);
    }
    res.send('Gmail emails processed.');
  } catch (error) {
    console.log(error)
    res.status(500).send('Error processing Gmail emails.');
  }
}

module.exports = { processGmailEmails };
