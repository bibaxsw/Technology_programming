
const main = document.querySelector('#main');
document.querySelectorAll('.thumb').forEach(img => {
  img.addEventListener('click', () => {
    main.src = img.src;
    document.querySelector('.active')?.classList.remove('active');
    img.classList.add('active');
  });
});
