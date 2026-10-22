// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_08";
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

let data=safeLoad(KEY,[]);heading("Добавить задачу");const a=field("Задача","text","Что нужно сделать?");const filter=el("select");[["all","Все задачи"],["active","Активные"],["done","Выполненные"]].forEach(([v,t])=>filter.append(el("option",{value:v},t)));const area=list();function render(){area.replaceChildren();const shown=data.filter(x=>filter.value==="all"||(filter.value==="active"&&!x.done)||(filter.value==="done"&&x.done));shown.forEach(x=>{const box=el("div",{className:"item"});const label=el("label");const cb=el("input",{type:"checkbox"});cb.checked=x.done;cb.addEventListener("change",()=>{x.done=cb.checked;save(data);render();});label.append(cb,document.createTextNode(" "+x.text));box.append(label,btn("Удалить",()=>{data=data.filter(y=>y.id!==x.id);save(data);render();},"danger"));area.append(box);});if(!shown.length)area.append(el("p",{className:"notice"},"Нет задач для отображения."));}root.append(row(a.label,btn("Добавить",()=>{const v=a.input.value.trim();if(!v)return alert("Введите задачу.");data.push({id:String(Date.now()),text:v,done:false});save(data);a.input.value="";render();})),row(el("label",{},"Фильтр"),filter));filter.addEventListener("change",render);render();
