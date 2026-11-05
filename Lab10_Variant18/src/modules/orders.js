(function () {
  let nextId = 1;
  const orders = [];
  const statuses = ['Принят','Готовится','Готов','Выдан','Отменён'];
  function createOrder({customer, payment, items}) {
    const name = String(customer || '').trim();
    if (name.length < 2) throw new Error('Введите имя клиента (не менее 2 символов).');
    if (!Array.isArray(items) || items.length === 0) throw new Error('Добавьте хотя бы одно блюдо.');
    const cleanItems = items.map(item => {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error('Количество должно быть целым положительным числом.');
      return {id:item.id, name:item.name, price:item.price, quantity:item.quantity};
    });
    const pricing = window.LunchlineModules.pricing;
    const subtotal = pricing.calculateSubtotal(cleanItems);
    const order = {id:nextId++, customer:name, payment, items:cleanItems, subtotal, fee:pricing.calculateServiceFee(subtotal), total:pricing.calculateTotal(cleanItems), status:'Принят', createdAt:new Date()};
    orders.unshift(order);
    return {...order, items:order.items.map(i=>({...i}))};
  }
  function getAll() { return orders.map(o=>({...o,items:o.items.map(i=>({...i}))})); }
  function updateStatus(id,status) {
    if (!statuses.includes(status)) throw new Error('Недопустимый статус заказа.');
    const order = orders.find(o=>o.id===Number(id));
    if (!order) throw new Error('Заказ не найден.');
    order.status=status; return {...order};
  }
  window.LunchlineModules = window.LunchlineModules || {};
  window.LunchlineModules.orders = {createOrder,getAll,updateStatus,statuses};
})();