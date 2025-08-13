import nodemailer from 'nodemailer';

export async function handler(event) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // Send to yourself for testing
      subject: 'Test Email from Mobile Service Booking',
      text: 'This is a test email to verify Gmail integration.'
    });

    return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Email sent successfully' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
}