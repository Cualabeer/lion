import fetch from 'node-fetch';
export async function handler(event){
  const { reg } = event.queryStringParameters;
  const apiKey = process.env.VEHICLE_API_KEY;
  const res = await fetch(`https://api.example.com/lookup?reg=${reg}&apikey=${apiKey}`);
  const data = await res.json();
  return { statusCode: 200, body: JSON.stringify(data) };
}