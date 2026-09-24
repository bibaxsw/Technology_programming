// Показать/убрать ошибку у поля с data-field="key"
function setError(key, message) {
  const wrap = document.querySelector('[data-field="' + key + '"]');
  wrap.classList.toggle('invalid', message !== '');
  wrap.classList.toggle('valid', message === '');
  wrap.querySelector('.error').textContent = message;
  return message === '';
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function selectedRadio(name) {
  const el = document.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

const form = document.getElementById('eventForm');
const result = document.getElementById('result');
const categorySelect = document.getElementById('category');
const quantityInput = document.getElementById('quantity');

function getOptions() {
  return Array.from(document.querySelectorAll('input[name="option"]:checked'));
}
function calcTotal() {
  const qty = Number(quantityInput.value);
  const price = Number(categorySelect.options[categorySelect.selectedIndex].dataset.price);
  const options = getOptions().reduce(function (sum, box) { return sum + Number(box.dataset.price); }, 0);
  const tickets = Number.isInteger(qty) && qty > 0 ? price * qty : 0;
  return tickets + options;
}
function updateTotal() {
  document.getElementById('total').textContent = 'Итого: ' + calcTotal().toLocaleString('ru-RU') + ' ₸';
}
form.addEventListener('input', updateTotal);
form.addEventListener('change', updateTotal);

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const category = categorySelect.value;
  const qtyText = quantityInput.value.trim();
  const qty = Number(qtyText);

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя' : ''));

  let emailMessage = '';
  if (email === '') emailMessage = 'Введите e-mail';
  else if (!isEmail(email)) emailMessage = 'E-mail должен быть вида name@example.com';
  results.push(setError('email', emailMessage));

  results.push(setError('category', category === '' ? 'Выберите категорию билета' : ''));

  let qtyMessage = '';
  if (qtyText === '') qtyMessage = 'Введите количество билетов';
  else if (!Number.isInteger(qty)) qtyMessage = 'Количество должно быть целым числом';
  else if (qty < 1 || qty > 10) qtyMessage = 'Можно купить от 1 до 10 билетов';
  results.push(setError('quantity', qtyMessage));

  results.push(setError('options', ''));

  if (!results.every(Boolean)) return;

  const options = getOptions().map(function (box) { return box.value; });
  result.innerHTML = '<h2>Бронирование подтверждено</h2>' +
    '<p>' + name + ' (' + email + ')</p><p>Билеты: ' + category + ' × ' + qty + '</p>' +
    '<p>Опции: ' + (options.length ? options.join(', ') : 'не выбраны') + '</p>' +
    '<p><b>Итоговая стоимость: ' + calcTotal().toLocaleString('ru-RU') + ' ₸</b></p>';
  result.classList.add('show');
});
updateTotal();
