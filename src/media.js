// Local image paths, relative to public/. Fill these when the actual photos arrive.
export const media = {
  creatorPortrait: '',
  memories: [],
};

export function mountSavedPhotos(){
  if(media.creatorPortrait){
    const image=document.querySelector('#creatorPortrait');
    image.addEventListener('load',()=>{image.hidden=false;document.querySelector('#creatorFrame').classList.add('portrait-ready');},{once:true});
    image.src=import.meta.env.BASE_URL+media.creatorPortrait;
  }
  media.memories.slice(0,3).forEach((item,index)=>{
    const target=document.querySelector(`[data-photo="${index}"]`);
    const image=new Image();image.alt=item.alt||`Ảnh Mỹ Tú ${index+1}`;image.loading='lazy';
    image.addEventListener('load',()=>{target.replaceChildren(image);target.setAttribute('aria-label',`Thay ảnh Mỹ Tú ${index+1}`);},{once:true});
    image.src=import.meta.env.BASE_URL+item.src;
    if(item.position)image.style.objectPosition=item.position;
  });
  if(media.memories.length)document.querySelector('.photo-note').textContent='Ảnh của Mỹ Tú · Chạm vào khung để thử một ảnh khác trên thiết bị này.';
}
