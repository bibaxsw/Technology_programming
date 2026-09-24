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

const form = document.getElementById('deliveryForm');
const result = document.getElementById('result');
const RATE_PER_KG = 150; // ₸ за килограмм

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const citySelect = document.getElementById('city');
  const city = citySelect.value;
  const weightText = document.getElementById('weight').value.trim();
  const weight = Number(weightText);
  const kind = selectedRadio('kind');

  const results = [];
  results.push(setError('city', city === '' ? 'Выберите город получателя' : ''));

  let weightMessage = '';
  if (weightText === '') weightMessage = 'Введите вес посылки';
  else if (!Number.isFinite(weight)) weightMessage = 'Вес должен быть числом';
  else if (weight <= 0) weightMessage = 'Вес должен быть больше нуля';
  else if (weight > 50) weightMessage = 'Максимальный вес посылки — 50 кг';
  results.push(setError('weight', weightMessage));

  results.push(setError('kind', kind === '' ? 'Выберите тип доставки' : ''));

  if (!results.every(Boolean)) return;

  const base = Number(citySelect.options[citySelect.selectedIndex].dataset.price);
  const mult = Number(document.querySelector('input[name="kind"]:checked').dataset.mult);
  const cost = Math.round((base + weight * RATE_PER_KG) * mult);

  result.innerHTML = '<h2>Стоимость рассчитана</h2>' +
    '<p>Город: ' + city + '</p><p>Вес: ' + weight + ' кг</p><p>Доставка: ' + kind + '</p>' +
    '<p><b>Итого: ' + cost.toLocaleString('ru-RU') + ' ₸</b></p>';
  result.classList.add('show');
});
