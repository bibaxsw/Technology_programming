
const player = document.querySelector('#player');
let x=50, y=50;
document.addEventListener('keydown', e => {
  const step=5;
  if (e.key==='ArrowUp') y-=step;
  if (e.key==='ArrowDown') y+=step;
  if (e.key==='ArrowLeft') x-=step;
  if (e.key==='ArrowRight') x+=step;
  x=Math.max(0,Math.min(92,x)); y=Math.max(0,Math.min(88,y));
  player.style.left=x+'%'; player.style.top=y+'%';
});
