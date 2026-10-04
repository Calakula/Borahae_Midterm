// Join page (Ravil): form validation with Bootstrap classes + result card
const form = document.getElementById('join-form');
const resultCard = document.getElementById('card-result');
const biasError = document.getElementById('bias-error');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const biasChosen = form.querySelector('input[name="bias"]:checked');
  biasError.classList.toggle('d-none', !!biasChosen);

  const fields = form.querySelectorAll('input:not([type="radio"]), select');
  let allValid = !!biasChosen;

  fields.forEach(function (field) {
    if (field.checkValidity()) {
      field.classList.remove('is-invalid');
    } else {
      field.classList.add('is-invalid');
      allValid = false;
    }
  });

  if (!allValid) return;

  document.getElementById('card-name').textContent = document.getElementById('name').value.trim();
  document.getElementById('card-bias').textContent = biasChosen.value;
  document.getElementById('card-country').textContent = document.getElementById('country').value;
  document.getElementById('card-number').textContent = Math.floor(10000 + Math.random() * 90000);

  form.classList.add('d-none');
  resultCard.classList.remove('d-none');
});

document.getElementById('reset-btn').addEventListener('click', function () {
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
  resultCard.classList.add('d-none');
  form.classList.remove('d-none');
});
