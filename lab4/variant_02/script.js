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

const form = document.getElementById('feedbackForm');
const result = document.getElementById('result');
const message = document.getElementById('message');

// Творческое: счётчик символов
message.addEventListener('input', function () {
  document.getElementById('counter').textContent = message.value.length + ' / 500';
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.classList.remove('show');

  const name = document.getElementById('name').value.trim();
  const topic = document.getElementById('topic').value;
  const text = message.value.trim();

  const results = [];
  results.push(setError('name', name === '' ? 'Введите имя' : ''));
  results.push(setError('topic', topic === '' ? 'Выберите тему сообщения' : ''));
  results.push(setError('message', text === '' ? 'Напишите текст сообщения' : ''));

  if (!results.every(Boolean)) return;

  result.innerHTML = '<h2>Сообщение отправлено</h2>' +
    '<p>От: ' + name + '</p><p>Тема: ' + topic + '</p><p>Текст: ' + text + '</p>';
  result.classList.add('show');
});
