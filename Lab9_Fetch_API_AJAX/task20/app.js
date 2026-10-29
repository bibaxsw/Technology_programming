
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

let page=1;const limit=12;const album=select([['Все альбомы','all'],...Array.from({length:20},(_,i)=>[`Альбом ${i+1}`,String(i+1)])]);const label=document.createElement('span');label.className='page-label';pager.append(button('← Назад',()=>{if(page>1){page--;load()}},'btn-soft'),label,button('Далее →',()=>{page++;load()},'btn'));controls.append(album,button('Загрузить фотографии',()=>{page=1;load()}));album.addEventListener('change',()=>{page=1;load()});retryButton(load);
async function load(){await runLoad(async()=>{clear(results);const path=album.value==='all'?`/photos?_page=${page}&_limit=${limit}`:`/photos?albumId=${album.value}&_page=${page}&_limit=${limit}`;const data=await getJSON(path);if(!data.length){empty('На этой странице фотографий больше нет.');page=Math.max(1,page-1);label.textContent=`Страница ${page}`;return;}for(const p of data){const el=card(p.title,[`Фото ID: ${p.id}`,`Альбом: ${p.albumId}`],`PHOTO #${p.id}`);const img=document.createElement('img');img.src=p.thumbnailUrl;img.alt=p.title;img.loading='lazy';img.addEventListener('error',()=>{const msg=document.createElement('p');msg.textContent='Изображение недоступно';img.replaceWith(msg)},{once:true});el.prepend(img);results.append(el);}label.textContent=`Страница ${page}`;pager.children[0].disabled=page===1;setStatus(`Загружено фотографий: ${data.length}`,'success');});}
load();
