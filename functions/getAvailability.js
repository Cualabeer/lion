import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export async function handler(event) {
  try {
    const { garageId, date, serviceType } = event.queryStringParameters;
    if (!garageId || !date || !serviceType) return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters' }) };

    const { data: bookings, error } = await supabase.from('bookings').select('time')
      .eq('garage_id', garageId).eq('date', date);
    if (error) throw error;

    const startHour = 9; const endHour = 16.5; const duration = serviceType === 'Bundle' ? 1.5 : 1;
    let slots = [];
    for (let hour = startHour; hour + duration <= endHour; hour += 0.5) {
      const slotTime = `${Math.floor(hour).toString().padStart(2,'0')}:${hour%1===0?'00':'30'}`;
      if (!bookings.some(b => b.time === slotTime)) slots.push(slotTime);
    }

    return { statusCode: 200, body: JSON.stringify(slots) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
