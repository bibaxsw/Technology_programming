
const modal=document.querySelector('#modal');
document.querySelector('#open').onclick=()=>modal.classList.add('show');
document.querySelector('#close').onclick=()=>modal.classList.remove('show');
modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('show')});
document.addEventListener('keydown',e=>{if(e.key==='Escape') modal.classList.remove('show')});
