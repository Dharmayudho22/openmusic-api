const nodemailer = require('nodemailer');
const config = require('../utils/config');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.mail.smtpHost,
      port: config.mail.smtpPort,
      secure: false, 
      auth: {
        user: config.mail.smtpUser,
        pass: config.mail.smtpPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic', 
      to: targetEmail,
      subject: 'Ekspor Playlist dari OpenMusic',
      text: 'Terlampir hasil ekspor playlist dari OpenMusic',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;