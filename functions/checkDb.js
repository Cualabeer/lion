import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler() {
  try {
    const { data, error } = await supabase.from('garages').select('*').limit(1);
    if (error) throw error;
    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
}