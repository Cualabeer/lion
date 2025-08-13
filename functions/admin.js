async function checkConnections() {
  try {
    // Database check
    const dbRes = await fetch('/.netlify/functions/checkDb');
    const dbData = await dbRes.json();
    document.getElementById('db-status').textContent = dbData.success ? 'Connected ✅' : 'Failed ❌';

    // DVSA API check (using vehicleLookup function with dummy reg)
    const dvsaRes = await fetch('/.netlify/functions/vehicleLookup', {
      method: 'POST',
      body: JSON.stringify({ registration: 'TEST123' }),
    });
    const dvsaData = await dvsaRes.json();
    document.getElementById('dvsa-status').textContent = dvsaData.success ? 'Connected ✅' : 'Failed ❌';

    // Gmail check
    const gmailRes = await fetch('/.netlify/functions/sendEmail');
    const gmailData = await gmailRes.json();
    document.getElementById('gmail-status').textContent = gmailData.success ? 'Connected ✅' : 'Failed ❌';
  } catch (err) {
    console.error(err);
    document.getElementById('db-status').textContent = 'Failed ❌';
    document.getElementById('dvsa-status').textContent = 'Failed ❌';
    document.getElementById('gmail-status').textContent = 'Failed ❌';
  }
}

// Run check on page load
checkConnections();