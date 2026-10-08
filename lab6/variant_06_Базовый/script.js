
const input = document.querySelector('#name');
const greeting = document.querySelector('#greeting');
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const name = input.value.trim();
    greeting.textContent = name ? `Привет, ${name}! Добро пожаловать.` : 'Введите имя.';
  }
});
