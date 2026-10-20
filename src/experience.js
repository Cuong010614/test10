import { createAtmosphere } from './atmosphere.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let enabled=!reduced.matches,started=false,scene=null;
export const motionAllowed=()=>enabled&&!reduced.matches;

export function startExperience(){
 if(started)return;started=true;
 const world=document.querySelector('#giftWorld');
 const motionButton=document.querySelector('#motionToggle');
 const atmosphere=createAtmosphere(world,motionAllowed);
 function syncMotion(){
  const on=motionAllowed();world.classList.toggle('motion-paused',!on);
  motionButton.setAttribute('aria-pressed',String(on));motionButton.textContent=on?'✦ Hiệu ứng: bật':'✦ Hiệu ứng: tắt';
  scene?.sync();atmosphere.sync();
  document.querySelectorAll('.reveal-item').forEach(el=>{if(!on)el.classList.add('in-view');});
 }
 motionButton.addEventListener('click',()=>{enabled=!enabled;syncMotion();});
 reduced.addEventListener('change',()=>{enabled=!reduced.matches;syncMotion();});
 const canvasHost=document.querySelector('#bouquet3d');
 const ready=()=>{canvasHost.dataset.state='ready';document.querySelector('.hero-art').classList.add('has-3d');document.querySelector('#sceneControls').hidden=false;document.querySelector('#sceneHint').textContent='Di chuột để ngắm hoa · Chạm nút để xoay';};
 const fallback=()=>{canvasHost.dataset.state='fallback';document.querySelector('.hero-art').classList.remove('has-3d');document.querySelector('#sceneControls').hidden=true;document.querySelector('#sceneHint').textContent='Một bó hoa ly dành riêng cho em';};
 import('./bouquet-3d.js').then(({mountBouquet})=>{scene=mountBouquet(canvasHost,{motionAllowed,onReady:ready,onFallback:fallback});}).catch(fallback);
 document.querySelector('#rotateBouquet').addEventListener('click',()=>scene?.rotate());
 document.querySelector('#resetBouquet').addEventListener('click',()=>scene?.reset());
 const reveal=new IntersectionObserver(entries=>{entries.forEach(({isIntersecting,target})=>{if(isIntersecting){target.classList.add('in-view');reveal.unobserve(target);}});},{threshold:.08});
 document.querySelectorAll('#giftWorld .section-intro,#giftWorld .center-heading,#giftWorld .memories-heading,#giftWorld .polaroid,#giftWorld .friend-card,#giftWorld .record-player,#giftWorld .game-intro,#giftWorld .memory-game').forEach((el,i)=>{el.classList.add('reveal-item');el.style.setProperty('--reveal-delay',`${i%4*65}ms`);reveal.observe(el);});
 // Fine-pointer tilt only; the touch page remains freely scrollable.
 if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.polaroid,.friend-card,.record-player').forEach(el=>{
   el.addEventListener('pointermove',event=>{if(!motionAllowed())return;const rect=el.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;el.style.setProperty('--tilt-x',`${-y*10}deg`);el.style.setProperty('--tilt-y',`${x*12}deg`);el.style.setProperty('--shine-x',`${(x+.5)*100}%`);el.style.setProperty('--shine-y',`${(y+.5)*100}%`);el.classList.add('tilting');});
   el.addEventListener('pointerleave',()=>{el.classList.remove('tilting');el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
  });
 }
 const progress=document.querySelector('#readingProgress');
 let scrollFrame=0;
 function updateScroll(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();
 syncMotion();
 // Purely visual opening; no text or extra confirmation step.
 if(motionAllowed()){world.classList.add('cinematic-entry');setTimeout(()=>world.classList.remove('cinematic-entry'),1100);}
 const bloomButtons=document.querySelectorAll('[data-friend]');
 bloomButtons.forEach(button=>button.addEventListener('click',()=>{
  if(!motionAllowed())return;
  button.classList.remove('card-pop');void button.offsetWidth;button.classList.add('card-pop');
  setTimeout(()=>button.classList.remove('card-pop'),700);
 }));
}
