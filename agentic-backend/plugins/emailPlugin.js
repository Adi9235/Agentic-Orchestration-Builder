// plugins/emailPlugin.js
const nodemailer = require('nodemailer');

module.exports = {
  type: 'email',
  label: 'Send Email',
  description: 'Send an email notification or message to a user.',

  async execute(node, context, input) {
    const { to, subject, body } = node.params || input;

    if (!to) throw new Error('Missing email recipient');

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: subject || 'Agentic Workflow Email',
      text: body || 'This is a test message from Agentic Orchestrator!',
    };

    await transporter.sendMail(mailOptions);

    console.log(`📨 Email sent to ${to}`);

    return {
      status: 'succeeded',
      output: { delivered_to: to, message: 'Email sent successfully' },
      next: node.next,
    };
  },
};
