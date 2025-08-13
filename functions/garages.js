import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event){
  // Example: GET all garages
  if(event.httpMethod==='GET'){
    const { data,error }=await supabase.from('garages').select('*');
    if(error) return { statusCode:500, body: error.message };
    return { statusCode:200, body:JSON.stringify(data) };
  }
}