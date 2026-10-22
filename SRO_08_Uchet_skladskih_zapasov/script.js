const STORAGE_KEY = "sro_stock_v1";
const LOW_STOCK_LIMIT = 5;

const sampleProducts = [
  { id: 1, name: "Кабель USB-C", category: "Аксессуары", quantity: 12, price: 1500 },
  { id: 2, name: "Мышь беспроводная", category: "Периферия", quantity: 4, price: 4200 },
  { id: 3, name: "Блок питания", category: "Комплектующие", quantity: 8, price: 6500 }
];

let products = loadProducts();
let history = loadHistory();
let nextId = Math.max(0, ...products.map(product => product.id)) + 1;

const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const searchInput = document.getElementById("search");

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? [...sampleProducts] : JSON.parse(saved);
  } catch (error) {
    return [...sampleProducts];
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}_history`)) || [];
  } catch (error) {
    return [];
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
}

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "KZT", maximumFractionDigits: 2
  }).format(value);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function showMessage(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showMessage.timer);
  showMessage.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function addHistory(type, productName, quantity, note) {
  history.unshift({
    date: new Date().toLocaleString("ru-RU"),
    type, productName, quantity, note
  });
  history = history.slice(0, 30);
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru-RU");
  const filtered = products.filter(product =>
    product.name.toLocaleLowerCase("ru-RU").includes(query) ||
    product.category.toLocaleLowerCase("ru-RU").includes(query)
  );
  const rows = document.getElementById("productRows");
  rows.innerHTML = filtered.map(product => `
    <tr>
      <td><strong>${escapeHTML(product.name)}</strong><span class="subtext">ID: ${product.id}</span></td>
      <td>${escapeHTML(product.category)}</td>
      <td class="${product.quantity <= LOW_STOCK_LIMIT ? "stock-low" : ""}">${product.quantity}${product.quantity <= LOW_STOCK_LIMIT ? " · мало" : ""}</td>
      <td>${money(product.price)}</td>
      <td><strong>${money(product.quantity * product.price)}</strong></td>
      <td>
        <button class="small-btn secondary" data-action="receive" data-id="${product.id}">+ Поступление</button>
        <button class="small-btn secondary" data-action="writeoff" data-id="${product.id}">− Списание</button>
        <button class="small-btn danger" data-action="delete" data-id="${product.id}">Удалить</button>
      </td>
    </tr>`).join("");
  document.getElementById("emptyState").hidden = filtered.length !== 0;
  renderStats();
}

function renderStats() {
  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
  const lowCount = products.filter(product => product.quantity <= LOW_STOCK_LIMIT).length;
  document.getElementById("statKinds").textContent = products.length;
  document.getElementById("totalKinds").textContent = products.length;
  document.getElementById("statUnits").textContent = totalUnits;
  document.getElementById("statValue").textContent = money(totalValue);
  document.getElementById("statLow").textContent = lowCount;
}

function renderHistory() {
  const rows = document.getElementById("historyRows");
  rows.innerHTML = history.map(item => `
    <tr>
      <td>${escapeHTML(item.date)}</td>
      <td>${escapeHTML(item.type)}</td>
      <td>${escapeHTML(item.productName)}</td>
      <td>${item.quantity}</td>
      <td>${escapeHTML(item.note)}</td>
    </tr>`).join("");
  document.getElementById("historyEmpty").hidden = history.length !== 0;
}

function renderAll() {
  renderProducts();
  renderHistory();
}

function validateProduct(name, category, quantity, price) {
  if (!name || !category) return "Заполните название товара и категорию.";
  if (!Number.isInteger(quantity) || quantity <= 0) return "Количество должно быть целым числом больше нуля.";
  if (!Number.isFinite(price) || price < 0) return "Цена должна быть числом не меньше нуля.";
  return "";
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = nameInput.value.trim().replace(/\s+/g, " ");
  const category = categoryInput.value.trim().replace(/\s+/g, " ");
  const quantity = Number(quantityInput.value);
  const price = Number(priceInput.value);
  const error = validateProduct(name, category, quantity, price);
  if (error) {
    showMessage(error);
    return;
  }

  const existing = products.find(product => product.name.toLocaleLowerCase("ru-RU") === name.toLocaleLowerCase("ru-RU"));
  if (existing) {
    existing.quantity += quantity;
    existing.price = price;
    addHistory("Поступление", existing.name, quantity, "Добавлено к существующему остатку");
  } else {
    const product = { id: nextId++, name, category, quantity, price };
    products.push(product);
    addHistory("Поступление", product.name, quantity, "Новая позиция на складе");
  }
  saveData();
  renderAll();
  form.reset();
  showMessage("Поступление принято, остаток обновлён.");
});

document.getElementById("clearForm").addEventListener("click", () => form.reset());
searchInput.addEventListener("input", renderProducts);

document.getElementById("productRows").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (button.dataset.action === "receive") {
    const raw = prompt(`Сколько единиц товара «${product.name}» поступило?`);
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isInteger(amount) || amount <= 0) {
      showMessage("Введите целое количество больше нуля.");
      return;
    }
    product.quantity += amount;
    addHistory("Поступление", product.name, amount, "Дополнительная поставка");
    saveData(); renderAll(); showMessage("Остаток увеличен.");
  }

  if (button.dataset.action === "writeoff") {
    const raw = prompt(`Сколько единиц товара «${product.name}» списать?`);
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isInteger(amount) || amount <= 0) {
      showMessage("Введите целое количество больше нуля.");
      return;
    }
    if (amount > product.quantity) {
      showMessage(`Недостаточно товара. На складе: ${product.quantity}.`);
      return;
    }
    product.quantity -= amount;
    addHistory("Списание", product.name, amount, "Списание со склада");
    saveData(); renderAll(); showMessage("Списание выполнено.");
  }

  if (button.dataset.action === "delete") {
    if (!confirm(`Удалить позицию «${product.name}» из списка?`)) return;
    products = products.filter(item => item.id !== id);
    addHistory("Удаление позиции", product.name, product.quantity, "Позиция удалена из текущего списка");
    saveData(); renderAll(); showMessage("Позиция удалена.");
  }
});

renderAll();
