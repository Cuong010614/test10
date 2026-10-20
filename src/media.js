// User-selected originals, relative to public/.
export const media = {
  creatorPortrait: 'Screenshot 2026-10-20 131638.png',
  characters: {
    miffy: 'Screenshot 2026-10-20 142650.png',
    bibble: 'Screenshot 2026-10-20 133624.png',
    snoopy: 'Screenshot 2026-10-20 142642.png',
    bechichi: 'Screenshot 2026-10-20 133759.png',
    hirono: 'Screenshot 2026-10-20 142701.png',
  },
  memories: [
    { src: '1792476527078_2281193348403494968_5294749988580951274_61f0e5b3da9e0096662358c3ac7f41be.jpg', alt: 'Ảnh chụp chung của hai đứa mình' },
    { src: '1792476527149_2281193348403494968_5294749988580951274_a38981b47ef4871ee961174734bce477.jpg', alt: 'Ảnh chân dung Mỹ Tú' },
    { src: '1792476527224_2281193348403494968_5294749988580951274_3c2f18bceff5b3d98f2a68e68a5ba0a4.jpg', alt: 'Hai đứa chụp chung với bó hoa' },
  ],
};

export function mountSavedPhotos(){
  if(media.creatorPortrait){
    const image=document.querySelector('#creatorPortrait');
    image.addEventListener('load',()=>{image.hidden=false;document.querySelector('#creatorFrame').classList.add('portrait-ready');},{once:true});
    image.src=import.meta.env.BASE_URL+media.creatorPortrait;
  }
  media.memories.slice(0,3).forEach((item,index)=>{
    const target=document.querySelector(`[data-photo="${index}"]`);
    const image=new Image();image.alt=item.alt||`Ảnh Mỹ Tú ${index+1}`;image.loading='eager';
    image.addEventListener('load',()=>{target.replaceChildren(image);target.setAttribute('aria-label',`Thay ảnh Mỹ Tú ${index+1}`);},{once:true});
    image.src=import.meta.env.BASE_URL+item.src;
    if(item.position)image.style.objectPosition=item.position;
  });
  if(media.memories.length)document.querySelector('.photo-note').textContent='Ảnh của Mỹ Tú · Chạm vào khung để thử một ảnh khác trên thiết bị này.';
}
