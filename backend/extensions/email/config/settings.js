const { parse } = require('envfile');
const fs = require('fs');
const path = require('path');

let emailConfig = {};

if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'email.env'))) {
    const tempConfig = parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'email.env')));
    for (const key in tempConfig) {
        emailConfig[key.toUpperCase()] = tempConfig[key];
    }
}

module.exports = {
    provider: "nodemailer",
    providerOptions: {
        nodemailer_default_from: emailConfig['EMAIL'] || "xxx@xxx.com",
        nodemailer_default_replyto: emailConfig['EMAIL'] || "xxx@xxx.com",
        host: emailConfig['HOST'] || "xxx.yyy.com",
        port: emailConfig['PORT'] || 25,
        password: emailConfig['PASSWORD'] || "password",
        username: emailConfig['USERNAME'] || "username",
        authMethod: emailConfig['TRANSPORT'] || "SMTP",
    },
};