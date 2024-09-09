const { fetchOutlookEmails, sendOutlookReply } = require('../services/outlookService');
const { categorizeEmail, generateReply } = require('../services/openaiService');

async function processOutlookEmails(req, res) {
  try {
    const accessToken = req.session.accessToken;
    const emails = await fetchOutlookEmails(accessToken);
    for (const email of emails) {
      const category = await categorizeEmail(email.Body.Content);
      const reply = await generateReply(email.Body.Content, category);
      await sendOutlookReply(accessToken, email.Id, reply, email.From.EmailAddress.Address);
    }
    res.send('Outlook emails processed.');
  } catch (error) {
    res.status(500).send('Finished processing and replying.');
  }
}

module.exports = { processOutlookEmails };