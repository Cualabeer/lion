import { createClient } from '@supabase/supabase-js';
import { handler as sendTicketHandler } from './sendTicket.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  try {
    const { bookingId } = JSON.parse(event.body);

    // Check if booking exists
    const { data, error } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
    if (error || !data) throw new Error('Booking not found');

    // Re-send the ticket
    return await sendTicketHandler(event);
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
}