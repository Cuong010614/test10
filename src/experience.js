const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let enabled=!reduced.matches,started=false,scene=null,ambientFrame=0;
export const motionAllowed=()=>enabled&&!reduced.matches;

export function startExperience(){
 if(started)return;started=true;
 const world=document.querySelector('#giftWorld');
 const motionButton=document.querySelector('#motionToggle');
 function syncMotion(){
  const on=motionAllowed();world.classList.toggle('motion-paused',!on);
  motionButton.setAttribute('aria-pressed',String(on));motionButton.textContent=on?'✦ Hiệu ứng: bật':'✦ Hiệu ứng: tắt';
  scene?.sync();if(on)startAmbient();else{cancelAnimationFrame(ambientFrame);ambientFrame=0;ambient.getContext('2d')?.clearRect(0,0,innerWidth,innerHeight);}
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
 document.querySelectorAll('#giftWorld .section-intro,#giftWorld .center-heading,#giftWorld .memories-heading,#giftWorld .polaroid,#giftWorld .friend-card,#giftWorld .record-player,#giftWorld .flower-tile').forEach((el,i)=>{el.classList.add('reveal-item');el.style.setProperty('--reveal-delay',`${i%4*65}ms`);reveal.observe(el);});
 // Fine-pointer tilt only; the touch page remains freely scrollable.
 if(matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.polaroid,.friend-card,.flower-tile,.record-player,.creator-board').forEach(el=>{
   el.addEventListener('pointermove',event=>{if(!motionAllowed())return;const rect=el.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;el.style.setProperty('--tilt-x',`${-y*10}deg`);el.style.setProperty('--tilt-y',`${x*12}deg`);el.style.setProperty('--shine-x',`${(x+.5)*100}%`);el.style.setProperty('--shine-y',`${(y+.5)*100}%`);el.classList.add('tilting');});
   el.addEventListener('pointerleave',()=>{el.classList.remove('tilting');el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
  });
 }
 const progress=document.querySelector('#readingProgress');
 let scrollFrame=0;
 function updateScroll(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();
 const ambient=document.querySelector('#ambientCanvas'),ctx=ambient.getContext('2d');
 let w=innerWidth,h=innerHeight,previous=0,time=0;
 const trail=[];let lastTrail=0;
 world.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!motionAllowed()||performance.now()-lastTrail<42)return;lastTrail=performance.now();trail.push({x:e.clientX,y:e.clientY,life:1});if(trail.length>25)trail.shift();},{passive:true});
 const particles=Array.from({length:innerWidth<760?20:38},()=>({x:Math.random(),y:Math.random(),size:1.5+Math.random()*4,speed:.000012+Math.random()*.00002,phase:Math.random()*6.28}));
 function resizeAmbient(){w=innerWidth;h=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.3);ambient.width=Math.floor(w*ratio);ambient.height=Math.floor(h*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);}
 function ambientTick(now){ambientFrame=0;if(!motionAllowed()||document.hidden||!ctx)return;if(now-previous>=40){const dt=Math.min(now-previous,80);previous=now;time+=dt;ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.y-=p.speed*dt;if(p.y<-.02)p.y=1.02;const x=p.x*w+Math.sin(time*.0003+p.phase)*25,y=p.y*h;ctx.globalAlpha=.18+Math.sin(time*.001+p.phase)*.12;ctx.fillStyle=p.size>2.5?'#e4acc3':'#c5b38c';ctx.beginPath();ctx.ellipse(x,y,p.size,p.size*.55,time*.0002+p.phase,0,Math.PI*2);ctx.fill();});for(let i=trail.length-1;i>=0;i--){const star=trail[i];star.life-=dt/750;if(star.life<=0){trail.splice(i,1);continue;}star.y-=dt*.015;ctx.globalAlpha=star.life*.5;ctx.strokeStyle='#d2a1bb';ctx.lineWidth=.8;const size=star.life*4;ctx.beginPath();ctx.moveTo(star.x-size,star.y);ctx.lineTo(star.x+size,star.y);ctx.moveTo(star.x,star.y-size);ctx.lineTo(star.x,star.y+size);ctx.stroke();}}ambientFrame=requestAnimationFrame(ambientTick);}
 function startAmbient(){if(!ambientFrame&&ctx&&motionAllowed()&&!document.hidden)ambientFrame=requestAnimationFrame(ambientTick);}
 resizeAmbient();addEventListener('resize',resizeAmbient,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(ambientFrame);ambientFrame=0;}else startAmbient();});
 syncMotion();
 // Purely visual opening; no text or extra confirmation step.
 if(motionAllowed()){world.classList.add('cinematic-entry');setTimeout(()=>world.classList.remove('cinematic-entry'),1100);}
 const bloomButtons=document.querySelectorAll('[data-flower],[data-friend]');
 bloomButtons.forEach(button=>button.addEventListener('click',()=>{
  if(!motionAllowed())return;
  button.classList.remove('card-pop');void button.offsetWidth;button.classList.add('card-pop');
  setTimeout(()=>button.classList.remove('card-pop'),700);
 }));
}
