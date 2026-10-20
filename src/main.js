import { mountSavedPhotos } from './media.js';
import { characterArt } from './character-art.js';
import './fonts.js';
import { startExperience, motionAllowed } from './experience.js';
import { lily as flower, friends } from './illustrations.js';
import { giftConfig } from './gift-config.js';
import { setupMemoryGame } from './memory-game.js';
setupMemoryGame();
mountSavedPhotos();
const stem = (x,y,endX,endY) => `<path d="M${endX} ${endY} Q${x-30} ${y+85} ${x} ${y}" fill="none" stroke="#7b8c66" stroke-width="3"/><path d="M${(x+endX)/2} ${(y+endY)/2}q-42 -4 -39 -34q34 -4 39 34" fill="#859475"/><path d="M${(x+endX)/2+2} ${(y+endY)/2+23}q35 -2 38 -32q-33 -2 -38 32" fill="#a0ac87"/>`;
document.querySelector('#bouquet').innerHTML = `<svg viewBox="0 0 340 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".06"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><g filter="url(#paper)"><path d="M97 134L154 284L213 273L248 126L178 167Z" fill="#e1c7ac"/><path d="M97 134L170 187L154 284L121 219Z" fill="#ead6bb"/><path d="M248 126L170 187L213 273L228 202Z" fill="#f3e2c7"/>${[[113,95],[220,92],[167,67],[148,127],[208,139],[88,148],[249,131]].map(([x,y])=>stem(x,y,180,254)).join('')}<g fill="#889671"><ellipse cx="100" cy="66" rx="8" ry="23" transform="rotate(-35 100 66)"/><ellipse cx="232" cy="65" rx="7" ry="24" transform="rotate(30 232 65)"/><ellipse cx="260" cy="101" rx="7" ry="20" transform="rotate(45 260 101)"/></g>${flower(113,95,.73,'#cb8b91',-20)}${flower(220,92,.8,'#ead0bd',20)}${flower(167,67,.85,'#dba5a6')}${flower(148,127,.86,'#e7bab2',14)}${flower(208,139,.8,'#ba7884',20)}${flower(88,148,.5,'#e9d6c4')}${flower(249,131,.45,'#d5a1a0')}<g fill="#f9f4de">${[[68,100],[80,85],[255,58],[264,72],[276,126],[69,129],[115,47]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g><path d="M149 232Q180 246 213 228L210 237Q182 255 152 241Z" fill="#b78184"/><path d="M181 241Q122 204 140 236Q148 253 181 241Q226 209 217 238Q208 254 181 241" fill="none" stroke="#a66d76" stroke-width="5"/><path d="M180 241Q166 266 165 282M182 241Q193 258 207 272" fill="none" stroke="#b78184" stroke-width="7"/></g></svg>`;
const dialog=document.querySelector('#letterDialog');
document.querySelector('#openLetter').addEventListener('click',()=>dialog.showModal());
document.querySelector('#closeLetter').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
let toastTimer;
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500);}
const input=document.querySelector('#photoInput');let photoTarget=null;const photoUrls=new Map();
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{photoTarget=button;input.value='';input.click();}));
input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file||!photoTarget)return;if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)){toast('Em chọn ảnh JPG, PNG, WebP hoặc GIF nhé.');return;}if(file.size>15*1024*1024){toast('Em chọn ảnh nhỏ hơn 15 MB nhé.');return;}const target=photoTarget;const url=URL.createObjectURL(file);const img=new Image();img.alt='Ảnh kỷ niệm của chúng mình';try{img.src=url;await img.decode();const old=photoUrls.get(target);if(old)URL.revokeObjectURL(old);photoUrls.set(target,url);target.replaceChildren(img);target.setAttribute('aria-label','Thay ảnh kỷ niệm');toast('Đã thêm ảnh.');}catch{URL.revokeObjectURL(url);toast('Chưa đọc được ảnh này. Em thử ảnh khác nhé.');}});
let audioContext=null,musicTimer=null,musicOn=false,noteIndex=0;const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,329.63,392,440,349.23,329.63,293.66,261.63];
function playNote(){if(!audioContext||!musicOn)return;const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=notes[noteIndex++%notes.length];gain.gain.setValueAtTime(0,audioContext.currentTime);gain.gain.linearRampToValueAtTime(.075,audioContext.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+1.7);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+1.8);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};}
const musicButton=document.querySelector('#musicToggle');musicButton.addEventListener('click',async()=>{try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(musicOn){musicOn=false;clearInterval(musicTimer);await audioContext.suspend();}else{await audioContext.resume();musicOn=true;playNote();musicTimer=setInterval(playNote,650);}musicButton.setAttribute('aria-pressed',String(musicOn));musicButton.querySelector('.sound-label').textContent=musicOn?'Tắt nhạc nền':'Nhạc nền nhẹ';}catch{toast('Trình duyệt chưa hỗ trợ phát nhạc. Em thử lại nhé.');}});

