// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_17";
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

const DRAFT=KEY+"_draft";let step=Number(sessionStorage.getItem(DRAFT+"_step")||1);let draft=safeLoad(DRAFT,{name:"",email:"",purpose:""});let submitted=safeLoad(KEY,[]);function render(){root.replaceChildren();heading(`Заявка · шаг ${step} из 3`);const f=form();if(step===1){const a=field("ФИО","text","Имя Фамилия");a.input.value=draft.name;f.append(a.label);f.append(btn("Далее",()=>{if(!a.input.value.trim())return alert("Введите ФИО.");draft.name=a.input.value.trim();next();}));}if(step===2){const a=field("Email (учебный)","email","student@example.com");a.input.value=draft.email;f.append(a.label,btn("Назад",()=>{draft.email=a.input.value;step=1;render();},"secondary"),btn("Далее",()=>{if(!a.input.value.includes("@"))return alert("Введите корректный email.");draft.email=a.input.value;next();}));}if(step===3){const a=field("Цель заявки","textarea","Опишите цель");a.input.value=draft.purpose;f.append(a.label,btn("Назад",()=>{draft.purpose=a.input.value;step=2;render();},"secondary"),btn("Отправить заявку",()=>{if(!a.input.value.trim())return alert("Заполните цель.");draft.purpose=a.input.value.trim();submitted.push({...draft,id:Date.now(),created:new Date().toLocaleString("ru-RU")});save(submitted);sessionStorage.removeItem(DRAFT);sessionStorage.removeItem(DRAFT+"_step");step=1;draft={name:"",email:"",purpose:""};render();}));}root.append(f);const area=list();submitted.forEach(x=>item(area,`${x.name} · ${x.email} · ${x.purpose}`,()=>{submitted=submitted.filter(y=>y.id!==x.id);save(submitted);render();}));}function next(){step=Math.min(3,step+1);sessionStorage.setItem(DRAFT,JSON.stringify(draft));sessionStorage.setItem(DRAFT+"_step",String(step));render();}render();
