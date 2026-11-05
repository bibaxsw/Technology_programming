(function () {
  const {menu,pricing,orders,ui}=window.LunchlineModules;
  const cart=new Map(); let activeCategory='Все'; let searchTerm='';
  const app=window.LunchlineApp={};
  const getCart=()=>Array.from(cart.values()).map(i=>({...i}));
  function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(app.toastTimer);app.toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
  function refreshMenu(){const list=menu.getAll().filter(d=>(activeCategory==='Все'||d.category===activeCategory)&&d.name.toLowerCase().includes(searchTerm.toLowerCase()));ui.renderMenu(list,getCart(),addItem);}
  function refreshCart(){ui.renderCart(getCart(),pricing);}
  function addItem(id){const dish=menu.findById(id);if(!dish)return;const current=cart.get(id);cart.set(id,{...dish,quantity:current?current.quantity+1:1});refreshCart();toast('Блюдо добавлено в заказ');}
  app.changeQty=(id,delta)=>{const item=cart.get(id);if(!item)return;item.quantity+=delta;if(item.quantity<=0)cart.delete(id);refreshCart();};
  app.removeItem=id=>{cart.delete(id);refreshCart();toast('Позиция удалена');};
  function clearCart(){cart.clear();refreshCart();}
  function switchView(view){document.querySelector('#menuView').classList.toggle('hidden',view!=='menu');document.querySelector('#ordersView').classList.toggle('hidden',view!=='orders');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelector('#pageTitle').textContent=view==='menu'?'Меню и оформление заказа':'История заказов';if(view==='orders')refreshOrders();}
  function refreshOrders(){ui.renderOrders(orders.getAll(),orders.statuses);document.querySelector('#orderCount').textContent=orders.getAll().length;}
  app.changeStatus=(id,status)=>{try{orders.updateStatus(id,status);refreshOrders();toast('Статус заказа обновлён');}catch(e){toast(e.message);}};
  app.showOrder=id=>{const order=orders.getAll().find(o=>o.id===id);if(order)toast(`Заказ #${String(id).padStart(4,'0')} · ${order.customer} · ${ui.money(order.total)}`);};
  document.querySelector('#categoryFilters').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));refreshMenu();});
  document.querySelector('#searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim();refreshMenu();});
  document.querySelector('#clearOrderBtn').addEventListener('click',()=>{if(!cart.size){toast('Заказ уже пуст');return;}clearCart();toast('Заказ очищен');});
  document.querySelector('#submitOrderBtn').addEventListener('click',()=>{try{const order=orders.createOrder({customer:document.querySelector('#customerName').value,payment:document.querySelector('#paymentMethod').value,items:getCart()});clearCart();document.querySelector('#customerName').value='';refreshOrders();toast(`Заказ #${String(order.id).padStart(4,'0')} оформлен`);switchView('orders');}catch(e){toast(e.message);}});
  document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
  document.querySelector('#backToMenuBtn').addEventListener('click',()=>switchView('menu'));
  document.querySelector('#todayDate').textContent=new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
  refreshMenu();refreshCart();refreshOrders();
})();