import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'outlook', 
  auth: {
    user: 'BeginnersAppDev@outlook.com',
    pass: 'BAD2024flopastom'
  }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
