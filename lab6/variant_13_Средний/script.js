
const input=document.querySelector('#tag'), list=document.querySelector('#tags');
input.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return;
  const text=input.value.trim(); if(!text) return;
  const li=document.createElement('li'); li.textContent=text;
  const x=document.createElement('button'); x.textContent='×'; x.onclick=()=>li.remove();
  li.append(x); list.append(li); input.value='';
});
