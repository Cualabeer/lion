import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event){
  const { bookingId } = JSON.parse(event.body);
  const { data: booking, error } = await supabase.from('bookings').select('*, garages(name)').eq('id', bookingId).single();
  if(error) return { statusCode:500, body:error.message };

  const qrDataUrl = await QRCode.toDataURL(`https://yourdomain.com/verify.html?id=${bookingId}`);
  const doc = new PDFDocument();
  let buffers=[];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async ()=>{
    const pdfData = Buffer.concat(buffers);
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{ user:process.env.EMAIL_FROM, pass:process.env.GMAIL_APP_PASSWORD }
    });
    await transporter.sendMail({
      from:process.env.EMAIL_FROM,
      to:booking.email,
      subject:'Your Service Booking Ticket',
      text:`Hello ${booking.name}, your ticket is attached.`,
      attachments:[{filename:'ticket.pdf', content:pdfData}]
    });
  });

  doc.fontSize(20).text('Service Booking Ticket',{align:'center'});
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${booking.name}`);
  doc.text(`Garage: ${booking.garages.name}`);
  doc.text(`Vehicle: ${booking.vehicle_registration}`);
  doc.text(`Service Type: ${booking.service_type}`);
  doc.text(`Date: ${booking.date}`);
  doc.text(`Time: ${booking.time}`);
  doc.text(`Duration: ${booking.duration} hr`);
  doc.moveDown();
  const qrImage=qrDataUrl.replace(/^data:image\/png;base64,/,'');
  doc.image(Buffer.from(qrImage,'base64'),{fit:[150,150],align:'center'});
  doc.end();
  return { statusCode:200, body:JSON.stringify({success:true}) };
}