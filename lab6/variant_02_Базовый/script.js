
const value = document.querySelector('#value');
document.querySelector('#plus').addEventListener('click', () => value.textContent = +value.textContent + 1);
document.querySelector('#minus').addEventListener('click', () => value.textContent = +value.textContent - 1);
document.querySelector('#reset').addEventListener('click', () => value.textContent = 0);
