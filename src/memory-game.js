import { friends, friendNames as names } from './illustrations.js';

const characters=Object.keys(names);
const totalPairs=characters.length;
export function setupMemoryGame(){
  const board=document.querySelector('#memoryGame');
  const status=document.querySelector('#gameStatus');
  document.querySelector('#totalPairs').textContent=totalPairs;
  let first=null,locked=false,matches=0,moves=0,resetTimer;
  function announce(message){status.textContent=message;}
  function show(card){
    card.classList.add('flipped');
    card.setAttribute('aria-label',names[card.dataset.character]);
    card.setAttribute('aria-pressed','true');
  }
  function hide(card){
    card.classList.remove('flipped');
    card.setAttribute('aria-label',`Lật thẻ ${Number(card.dataset.position)+1}`);
    card.setAttribute('aria-pressed','false');
  }
  function choose(card){
    if(locked||card===first||card.classList.contains('matched'))return;
    show(card);
    if(!first){first=card;announce('Chọn thêm một thẻ nữa.');return;}
    moves++;document.querySelector('#moveCount').textContent=moves;
    const previous=first;first=null;
    if(previous.dataset.character===card.dataset.character){
      matches++;
      [previous,card].forEach(el=>{el.classList.add('matched');el.setAttribute('aria-disabled','true');el.setAttribute('aria-label',`${names[el.dataset.character]} — đã ghép`);});
      document.querySelector('#matchCount').textContent=matches;
      const rect=card.getBoundingClientRect();
      window.dispatchEvent(new CustomEvent('gift:burst',{detail:{x:rect.left+rect.width/2,y:rect.top+rect.height/2,amount:matches===totalPairs?48:20}}));
      announce(matches===totalPairs?`Đủ ${totalPairs} cặp trong ${moves} lượt! 20/10 vui vẻ, Mỹ Tú.`:`Tìm được ${names[card.dataset.character]} rồi! Còn ${totalPairs-matches} cặp.`);
      board.classList.toggle('completed',matches===totalPairs);
    }else{
      locked=true;announce('Chưa trùng rồi. Nhớ vị trí hai bạn này nhé.');
      resetTimer=setTimeout(()=>{hide(previous);hide(card);locked=false;announce('Thử hai thẻ khác nhé.');},850);
    }
  }
  function reset(){
    clearTimeout(resetTimer);first=null;locked=false;matches=moves=0;
    document.querySelector('#matchCount').textContent='0';document.querySelector('#moveCount').textContent='0';
    board.classList.remove('completed');board.replaceChildren();
    const deck=[...characters,...characters];
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
    deck.forEach((character,index)=>{
      const card=document.createElement('button');card.className='memory-card';card.type='button';card.dataset.character=character;card.dataset.position=index;
      card.setAttribute('aria-label',`Lật thẻ ${index+1}`);card.setAttribute('aria-pressed','false');
      card.innerHTML=`<span class="memory-card-inner" aria-hidden="true"><span class="memory-card-back"><span class="card-corner">20</span><span class="card-spark">✧</span><span class="card-back-caption">FLIP ME</span><span class="card-corner corner-bottom">10</span></span><span class="memory-card-face">${friends[character]}<span>${names[character]}</span><span class="match-check">✓</span></span></span>`;
      card.addEventListener('click',()=>choose(card));board.append(card);
    });
    announce('Em mở một thẻ trước nhé.');
  }
  document.querySelector('#resetGame').addEventListener('click',reset);
  reset();
}
