
const form = document.querySelector('#form'), tbody = document.querySelector('#tbody');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const grade = document.querySelector('#grade').value;
  if (!name || grade === '') return;
  const tr = document.createElement('tr');
  tr.innerHTML = `<td></td><td></td><td><button>Удалить</button></td>`;
  tr.children[0].textContent = name; tr.children[1].textContent = grade;
  tr.querySelector('button').addEventListener('click', () => tr.remove());
  tbody.append(tr); form.reset();
});
