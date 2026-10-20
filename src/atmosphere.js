// One viewport canvas supplies effects across every section, including touch bursts.
export function createAtmosphere(world,motionAllowed){
  const canvas=document.querySelector('#ambientCanvas');
  const ctx=canvas.getContext('2d');
  if(!ctx)return {sync(){}};
  let frame=0,w=innerWidth,h=innerHeight,previous=0,time=0,lastTrail=0;
  const trail=[],bursts=[];
  const palette=['#d793b4','#bd9fd6','#c49a63','#e7a2b3'];
  const particles=Array.from({length:innerWidth<760?36:65},(_,i)=>({x:Math.random(),y:Math.random(),size:3+Math.random()*8,speed:.000013+Math.random()*.000022,phase:Math.random()*Math.PI*2,star:i%4===0,color:palette[i%palette.length]}));
  function resize(){
    w=innerWidth;h=innerHeight;
    const ratio=Math.min(devicePixelRatio||1,1.3);
    canvas.width=Math.floor(w*ratio);canvas.height=Math.floor(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  function sparkle(x,y,size,rotation=0){
    ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.beginPath();
    ctx.moveTo(0,-size);ctx.quadraticCurveTo(size*.15,-size*.15,size,0);ctx.quadraticCurveTo(size*.15,size*.15,0,size);ctx.quadraticCurveTo(-size*.15,size*.15,-size,0);ctx.quadraticCurveTo(-size*.15,-size*.15,0,-size);ctx.fill();ctx.restore();
  }
  function petal(x,y,size,angle){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(-size,0);ctx.bezierCurveTo(-size*.3,-size*.8,size*.6,-size*.5,size,0);ctx.bezierCurveTo(size*.2,size*.8,-size*.6,size*.5,-size,0);ctx.fill();ctx.restore();
  }
  function burst({x=w/2,y=h/2,amount=16}={}){
    if(!motionAllowed())return;
    for(let i=0;i<Math.min(amount,50);i++){
      const angle=Math.random()*Math.PI*2,speed=1.3+Math.random()*3.2;
      bursts.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1,size:3+Math.random()*5,color:palette[i%palette.length]});
    }
    if(bursts.length>100)bursts.splice(0,bursts.length-100);
  }
  world.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!motionAllowed()||performance.now()-lastTrail<35)return;
    lastTrail=performance.now();trail.push({x:event.clientX,y:event.clientY,life:1});if(trail.length>30)trail.shift();
  },{passive:true});
  world.addEventListener('pointerdown',event=>{
    if(event.target.closest('#motionToggle'))return;
    burst({x:event.clientX,y:event.clientY,amount:innerWidth<760?10:16});
  },{passive:true});
  window.addEventListener('gift:burst',event=>burst(event.detail));
  function tick(now){
    frame=0;if(!motionAllowed()||document.hidden)return;
    if(now-previous>=40){
      const dt=Math.min(now-previous,80),step=dt/40;previous=now;time+=dt;
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y+=p.speed*dt;if(p.y>1.04)p.y=-.04;
        const x=p.x*w+Math.sin(time*.00035+p.phase)*40,y=p.y*h;
        ctx.globalAlpha=.18+(Math.sin(time*.0009+p.phase)+1)*.1;ctx.fillStyle=p.color;
        if(p.star)sparkle(x,y,p.size*.7,time*.00015+p.phase);else petal(x,y,p.size,time*.0003+p.phase);
      });
      for(let i=trail.length-1;i>=0;i--){
        const p=trail[i];p.life-=dt/650;if(p.life<=0){trail.splice(i,1);continue;}
        p.y-=dt*.012;ctx.globalAlpha=p.life*.65;ctx.fillStyle='#cb8fb0';sparkle(p.x,p.y,p.life*5);
      }
      for(let i=bursts.length-1;i>=0;i--){
        const p=bursts[i];p.life-=dt/900;if(p.life<=0){bursts.splice(i,1);continue;}
        p.x+=p.vx*step;p.y+=p.vy*step;p.vy+=.1*step;ctx.globalAlpha=p.life*.85;ctx.fillStyle=p.color;sparkle(p.x,p.y,p.size*p.life,time*.002);
      }
      ctx.globalAlpha=1;
    }
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(!motionAllowed()||document.hidden){cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,w,h);trail.length=bursts.length=0;}
    else if(!frame)frame=requestAnimationFrame(tick);
  }
  resize();addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);sync();
  return {sync};
}
