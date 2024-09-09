const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function fetchOutlookEmails(accessToken) {
    const response = await fetch('https://outlook.office.com/api/v2.0/me/messages?$filter=IsRead eq false', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.value || [];
}

async function sendOutlookReply(accessToken, messageId, replyContent, senderEmail) {
    const replyBody = {
        Message: {
            Subject: 'Re: Auto-reply',
            Body: { ContentType: 'Text', Content: replyContent },
            ToRecipients: [{ EmailAddress: { Address: senderEmail } }]
        }
    };

    await fetch(`https://outlook.office.com/api/v2.0/me/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyBody),
    });
}

module.exports = { fetchOutlookEmails, sendOutlookReply };
