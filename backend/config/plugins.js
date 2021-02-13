module.exports = ({ env }) => ({
    email: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 25),
        auth: {
          user: env('SMTP_USERNAME', 'mail@example.com'),
          pass: env('SMTP_PASSWORD', 'password'),
        }
      },
      settings: {
        defaultFrom: env('EMAIL', 'mail@example.com'),
        defaultReplyTo: env('EMAIL', 'mail@example.com'),
      }
    }
  });