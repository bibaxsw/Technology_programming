// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_10";
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

let data=safeLoad(KEY,[]);heading("Новая запись");const date=field("Дата","date"),text=field("Текст записи","textarea","Что произошло сегодня?");date.input.value=new Date().toISOString().slice(0,10);const area=list();root.append(row(date.label,text.label,btn("Сохранить запись",()=>{if(!text.input.value.trim())return alert("Напишите текст записи.");data.unshift({id:Date.now(),date:date.input.value,text:text.input.value.trim()});save(data);text.input.value="";render();})),area);function render(){area.replaceChildren();data.forEach(x=>item(area,`${x.date} — ${x.text}`,()=>{data=data.filter(y=>y.id!==x.id);save(data);render();}));if(!data.length)area.append(el("p",{className:"notice"},"Записей пока нет."));}render();
