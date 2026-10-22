// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_03";
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

heading("Внешний вид");const data=safeLoad(KEY,{theme:"light",size:"16"});const theme=el("select");[["light","Светлая"],["dark","Тёмная"]].forEach(([v,t])=>theme.append(el("option",{value:v},t)));theme.value=data.theme;const size=el("select");[["14","Маленький"],["16","Обычный"],["20","Крупный"]].forEach(([v,t])=>size.append(el("option",{value:v},t)));size.value=data.size;const preview=el("div",{className:"notice"},"Пример текста для просмотра выбранной темы.");function apply(){const dark=theme.value==="dark";document.documentElement.style.background=dark?"#202124":"#f3f4f6";document.body.style.color=dark?"#f5f5f5":"#222";document.querySelector(".panel").style.background=dark?"#303134":"#fff";preview.style.fontSize=size.value+"px";preview.style.color=dark?"#fff":"#222";save({theme:theme.value,size:size.value});}root.append(row(el("label",{}, "Тема"),theme),row(el("label",{},"Размер текста"),size),preview);theme.addEventListener("change",apply);size.addEventListener("change",apply);apply();
