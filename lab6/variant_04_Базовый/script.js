
const input = document.querySelector('#note');
const list = document.querySelector('#notes');
document.querySelector('#add').addEventListener('click', add);
input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
function add() {
  const text = input.value.trim();
  if (!text) return;
  const li = document.createElement('li');
  li.innerHTML = `<span></span><button>Удалить</button>`;
  li.querySelector('span').textContent = text;
  li.querySelector('button').addEventListener('click', () => li.remove());
  list.append(li); input.value = ''; input.focus();
}
