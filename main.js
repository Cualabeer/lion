import { Litepicker } from 'https://cdn.jsdelivr.net/npm/litepicker/dist/bundle.js';

const garageSelect = document.getElementById('garage-select');
const calendarInput = document.getElementById('calendar');
const timeSelect = document.getElementById('time-select');
const serviceType = document.getElementById('service-type');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const bookBtn = document.getElementById('book-btn');
const confirmation = document.getElementById('confirmation');

let selectedGarage = null;
let garages = [];

async function loadGarages() {
  const res = await fetch('/.netlify/functions/getGarages');
  garages = await res.json();

  if (garages.length === 1) {
    garageSelect.style.display = 'none';
    selectedGarage = garages[0];
  } else {
    garages.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      garageSelect.appendChild(opt);
    });
    garageSelect.addEventListener('change', e => {
      selectedGarage = garages.find(g => g.id === e.target.value);
      loadAvailability();
    });
  }
  if (selectedGarage) loadAvailability();
}

const picker = new Litepicker({
  element: calendarInput,
  numberOfMonths: 2,
  singleMode: true,
  minDate: new Date(),
  setup: (picker) => {
    picker.on('selected', loadAvailability);
  }
});

async function loadAvailability() {
  if (!selectedGarage || !calendarInput.value) return;
  const res = await fetch(`/.netlify/functions/getAvailability?garageId=${selectedGarage.id}&date=${calendarInput.value}&serviceType=${serviceType.value}`);
  const slots = await res.json();
  timeSelect.innerHTML = '';
  slots.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    timeSelect.appendChild(opt);
  });
}

bookBtn.addEventListener('click', async () => {
  if (!nameInput.value || !emailInput.value || !calendarInput.value || !timeSelect.value) {
    confirmation.textContent = 'Please fill all fields.';
    return;
  }

  const payload = {
    garageId: selectedGarage.id,
    name: nameInput.value,
    email: emailInput.value,
    serviceType: serviceType.value,
    date: calendarInput.value,
    time: timeSelect.value
  };

  const res = await fetch('/.netlify/functions/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.success) {
    confirmation.innerHTML = `Booking confirmed! Check your email for the ticket.`;
  } else {
    confirmation.textContent = 'Booking failed: ' + data.error;
  }
});

loadGarages();
