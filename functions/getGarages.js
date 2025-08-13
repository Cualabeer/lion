import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
export async function handler() {
  try {
    const { data: garages, error } = await supabase.from('garages').select('*').order('name');
    if (error) throw error;
    return { statusCode: 200, body: JSON.stringify(garages) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
