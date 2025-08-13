import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_FROM, pass: process.env.GMAIL_APP_PASSWORD }
});

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { garageId, name, email, serviceType, date, time } = body;

    const { data: existing } = await supabase.from('bookings')
      .select('id').eq('garage_id', garageId).eq('date', date).eq('time', time);

    if (existing.length > 0) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Slot already booked' }) };

    const duration = serviceType === 'Bundle' ? 1.5 : 1;
    const { data: booking } = await supabase.from('bookings')
      .insert([{ garage_id: garageId, name, email, service_type: serviceType, date, time, duration }]).single();

    const qr = await QRCode.toDataURL(`${booking.id}`);
    const docDefinition = {
      content: [
        { text: 'Service Ticket', style: 'header' },
        `Name: ${name}`, `Garage: ${garageId}`, `Date: ${date}`, `Time: ${time}`,
        { image: qr, width: 100 }
      ]
    };
    const pdfDoc = pdfMake.createPdf(docDefinition);
    const pdfBase64 = await new Promise(resolve => pdfDoc.getBase64(data => resolve(data)));

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Service Booking Ticket',
      text: `Hi ${name}, your booking is confirmed for ${date} at ${time}.`,
      attachments: [{ filename: 'ticket.pdf', content: Buffer.from(pdfBase64, 'base64'), contentType: 'application/pdf' }]
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
}
