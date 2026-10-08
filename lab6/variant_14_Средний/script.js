
const display=document.querySelector('#display');
const keys=['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];
keys.forEach(key=>{
  const b=document.createElement('button'); b.textContent=key; document.querySelector('#keys').append(b);
  b.addEventListener('click',()=>{
    if(key==='C') display.value='';
    else if(key==='='){try{display.value=Function('return '+display.value)()}catch{display.value='Ошибка'}}
    else display.value+=key;
  });
});
