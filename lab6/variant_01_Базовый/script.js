
const list = document.querySelector('#list');
const input = document.querySelector('#itemInput');
const addBtn = document.querySelector('#addBtn');
const count = document.querySelector('#count');

function updateCount() {
  count.textContent = `Всего покупок: ${list.children.length}`;
}

addBtn.addEventListener('click', addItem);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

function addItem() {
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement('li');
  li.textContent = text;
  li.addEventListener('click', () => li.classList.toggle('done'));
  list.append(li);
  input.value = '';
  input.focus();
  updateCount();
}
