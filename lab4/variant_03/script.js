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

const form = document.getElementById('ticketForm');
const result = document.getElementById('result');
const citySelect = document.getElementById('city');

function calcPrice() {
  const base = Number(citySelect.options[citySelect.selectedIndex].dataset.price);
  const typeEl = document.querySelector('input[name="type"]:checked');
  if (base === 0 || !typeEl) return 0;
  return Math.round(base * Number(typeEl.dataset.mult));
}
// Творческое: цена билета считается сразу при выборе
function updatePrice() {
  const price = calcPrice();
  document.getElementById('price').textContent =
    price > 0 ? 'Цена: ' + price.toLocaleString('ru-RU') + ' ₸' : 'Цена: выберите город и тип';
}
form.addEventListener('change', updatePrice);

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const city = citySelect.value;
  const type = selectedRadio('type');

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя пассажира' : ''));
  results.push(setError('city', city === '' ? 'Выберите город назначения' : ''));
  results.push(setError('type', type === '' ? 'Выберите тип билета' : ''));
  results.push(setError('terms', document.getElementById('terms').checked ? '' : 'Примите условия перевозки, чтобы продолжить'));

  if (!results.every(Boolean)) return;

  result.innerHTML = '<h2>Билет заказан</h2>' +
    '<p>Пассажир: ' + name + '</p><p>Куда: ' + city + '</p><p>Класс: ' + type + '</p>' +
    '<p><b>К оплате: ' + calcPrice().toLocaleString('ru-RU') + ' ₸</b></p>';
  result.classList.add('show');
});
