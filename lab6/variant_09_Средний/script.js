
const products = document.querySelector('#products');
document.querySelector('#add').addEventListener('click', () => {
  const li = document.createElement('li');
  li.dataset.qty = 1;
  li.innerHTML = `<span></span><button class="minus">−</button><b class="qty">1</b><button class="plus">+</button><button class="del">Удалить</button>`;
  li.querySelector('span').textContent = 'Новый товар';
  const qty = li.querySelector('.qty');
  li.querySelector('.minus').onclick = () => qty.textContent = Math.max(1, +qty.textContent - 1);
  li.querySelector('.plus').onclick = () => qty.textContent = +qty.textContent + 1;
  li.querySelector('.del').onclick = () => li.remove();
  products.append(li);
});
