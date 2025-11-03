const axios = require('axios');

const meta = {
    name: "Gen",
    version: "1.0.0",
    author: "jm",
    category: "tempmail",
    method: "get",
    params: []
};

async function onStart({ res, req }) {
    try {
        const response = await axios.post('https://api.internal.temp-mail.io/api/v3/email/new');
        res.json({
            email: response.data.email});
    } catch (error) {
        res.status(500).json({
            error: "Failed to generate temp email",
            details: error.response?.data || error.message
        });
    }
}

module.exports = { meta, onStart };
