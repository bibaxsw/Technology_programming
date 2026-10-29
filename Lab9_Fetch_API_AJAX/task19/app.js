
const API = 'https://jsonplaceholder.typicode.com';
const $ = (s) => document.querySelector(s);
const controls = $('#controls'), results = $('#results'), statusBox = $('#status'), stats = $('#stats'), pager = $('#pager');
function setStatus(message, type='') { statusBox.textContent = message; statusBox.className = `status ${type}`.trim(); }
function button(label, fn, cls='btn') { const b=document.createElement('button'); b.textContent=label; b.className=cls; b.addEventListener('click',fn); return b; }
function input(placeholder, type='text', value='') { const el=document.createElement('input'); el.placeholder=placeholder; el.type=type; el.value=value; return el; }
function select(options) { const el=document.createElement('select'); options.forEach(([label,value])=>{const o=document.createElement('option');o.textContent=label;o.value=value;el.append(o)}); return el; }
function clear(node) { node.replaceChildren(); }
function empty(message='Ничего не найдено.') { clear(results); const e=document.createElement('div');e.className='empty';e.textContent=message;results.append(e); }
function card(title, lines=[], tag='', cls='') { const el=document.createElement('article');el.className=`item ${cls}`.trim(); if(tag){const t=document.createElement('span');t.className='tag';t.textContent=tag;el.append(t)} const h=document.createElement('h3');h.textContent=title;el.append(h);lines.forEach(line=>{const p=document.createElement('p');p.textContent=line;el.append(p)});return el; }
async function getJSON(path, options={}) { const response=await fetch(`${API}${path}`,options); if(!response.ok) throw new Error(`HTTP ${response.status} — сервер не вернул успешный ответ`); return response.json(); }
async function runLoad(fn, message='Загружаем данные…') { setStatus(message,'loading'); try { await fn(); } catch(err) { if(err.name==='AbortError') {setStatus('Предыдущий запрос отменён.','');return;} setStatus(`Не удалось загрузить данные: ${err.message}`,'error'); if(!results.children.length) empty('Проверьте подключение к интернету и попробуйте снова.'); } }
function retryButton(fn) { controls.append(button('↻ Повторить',fn,'btn-quiet')); }
function stat(label,value) { const e=document.createElement('div');e.className='stat';const s=document.createElement('span');s.textContent=label;const v=document.createElement('strong');v.textContent=value;e.append(s,v);stats.append(e); }
function textSafe(value, fallback='—') { return value===undefined||value===null||value===''?fallback:String(value); }

const q=input('Начните вводить заголовок публикации…');controls.append(q,button('Очистить',()=>{q.value='';clear(results);setStatus('Поиск очищен.','');},'btn-soft'));let timer=null,controller=null;let requestNo=0;q.addEventListener('input',()=>{clearTimeout(timer);if(controller)controller.abort();timer=setTimeout(()=>search(q.value.trim()),350);});retryButton(()=>search(q.value.trim()));
async function search(term){const thisRequest=++requestNo;if(!term){empty('Введите часть заголовка для поиска.');setStatus('Ожидаем поисковый запрос.','');return;}controller=new AbortController();const current=controller;setStatus('Ищем публикации…','loading');try{const data=await getJSON(`/posts?title_like=${encodeURIComponent(term)}`,{signal:current.signal});if(thisRequest!==requestNo)return;clear(results);data.forEach(p=>results.append(card(p.title,[p.body,`ID: ${p.id}`],`POST #${p.id}`)));if(!data.length)empty('Совпадений нет. Попробуйте другое слово.');setStatus(`Результатов: ${data.length}. Задержка ввода: 350 мс.`,'success');}catch(err){if(err.name==='AbortError')return;setStatus(`Ошибка поиска: ${err.message}`,'error');}}
