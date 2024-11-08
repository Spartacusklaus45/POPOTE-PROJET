import nodemailer from 'nodemailer';
import { config } from '../config.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Popote" <${config.email.user}>`,
      to,
      subject,
      html
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (order, user) => {
  const html = `
    <h1>Confirmation de commande</h1>
    <p>Bonjour ${user.name},</p>
    <p>Votre commande #${order._id} a été confirmée.</p>
    <p>Total : ${order.totalPrice} FCFA</p>
    <p>Date de livraison : ${new Date(order.deliverySlot.date).toLocaleDateString()}</p>
    <p>Créneau : ${order.deliverySlot.timeSlot}</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Confirmation de votre commande Popote',
    html
  });
};

export const sendPasswordReset = async (user, resetToken) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  
  const html = `
    <h1>Réinitialisation de mot de passe</h1>
    <p>Bonjour ${user.name},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
    <p>Cliquez sur le lien suivant pour définir un nouveau mot de passe :</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Ce lien expirera dans 1 heure.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Réinitialisation de votre mot de passe Popote',
    html
  });
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Bienvenue sur Popote !</h1>
    <p>Bonjour ${user.name},</p>
    <p>Nous sommes ravis de vous compter parmi nos membres.</p>
    <p>Découvrez nos recettes et commencez à cuisiner !</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Bienvenue sur Popote',
    html
  });
};