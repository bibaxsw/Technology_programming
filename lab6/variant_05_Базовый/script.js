
const body = document.body;
document.querySelector('#theme').addEventListener('click', () => {
  body.classList.toggle('dark');
  document.querySelector('#theme').textContent = body.classList.contains('dark') ? 'Светлая тема' : 'Темная тема';
});
