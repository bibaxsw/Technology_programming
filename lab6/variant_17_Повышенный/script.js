
const questions=[
 {q:'Столица Казахстана?',a:['Алматы','Астана','Тараз'],c:1},
 {q:'Что выбирает элемент по id?',a:['#id','.id','id'],c:0},
 {q:'Какое событие отвечает за клик?',a:['click','hover','press'],c:0},
 {q:'Что создаёт createElement?',a:['CSS','DOM-элемент','JSON'],c:1},
 {q:'Как удалить элемент?',a:['remove()','delete()','erase()'],c:0}
];
let i=0,score=0; const box=document.querySelector('#quiz');
function render(){if(i===questions.length){box.innerHTML=`<h2>Результат: ${score}/${questions.length}</h2><button onclick="location.reload()">Пройти снова</button>`;return}
const q=questions[i]; box.innerHTML=`<h2>${q.q}</h2>`; q.a.forEach((a,n)=>{const b=document.createElement('button');b.textContent=a;b.onclick=()=>{if(n===q.c)score++;i++;render()};box.append(b)});}
render();
