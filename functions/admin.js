async function checkConnections() {
  try {
    // Database
    const dbRes = await fetch('/.netlify/functions/checkDb');
    const dbData = await dbRes.json();
    document.getElementById('db-status').textContent = dbData.success ? 'Connected ✅' : 'Failed ❌';

    // DVSA API
    const dvsaRes = await fetch('/.netlify/functions/vehicleLookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration: 'TEST123' })
    });
    const dvsaData = await dvsaRes.json();
    document.getElementById('dvsa-status').textContent = dvsaData.success ? 'Connected ✅' : 'Failed ❌';

    // Gmail
    const gmailRes = await fetch('/.netlify/functions/checkEmail');
    const gmailData = await gmailRes.json();
    document.getElementById('gmail-status').textContent = gmailData.success ? 'Connected ✅' : 'Failed ❌';
  } catch (err) {
    document.getElementById('db-status').textContent = 'Failed ❌';
    document.getElementById('dvsa-status').textContent = 'Failed ❌';
    document.getElementById('gmail-status').textContent = 'Failed ❌';
  }
}

async function loadGarages() {
  const res = await fetch('/.netlify/functions/getGarages');
  const data = await res.json();
  const tbody = document.querySelector('#garages-table tbody');
  tbody.innerHTML = '';
  data.forEach(garage => {
    tbody.innerHTML += `
      <tr>
        <td>${garage.id}</td>
        <td>${garage.name}</td>
        <td>${garage.status}</td>
        <td>
          <button onclick="toggleGarage(${garage.id})">
            ${garage.status === 'online' ? 'Set Offline' : 'Set Online'}
          </button>
        </td>
      </tr>
    `;
  });
}

async function loadBookings() {
  const res = await fetch('/.netlify/functions/getBookings');
  const data = await res.json();
  const tbody = document.querySelector('#bookings-table tbody');
  tbody.innerHTML = '';
  data.forEach(b => {
    tbody.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.customer}</td>
        <td>${b.garage}</td>
        <td>${b.vehicle}</td>
        <td>${b.date}</td>
        <td>${b.time}</td>
      </tr>
    `;
  });
}

async function verifyBooking() {
  const id = document.getElementById('verify-id').value;
  const res = await fetch('/.netlify/functions/verifyBooking?id=' + encodeURIComponent(id));
  const data = await res.json();
  alert(data.message);
}

checkConnections();
loadGarages();
loadBookings();