const fetch = require('node-fetch');
const querystring = require('querystring');

const validateCaptcha = async (token, secret) => {
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify?' + querystring.stringify({
            secret: secret,
            response: token
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        if (!response || response.status !== 200) {
            return false;
        }
        const parsedResponse = await response.json();

        if (parsedResponse && parsedResponse.success) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

module.exports = validateCaptcha;