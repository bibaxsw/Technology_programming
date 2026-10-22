// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_20";
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

let data=safeLoad(KEY,[]);heading("Создать проект");const name=field("Название проекта","text","Учебный проект"),task=field("Задача","text","Что сделать?"),deadline=field("Срок","date");const search=field("Поиск проектов и задач","text","Введите запрос"),area=list();function render(){area.replaceChildren();const q=search.input.value.toLowerCase();data.filter(p=>p.name.toLowerCase().includes(q)||p.tasks.some(t=>t.title.toLowerCase().includes(q))).forEach(p=>{const box=el("div",{className:"item"});const left=el("div");left.append(el("strong",{},p.name));p.tasks.filter(t=>!q||t.title.toLowerCase().includes(q)||p.name.toLowerCase().includes(q)).forEach(t=>{const line=el("p",{},`${t.title} · ${t.status} · срок: ${t.deadline||"не указан"}`);const sel=el("select");["План","В работе","Готово"].forEach(s=>sel.append(el("option",{value:s},s)));sel.value=t.status;sel.addEventListener("change",()=>{t.status=sel.value;save(data);render();});line.append(" ",sel, " ",btn("Удалить задачу",()=>{p.tasks=p.tasks.filter(z=>z.id!==t.id);save(data);render();},"secondary"));left.append(line);});box.append(left,btn("Удалить проект",()=>{data=data.filter(x=>x.id!==p.id);save(data);render();},"danger"));area.append(box);});if(!area.children.length)area.append(el("p",{className:"notice"},"Ничего не найдено."));}root.append(row(name.label,btn("Создать проект",()=>{const v=name.input.value.trim();if(!v)return alert("Введите название проекта.");if(data.some(p=>p.name.toLowerCase()===v.toLowerCase()))return alert("Проект с таким названием уже существует.");data.push({id:Date.now(),name:v,tasks:[]});save(data);name.input.value="";render();})),row(task.label,deadline.label,btn("Добавить задачу в последний проект",()=>{const v=task.input.value.trim();if(!data.length)return alert("Сначала создайте проект.");if(!v)return alert("Введите задачу.");data[data.length-1].tasks.push({id:String(Date.now()),title:v,status:"План",deadline:deadline.input.value});save(data);task.input.value="";render();})),search.label,area);search.input.addEventListener("input",render);render();
