(function () {
  const SERVICE_RATE = 0.05;
  function calculateSubtotal(items) { return items.reduce((sum, item) => sum + item.price * item.quantity, 0); }
  function calculateServiceFee(subtotal) { return Math.round(subtotal * SERVICE_RATE); }
  function calculateTotal(items) { const subtotal = calculateSubtotal(items); return subtotal + calculateServiceFee(subtotal); }
  window.LunchlineModules = window.LunchlineModules || {};
  window.LunchlineModules.pricing = { calculateSubtotal, calculateServiceFee, calculateTotal, SERVICE_RATE };
})();