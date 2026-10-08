
const input = document.querySelector('#task');
const list = document.querySelector('#tasks');
function addTask() {
  const text = input.value.trim(); if (!text) return;
  const li = document.createElement('li');
  li.innerHTML = `<span></span><div><button class="done">✓</button><button class="del">×</button></div>`;
  li.querySelector('span').textContent = text;
  li.querySelector('.done').addEventListener('click', () => li.classList.toggle('done'));
  li.querySelector('.del').addEventListener('click', () => li.remove());
  list.append(li); input.value = '';
}
document.querySelector('#add').addEventListener('click', addTask);
document.querySelector('#clear').addEventListener('click', () => document.querySelectorAll('#tasks .done').forEach(x => x.remove()));
