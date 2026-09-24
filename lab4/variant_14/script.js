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

const form = document.getElementById('supportForm');
const result = document.getElementById('result');
const description = document.getElementById('description');
const MIN_LENGTH = 20;

// Творческое: счётчик до минимальной длины описания
description.addEventListener('input', function () {
  const length = description.value.trim().length;
  document.getElementById('counter').textContent = length >= MIN_LENGTH
    ? 'Длина описания: ' + length + ' — достаточно'
    : length + ' из ' + MIN_LENGTH + ' минимальных символов';
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const email = document.getElementById('email').value.trim();
  const category = document.getElementById('category').value;
  const priority = selectedRadio('priority');
  const text = description.value.trim();

  const results = [];
  let emailMessage = '';
  if (email === '') emailMessage = 'Введите e-mail, на который отправить ответ';
  else if (!isEmail(email)) emailMessage = 'E-mail должен быть вида name@example.com';
  results.push(setError('email', emailMessage));

  results.push(setError('category', category === '' ? 'Выберите категорию проблемы' : ''));
  results.push(setError('priority', priority === '' ? 'Выберите приоритет' : ''));

  let textMessage = '';
  if (text === '') textMessage = 'Опишите проблему';
  else if (text.length < MIN_LENGTH) textMessage = 'Опишите подробнее: нужно минимум ' + MIN_LENGTH + ' символов, сейчас ' + text.length;
  results.push(setError('description', textMessage));

  if (!results.every(Boolean)) return;

  const ticketNumber = 'SUP-' + Math.floor(1000 + Math.random() * 9000);
  result.innerHTML = '<h2>Заявка ' + ticketNumber + ' принята</h2>' +
    '<p>Ответ придёт на: ' + email + '</p><p>Категория: ' + category + '</p>' +
    '<p>Приоритет: ' + priority + '</p>';
  result.classList.add('show');
});
