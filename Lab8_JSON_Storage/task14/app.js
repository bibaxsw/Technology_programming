// Лабораторная работа №8. Данные хранятся в Web Storage в формате JSON.
const root = document.querySelector("#app-content");
const KEY = "lab8_task_14";
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

const questions=[{q:"Какой метод преобразует объект в JSON-строку?",a:["JSON.parse()","JSON.stringify()","localStorage.getItem()"],correct:1},{q:"Какое хранилище сохраняет данные между перезапусками браузера?",a:["localStorage","sessionStorage","Переменная"],correct:0},{q:"Что возвращает getItem() для отсутствующего ключа?",a:["undefined","0","null"],correct:2},{q:"Как удалить данные по одному ключу?",a:["deleteItem()","removeItem()","drop()"],correct:1}];let index=Number(sessionStorage.getItem(KEY+"_index")||0),score=Number(sessionStorage.getItem(KEY+"_score")||0),best=Number(localStorage.getItem(KEY+"_best")||0);function render(){root.replaceChildren();if(index>=questions.length){heading("Результат");root.append(el("p",{className:"notice"},`Результат: ${score} из ${questions.length}. Лучший результат: ${best}.`),btn("Начать заново",()=>{index=0;score=0;persist();render();}));return;}const q=questions[index];heading(`Вопрос ${index+1} из ${questions.length}`);root.append(el("p",{},q.q));q.a.forEach((answer,i)=>root.append(btn(answer,()=>{if(i===q.correct)score++;index++;persist();render();},"secondary")));}function persist(){sessionStorage.setItem(KEY+"_index",String(index));sessionStorage.setItem(KEY+"_score",String(score));best=Math.max(best,score);localStorage.setItem(KEY+"_best",String(best));}render();
