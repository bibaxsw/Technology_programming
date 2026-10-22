// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_19";
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

let data=safeLoad(KEY,[]);heading("Операция бюджета");const type=el("select");[["income","Доход"],["expense","Расход"]].forEach(([v,t])=>type.append(el("option",{value:v},t)));const cat=field("Категория","text","Зарплата, еда..."),amount=field("Сумма (₸)","number","0"),date=field("Дата","date");date.input.value=new Date().toISOString().slice(0,10);const stats=el("div",{className:"grid"}),area=list();function render(){area.replaceChildren();const month=new Date().toISOString().slice(0,7);const current=data.filter(x=>x.date.startsWith(month));const inc=current.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),out=current.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);stats.replaceChildren();[[ "Доходы",inc],["Расходы",out],["Баланс",inc-out]].forEach(([t,n])=>{const d=el("div",{className:"stat"});d.append(el("small",{},t),el("strong",{},money(n)));stats.append(d);});data.forEach(x=>{const box=el("div",{className:"item"});box.append(el("span",{},`${x.date} · ${x.type==="income"?"Доход":"Расход"} · ${x.category} · ${money(x.amount)}`),btn("Редактировать",()=>{const v=prompt("Новая сумма:",String(x.amount));if(v===null)return;if(!(Number(v)>0))return alert("Сумма должна быть положительной.");x.amount=Number(v);save(data);render();},"secondary"),btn("Удалить",()=>{data=data.filter(y=>y.id!==x.id);save(data);render();},"danger"));area.append(box);});}root.append(row(el("label",{},"Тип операции"),type,cat.label,amount.label,date.label,btn("Добавить",()=>{if(!cat.input.value.trim()||!(Number(amount.input.value)>0)||!date.input.value)return alert("Заполните категорию, сумму и дату.");data.push({id:Date.now(),type:type.value,category:cat.input.value.trim(),amount:Number(amount.input.value),date:date.input.value});save(data);render();})),stats,area);render();
