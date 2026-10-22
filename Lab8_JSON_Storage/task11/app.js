// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_11";
const safeLoad = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn("Повреждённые данные хранилища:", error);
    return fallback;
  }
};
const save = (value, key = KEY) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (error) { alert("Не удалось сохранить данные в браузере."); console.error(error); }
};
const escText = (value) => String(value ?? "");
const make = (tag, props = {}, text = "") => {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") el.className = value;
    else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value);
  });
  if (text !== "") el.textContent = text;
  return el;
};
const el = (tag, props = {}, text = "") => make(tag, props, text);
const heading = (text) => root.append(el("h2", {}, text));
const form = () => el("form");
const field = (labelText, type = "text", placeholder = "") => {
  const label = el("label", {}, labelText);
  const input = el(type === "textarea" ? "textarea" : "input", type === "textarea" ? {placeholder} : {type, placeholder});
  label.append(input);
  return {label, input};
};
const btn = (text, fn, cls = "") => el("button", {type:"button", className:cls, onclick:fn}, text);
const row = (...children) => { const r=el("div",{className:"row"}); children.forEach(c=>r.append(c)); return r; };
const list = () => { const l=el("div",{className:"stack"}); root.append(l); return l; };
const item = (parent, text, action, actionText="Удалить") => {
  const box=el("div",{className:"item"});
  box.append(el("span",{},text), el("span",{className:"actions"}));
  box.lastChild.append(btn(actionText,action,actionText==="Удалить"?"danger":"secondary"));
  parent.append(box);
};
const money = n => new Intl.NumberFormat("ru-RU",{style:"currency",currency:"KZT",maximumFractionDigits:2}).format(Number(n)||0);

let data=safeLoad(KEY,[]);heading("Добавить товар в корзину");const name=field("Товар","text","Название"),price=field("Цена (₸)","number","0"),qty=field("Количество","number","1");const total=el("h2"),area=list();function render(){area.replaceChildren();total.textContent="Итого: "+money(data.reduce((s,x)=>s+x.price*x.qty,0));data.forEach(x=>item(area,`${x.name} · ${money(x.price)} × ${x.qty} = ${money(x.price*x.qty)}`,()=>{data=data.filter(y=>y.id!==x.id);save(data);render();}));}root.append(row(name.label,price.label,qty.label,btn("Добавить",()=>{if(!name.input.value.trim()||Number(price.input.value)<0||Number(qty.input.value)<1||!price.input.value||!qty.input.value)return alert("Проверьте товар, цену и количество.");data.push({id:Date.now(),name:name.input.value.trim(),price:Number(price.input.value),qty:Math.floor(Number(qty.input.value))});save(data);render();})),total,area);render();
