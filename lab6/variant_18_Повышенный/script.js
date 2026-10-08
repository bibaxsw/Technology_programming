
const list=document.querySelector('#files');
document.querySelector('#addFolder').onclick=()=>add('📁 Новая папка');
document.querySelector('#addFile').onclick=()=>add('📄 Новый файл');
function add(name){const li=document.createElement('li');li.textContent=name;li.onclick=()=>{document.querySelector('.selected')?.classList.remove('selected');li.classList.add('selected')};li.ondblclick=()=>{const n=prompt('Новое имя:',li.firstChild.textContent);if(n)li.firstChild.textContent=n};list.append(li)}
document.querySelector('#delete').onclick=()=>document.querySelector('.selected')?.remove();
