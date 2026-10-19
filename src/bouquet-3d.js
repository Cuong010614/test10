import * as THREE from 'three';

// Curved, pointed petals are actual surfaces, with their veins drawn into vertex color.
function petalGeometry(length = 1.08, width = .255, curl = .32) {
  const vertices=[],colors=[],indices=[];
  const rows=18,cols=10;
  for(let i=0;i<=rows;i++){
    const t=i/rows;
    for(let j=0;j<=cols;j++){
      const side=j/cols*2-1;
      const envelope=Math.pow(Math.sin(Math.PI*t),.78);
      vertices.push(side*width*envelope,length*t,curl*Math.sin(t*Math.PI)-.32*t*t+.12*side*side*envelope);
      const vein=Math.exp(-side*side*28)*Math.sin(Math.PI*t);
      const speck=t>.2&&t<.67&&Math.sin(i*17+j*37)>.84 ? .18 : 0;
      colors.push(1-speck,.86-vein*.33-speck,.9-vein*.2-speck);
      if(i<rows&&j<cols){const n=i*(cols+1)+j;indices.push(n,n+1,n+cols+1,n+1,n+cols+2,n+cols+1);}
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}

export function mountBouquet(host,{motionAllowed,onReady,onFallback}){
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{onFallback();return null;}
  renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(36,1,.1,60);camera.position.set(0,.3,11.8);camera.lookAt(0,.1,0);
  scene.add(new THREE.HemisphereLight(0xffecf5,0x4a4152,1.8));
  const key=new THREE.DirectionalLight(0xfff0de,2.6);key.position.set(3,5,6);scene.add(key);
  const rim=new THREE.DirectionalLight(0xc29bff,2);rim.position.set(-4,2,-2);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffa9c6,1);fill.position.set(2,-1,3);scene.add(fill);
  const bouquet=new THREE.Group();scene.add(bouquet);
  const petals=petalGeometry();
  const petalMaterials=[0xffd5e5,0xf2a2c7,0xffeee2,0xd290b7].map(color=>new THREE.MeshStandardMaterial({color,vertexColors:true,side:THREE.DoubleSide,roughness:.48,metalness:.03}));
  const green=new THREE.MeshStandardMaterial({color:0x607c58,roughness:.66,side:THREE.DoubleSide});
  const gold=new THREE.MeshStandardMaterial({color:0x976739,roughness:.5});
  const filament=new THREE.MeshStandardMaterial({color:0xcac485,roughness:.6});
  const leafGeo=petalGeometry(.85,.15,.16);
  const stemStart=new THREE.Vector3(0,-2.25,0);
  const placements=[[-.88,.58,.25,.92,-.28], [.78,.65,.05,.88,.2], [0,1.55,-.15,.88,-.1], [-.78,1.55,-.7,.69,-.35], [.95,1.65,-.7,.72,.4], [-.05,.3,1,.85,.04], [.12,1,.6,.76,.05]];
  placements.forEach(([x,y,z,scale,tilt],index)=>{
    const stemCurve=new THREE.QuadraticBezierCurve3(stemStart,new THREE.Vector3(x*.4,y-.9,z*.5),new THREE.Vector3(x,y,z));
    bouquet.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve,14,.024,5,false),green));
    const head=new THREE.Group();head.position.set(x,y,z);head.rotation.set(-.12,tilt,index*.63);head.scale.setScalar(scale);
    for(let j=0;j<6;j++){
      const petal=new THREE.Mesh(petals,petalMaterials[(index+(j%2===0?0:1))%4]);
      petal.rotation.z=j*Math.PI/3;petal.rotation.x=.08;head.add(petal);
    }
    for(let j=0;j<6;j++){
      const angle=j*Math.PI/3;
      const end=new THREE.Vector3(Math.sin(angle)*.18,Math.cos(angle)*.18,.43);
      const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(),new THREE.Vector3(end.x*.8,end.y*.8,.3),end);
      head.add(new THREE.Mesh(new THREE.TubeGeometry(curve,6,.009,4,false),filament));
      const anther=new THREE.Mesh(new THREE.SphereGeometry(.042,6,4),gold);anther.scale.set(.7,1.6,.7);anther.position.copy(end);anther.rotation.z=angle;head.add(anther);
    }
    bouquet.add(head);
    for(let j=0;j<2;j++){
      const leaf=new THREE.Mesh(leafGeo,green);leaf.position.copy(stemCurve.getPoint(.68+j*.16));
      leaf.rotation.set(.4,index*.9,(j===0?-1:1)*(.6+index*.12));bouquet.add(leaf);
    }
  });
  const paperMaterial=new THREE.MeshStandardMaterial({color:0xe9cfc1,side:THREE.DoubleSide,roughness:.8});
  const paper=new THREE.Mesh(new THREE.CylinderGeometry(1.3,.16,2.35,48,1,true,0,Math.PI*1.64),paperMaterial);
  paper.position.set(0,-1.25,-.12);paper.rotation.y=.8;bouquet.add(paper);
  const outerPaper=paper.clone();outerPaper.material=new THREE.MeshStandardMaterial({color:0xc18b9b,side:THREE.DoubleSide,roughness:.65});outerPaper.rotation.y=3.75;outerPaper.scale.set(1.045,.88,1.045);outerPaper.position.y=-1.39;bouquet.add(outerPaper);
  const ribbonMaterial=new THREE.MeshStandardMaterial({color:0x8e335e,roughness:.38,metalness:.12});
  const ribbon=new THREE.Mesh(new THREE.TorusGeometry(.47,.07,8,36),ribbonMaterial);ribbon.rotation.x=Math.PI/2;ribbon.position.set(0,-1.84,0);bouquet.add(ribbon);
  [-1,1].forEach(side=>{
    const loop=new THREE.Mesh(new THREE.TorusGeometry(.22,.035,6,24),ribbonMaterial);loop.position.set(side*.21,-1.76,.49);loop.scale.set(1.3,.65,1);loop.rotation.z=side*.32;bouquet.add(loop);
    const tail=new THREE.Mesh(new THREE.PlaneGeometry(.09,.65),ribbonMaterial);tail.position.set(side*.13,-2.07,.48);tail.rotation.z=side*.25;bouquet.add(tail);
  });
  const dustGeo=new THREE.BufferGeometry();const dustPositions=new Float32Array(90*3);
  for(let i=0;i<90;i++){dustPositions[i*3]=(Math.random()-.5)*8;dustPositions[i*3+1]=(Math.random()-.5)*7;dustPositions[i*3+2]=(Math.random()-.5)*5;}
  dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
  const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffd5e6,size:.024,transparent:true,opacity:.7,depthWrite:false}));scene.add(dust);
  let frame=0,inView=true,last=0,elapsed=0,spin=0,targetSpin=0,manual=false,failed=false;
  const pointer={x:0,y:0};
  const render=()=>renderer.render(scene,camera);
  function resize(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h||failed)return;
    const ratio=Math.min(devicePixelRatio||1,matchMedia('(max-width:760px)').matches?1.35:1.7);
    renderer.setSize(Math.floor(w*ratio),Math.floor(h*ratio),false);camera.aspect=w/h;camera.position.z=w/h<.9?13.4:11.8;camera.updateProjectionMatrix();render();
  }
  function tick(now){
    frame=0;if(failed||!inView||document.hidden)return;
    if(!motionAllowed()&&!manual)return;
    if(now-last>=1000/30){
      const dt=Math.min((now-last)/1000,.08);last=now;elapsed+=dt;
      spin+=(targetSpin-spin)*.1;
      bouquet.rotation.y=spin+pointer.x*.24+(motionAllowed()?Math.sin(elapsed*.35)*.11:0);
      bouquet.rotation.x=pointer.y*.1;
      bouquet.rotation.z=motionAllowed()?Math.sin(elapsed*.5)*.035:0;
      bouquet.position.y=motionAllowed()?Math.sin(elapsed*.8)*.055:0;
      dust.rotation.y=elapsed*.035;
      render();if(manual&&Math.abs(targetSpin-spin)<.002)manual=false;
    }
    if(motionAllowed()||manual)frame=requestAnimationFrame(tick);
  }
  function wake(){if(!frame&&!failed&&inView&&!document.hidden&&(motionAllowed()||manual))frame=requestAnimationFrame(tick);}
  function sync(){if(!motionAllowed()){cancelAnimationFrame(frame);frame=0;pointer.x=pointer.y=0;bouquet.rotation.x=0;render();}wake();}
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)wake();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});observer.observe(host);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);
  host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!motionAllowed())return;const box=host.getBoundingClientRect();pointer.x=(e.clientX-box.left)/box.width*2-1;pointer.y=(e.clientY-box.top)/box.height*2-1;});
  host.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;});
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};document.addEventListener('visibilitychange',visibility);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.hidden=true;onFallback();});
  resize();render();onReady();wake();
  return {sync,rotate(){targetSpin+=Math.PI*2;if(!motionAllowed()){spin=targetSpin;bouquet.rotation.y+=.45;render();}else{manual=true;wake();}},reset(){targetSpin=spin=0;pointer.x=pointer.y=0;bouquet.rotation.set(0,0,0);render();}};
}
