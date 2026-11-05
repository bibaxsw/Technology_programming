(function () {
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderMenu(dishes, cart, onAdd) {
    const grid=document.querySelector('#menuGrid');
    grid.innerHTML=dishes.map(d=>`<article class="food-card"><div class="food-visual"><span class="food-placeholder">${escapeHTML(d.category.toUpperCase())}</span></div><div class="food-info"><div class="food-category">${escapeHTML(d.category)}</div><h3>${escapeHTML(d.name)}</h3><div class="food-bottom"><span class="price">${money(d.price)}</span><button class="add-button" data-add="${d.id}" aria-label="Добавить ${escapeHTML(d.name)}">+</button></div></div></article>`).join('');
    document.querySelector('#menuResultCount').textContent=`${dishes.length} позиций`;
    document.querySelector('#emptyMenu').classList.toggle('hidden',dishes.length>0);
    grid.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>onAdd(Number(btn.dataset.add))));
  }
  function renderCart(items, pricing) {
    const host=document.querySelector('#cartItems');
    if(!items.length){host.innerHTML='<div class="cart-empty"><div class="empty-line"></div><p>Пока ничего нет</p><small>Добавьте блюда из меню</small></div>';}
    else host.innerHTML=items.map(i=>`<div class="cart-row"><div><div class="cart-name">${escapeHTML(i.name)}</div><div class="cart-unit">${money(i.price)} за порцию</div><div class="cart-controls"><button class="qty-button" data-minus="${i.id}" aria-label="Уменьшить">−</button><span class="qty-value">${i.quantity}</span><button class="qty-button" data-plus="${i.id}" aria-label="Увеличить">+</button><button class="remove-button" data-remove="${i.id}" aria-label="Удалить">×</button></div></div><div class="cart-line-total">${money(i.price*i.quantity)}</div></div>`).join('');
    const subtotal=pricing.calculateSubtotal(items), fee=pricing.calculateServiceFee(subtotal), total=subtotal+fee, qty=items.reduce((s,i)=>s+i.quantity,0);
    document.querySelector('#itemsTotal').textContent=qty;
    document.querySelector('#subtotal').textContent=money(subtotal);
    document.querySelector('#serviceFee').textContent=money(fee);
    document.querySelector('#grandTotal').textContent=money(total);
    document.querySelector('#checkoutAmount').textContent=money(total);
    document.querySelector('#submitOrderBtn').disabled=!items.length;
    host.querySelectorAll('[data-minus]').forEach(b=>b.addEventListener('click',()=>window.LunchlineApp.changeQty(Number(b.dataset.minus),-1)));
    host.querySelectorAll('[data-plus]').forEach(b=>b.addEventListener('click',()=>window.LunchlineApp.changeQty(Number(b.dataset.plus),1)));
    host.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>window.LunchlineApp.removeItem(Number(b.dataset.remove))));
  }
  function renderOrders(orders, statuses) {
    const body=document.querySelector('#ordersTableBody');
    body.innerHTML=orders.map(o=>`<tr><td>#${String(o.id).padStart(4,'0')}</td><td>${escapeHTML(o.customer)}</td><td>${o.items.map(i=>`${escapeHTML(i.name)} × ${i.quantity}`).join('<br>')}</td><td><strong>${money(o.total)}</strong></td><td>${escapeHTML(o.payment)}</td><td><select class="status-select" data-status="${o.id}" aria-label="Статус заказа">${statuses.map(s=>`<option ${s===o.status?'selected':''}>${escapeHTML(s)}</option>`).join('')}</select></td><td><button class="text-button" data-view-order="${o.id}">Просмотр</button></td></tr>`).join('');
    document.querySelector('#emptyOrders').classList.toggle('hidden',orders.length>0);
    body.querySelectorAll('[data-status]').forEach(sel=>sel.addEventListener('change',()=>window.LunchlineApp.changeStatus(Number(sel.dataset.status),sel.value)));
    body.querySelectorAll('[data-view-order]').forEach(btn=>btn.addEventListener('click',()=>window.LunchlineApp.showOrder(Number(btn.dataset.viewOrder))));
  }
  window.LunchlineModules=window.LunchlineModules||{};
  window.LunchlineModules.ui={money,renderMenu,renderCart,renderOrders};
})();