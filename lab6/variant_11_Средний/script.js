
document.querySelectorAll('.question').forEach(q => q.addEventListener('click', () => {
  document.querySelectorAll('.answer').forEach(a => a.hidden = true);
  q.nextElementSibling.hidden = false;
}));
