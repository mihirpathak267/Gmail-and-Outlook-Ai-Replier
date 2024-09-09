const openai = require('../config/openaiConfig');

async function categorizeEmail(content) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an email assistant in a product based company' },
      { role: 'user', content: `Categorize the emails as Interested, Not Interested or More Information Required labels.: ${content}` }
    ],
    max_tokens: 50,
  });
  return response.choices[0].message.content.trim();
}

async function generateReply(content, category) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an email assistant in a product based company.' },
      { role: 'user', content: `Draft a reply according to label ${category} assigned to the email. If Interested then suggest a time for a demo call. If Not Interested then thank them for their time and If More Information Required then try and explain about the role of an email assistant : ${content}` }
    ],
    max_tokens: 150,
  });
  return response.choices[0].message.content.trim();
}

module.exports = { categorizeEmail, generateReply };
