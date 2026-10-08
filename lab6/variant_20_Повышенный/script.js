
const game=document.querySelector('#game'), target=document.querySelector('#target'), scoreEl=document.querySelector('#score'), max=10;
let score=0;
target.onclick=()=>{score++;scoreEl.textContent=score;if(score>=max){target.remove();document.querySelector('#msg').textContent='Игра окончена!'}else move()};
function move(){target.style.left=Math.random()*90+'%';target.style.top=Math.random()*80+'%'}
move();
