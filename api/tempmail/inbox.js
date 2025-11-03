// Modified inbox.js
const axios = require('axios');

const meta = {
  name: "Inbox",
  desc: "Fetch inbox for temporary email",
  method: [ 'get', 'post' ],
  category: 'tempmail',
  params: [
    {
      name: 'email',
      description: 'The temporary email address',
      example: 'example@temp-mail.io',
      required: true
    }
  ]
};

async function onStart({ req, res }) {
  let email;
  if (req.method === 'POST') {
    ({ email } = req.body);
  } else {
    ({ email } = req.query);
  }
  if (!email) {
    return res.status(400).json({
      error: "Missing required parameter: email"
    });
  }

  try {
    const response = await axios.get(`https://api.internal.temp-mail.io/api/v3/email/${email}/messages`);
    return res.json({
      answer: response.data
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = { meta, onStart };