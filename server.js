// ===========================
//   AUTO ÉCOLE ANOUAR — SERVER
// ===========================

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Nodemailer Transporter ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---- GET / ----
app.get('/', (req, res) => {
  res.send('Server running — Auto École Anouar ✅');
});

// ---- POST /contact ----
app.post('/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;

  // Validation
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }

  // Email options
  const mailOptions = {
    from: `"Auto École Anouar" <${process.env.EMAIL_USER}>`,
    to: 'mouadelotmani12@gmail.com',
    replyTo: email,
    subject: `📩 Nouveau message de ${name} — Auto École Anouar`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 32px; text-align: center;">
          <h1 style="color: #e8b84b; margin: 0; font-size: 1.6rem;">🚗 Auto École Anouar</h1>
          <p style="color: #aaa; margin: 8px 0 0; font-size: 0.9rem;">Nouveau message de contact</p>
        </div>
        <div style="padding: 32px; background: #fff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.88rem; width: 30%;">👤 Nom</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #222;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.88rem;">📱 Téléphone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #222;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 0.88rem;">✉️ Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #222;">${email}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #666; font-size: 0.88rem; margin-bottom: 10px;">💬 Message :</p>
            <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; color: #333; line-height: 1.7; font-size: 0.95rem;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-top: 28px; padding: 16px; background: #fffbe6; border-left: 4px solid #e8b84b; border-radius: 4px;">
            <p style="color: #666; font-size: 0.85rem; margin: 0;">Vous pouvez répondre directement à cet email pour contacter <strong>${name}</strong>.</p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center;">
          <p style="color: #999; font-size: 0.8rem; margin: 0;">© ${new Date().getFullYear()} Auto École Anouar — Rabat, Maroc</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${name} (${email})`);
    return res.status(200).json({ success: true, message: 'Message envoyé avec succès !' });
  } catch (err) {
    console.error('❌ Email error:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email.' });
  }
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`\n🚗 Auto École Anouar — Server running`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`📬 Emails → mouadelotmani12@gmail.com\n`);
});
