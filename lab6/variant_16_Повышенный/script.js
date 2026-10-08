
const columns=document.querySelectorAll('.column ul');
document.querySelector('#add').onclick=()=>{
  const text=document.querySelector('#cardText').value.trim(); if(!text)return;
  const li=document.createElement('li'); li.textContent=text;
  const controls=document.createElement('div');
  ['←','→'].forEach((s,i)=>{const b=document.createElement('button');b.textContent=s;b.onclick=()=>{let c=[...columns].indexOf(li.parentElement);let n=c+(i?1:-1);if(n>=0&&n<columns.length)columns[n].append(li)};controls.append(b)});
  li.append(controls); columns[0].append(li); document.querySelector('#cardText').value='';
};
