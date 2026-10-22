// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_15";
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

let data=safeLoad(KEY,[]);heading("Добавить фильм");const title=field("Название","text","Название фильма"),genre=field("Жанр","text","Комедия"),rating=field("Рейтинг 0–10","number","8");const filter=field("Фильтр по жанру","text","Все жанры"),area=list();function render(){area.replaceChildren();const f=filter.input.value.trim().toLowerCase();const shown=data.filter(x=>!f||x.genre.toLowerCase().includes(f));shown.forEach(x=>item(area,`${x.title} · ${x.genre} · ${x.rating}/10`,()=>{data=data.filter(y=>y.id!==x.id);save(data);render();}));if(!shown.length)area.append(el("p",{className:"notice"},"Фильмы не найдены."));}filter.input.addEventListener("input",render);root.append(row(title.label,genre.label,rating.label,btn("Добавить",()=>{const n=Number(rating.input.value);if(!title.input.value.trim()||!genre.input.value.trim()||rating.input.value===""||n<0||n>10)return alert("Заполните поля; рейтинг от 0 до 10.");data.push({id:Date.now(),title:title.input.value.trim(),genre:genre.input.value.trim(),rating:n});save(data);render();})),filter.label,area);render();
