
const cells=document.querySelectorAll('#grades td[contenteditable]');
const avg=document.querySelector('#avg');
function calc(){let a=[...cells].map(c=>+c.textContent).filter(n=>!isNaN(n)); avg.textContent=a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2):'0';}
cells.forEach(c=>c.addEventListener('input',calc)); calc();