// A single heart click reveals the gift without an intermediate screen.
const cover=document.querySelector('#coverPage');
const world=document.querySelector('#giftWorld');
const reduceMotion=()=>!motionAllowed();
document.querySelector('#secretEntry').addEventListener('click',()=>{
 cover.hidden=true;
 world.hidden=false;
 document.body.classList.remove('gate-active');
 document.title='Chúc Mỹ Tú 20/10 vui vẻ';
 window.scrollTo({top:0,left:0,behavior:'instant'});
 const heading=document.querySelector('#heroTitle');
 heading.tabIndex=-1;
 heading.focus({preventScroll:true});
 startExperience();
});
const friendMessages={
 miffy:'20/10 vui vẻ nha, Mỹ Tú!',
 bibble:'Hôm nay ăn ngon, cười nhiều nhé!',
 snoopy:'Chúc Tú một ngày thật chill.',
 bechichi:'Chúc Tú luôn khỏe, ngủ đủ giấc.',
 hirono:'Thi tốt, đạt điểm như ý nha!',
};
Object.keys(friends).forEach(name=>document.querySelector(`#${name}Art`).innerHTML=characterArt(name));
document.querySelectorAll('[data-friend]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-friend]').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
 button.classList.add('selected');button.setAttribute('aria-pressed','true');
 document.querySelector('#friendMessage').textContent=friendMessages[button.dataset.friend];
}));
const moods={'MCK':'Một bài MCK cho đúng gu em.','Wren Evans':'Bật lên cho ngày thêm vui.','Mr. Siro':'Đổi sang Mr. Siro nghe một chút.'};
document.querySelectorAll('[data-artist]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-artist]').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
 button.classList.add('selected');button.setAttribute('aria-pressed','true');
 const artist=button.dataset.artist;document.querySelector('#musicMood').textContent=moods[artist];
 const track={'MCK':'Tại Vì Sao','Wren Evans':'Thích Em Hơi Nhiều'}[artist];
 document.querySelector('#trackSuggestion').textContent=track?`Gợi ý cho em: ${track}`:'Một góc nhạc dành cho những lúc muốn lắng lại.';
 const link=document.querySelector('#artistLink');link.href=`https://open.spotify.com/search/${encodeURIComponent(track?`${track} ${artist}`:artist)}`;link.textContent=track?'Tìm bài hát trên Spotify →':`Tìm ${artist} trên Spotify →`;
}));
// Finite burst with bounded particles and a reduced-motion alternative.
let bloomCleanup;
function bloomStorm(){
 if(reduceMotion())return;
 clearTimeout(bloomCleanup);
 const container=document.querySelector('#confetti');container.replaceChildren();container.classList.add('bloom-finale');
 const colors=['#f6d7e0','#fff4df','#e9b4c8','#e4cfea'];
 for(let i=0;i<(innerWidth<760?64:100);i++){
  const el=document.createElement('span');el.className='lily-particle';
  el.innerHTML=`<svg viewBox="0 0 120 120">${flower(60,60,.9,colors[i%colors.length],i*31)}</svg>`;
  el.style.setProperty('--x',`${(Math.random()-.5)*220}vw`);el.style.setProperty('--y',`${(Math.random()-.6)*180}vh`);
  el.style.setProperty('--spin',`${Math.random()*600-300}deg`);el.style.setProperty('--size',`${34+Math.random()*70}px`);
  el.style.animationDelay=`${Math.random()*.65}s`;container.append(el);
 }
 bloomCleanup=setTimeout(()=>{container.replaceChildren();container.classList.remove('bloom-finale');},4300);
}
let revealing=false;
document.querySelector('#surpriseButton').addEventListener('click',()=>{
 if(revealing)return;revealing=true;
 const button=document.querySelector('#surpriseButton');button.disabled=true;button.setAttribute('aria-expanded','true');
 document.querySelector('#revealStatus').textContent='Hoa lên trước, quà theo sau…';
 bloomStorm();
 setTimeout(()=>{
  button.hidden=true;const gift=document.querySelector('#giftReveal');gift.hidden=false;
  document.querySelector('#revealStatus').textContent='Chạm vào nắp để mở hộp.';
  gift.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'center'});
  document.querySelector('#openCake').focus({preventScroll:true});
 },reduceMotion()?0:1800);
});
const pickup=giftConfig.pickup;
document.querySelector('#pickupTime').textContent=pickup.dateLabel;
document.querySelector('#pickupLocation').textContent=pickup.location;
document.querySelector('#pickupInstruction').textContent=pickup.instruction;
document.querySelector('#pickupStatus').textContent=pickup.message;
document.querySelector('#openCake').addEventListener('click',()=>{
 const button=document.querySelector('#openCake');if(button.classList.contains('opened'))return;
 button.classList.add('opened');button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Hộp bánh đã mở');
 button.querySelector('.box-prompt').textContent='Bánh của em đây.';
 const details=document.querySelector('#pickupReveal');details.hidden=false;
 setTimeout(()=>details.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'start'}),reduceMotion()?0:650);
});
document.querySelector('#copyPickup').addEventListener('click',async()=>{
 const text=`Gửi ${giftConfig.recipient} ♡\n${pickup.dateLabel}\n${pickup.location}\n${pickup.instruction}\n${document.querySelector('#pickupStatus').textContent}`;
 try{await navigator.clipboard.writeText(text);toast('Đã sao chép chỉ dẫn nhận bánh ♡');}catch{toast('Em có thể chọn và sao chép chỉ dẫn trên tấm vé nhé.');}
});
document.querySelector('#replayFlowers').addEventListener('click',()=>{bloomStorm();if(reduceMotion())toast('Chúc Mỹ Tú 20/10 vui vẻ!');});
