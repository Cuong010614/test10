import { media } from './media.js';
import { motionAllowed } from './experience.js';

const motifs = {
  flower: '<g fill="currentColor" opacity=".3"><ellipse cx="40" cy="22" rx="8" ry="14"/><ellipse cx="40" cy="22" rx="8" ry="14" transform="rotate(60 40 40)"/><ellipse cx="40" cy="22" rx="8" ry="14" transform="rotate(120 40 40)"/><ellipse cx="40" cy="22" rx="8" ry="14" transform="rotate(180 40 40)"/><ellipse cx="40" cy="22" rx="8" ry="14" transform="rotate(240 40 40)"/><ellipse cx="40" cy="22" rx="8" ry="14" transform="rotate(300 40 40)"/></g><circle cx="40" cy="40" r="6" fill="#dfb85e"/>',
  star: '<path d="M40 8Q43 36 70 40Q43 44 40 72Q36 44 10 40Q36 36 40 8Z"/><path d="M65 8v12m-6-6h12"/>',
  bubbles: '<circle cx="28" cy="43" r="18"/><circle cx="57" cy="22" r="10"/><circle cx="61" cy="61" r="5"/><path d="M17 40q1-7 8-8"/>',
  music: '<path d="M27 54V24l32-8v29M27 31l32-8"/><ellipse cx="20" cy="57" rx="8" ry="6"/><ellipse cx="52" cy="48" rx="8" ry="6"/>',
  bow: '<path d="M40 35Q4 2 10 31Q15 48 40 35Q76 2 70 31Q65 48 40 35M37 39L25 70l-6-12M43 39l12 31 6-12"/><circle cx="40" cy="35" r="5"/>',
};
const icon = name => `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${motifs[name]}</svg>`;
const friendMotif = { miffy: 'flower', bibble: 'bubbles', snoopy: 'music', bechichi: 'bow', hirono: 'star' };

function ornament(parent, className, html) {
  const el = document.createElement('span');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = html;
  parent.append(el);
  return el;
}

export function setupDetails() {
  const sections = document.querySelectorAll('#giftWorld main > section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => target.classList.toggle('details-visible', isIntersecting));
  }, { rootMargin: '80px' });
  sections.forEach((section, index) => {
    section.classList.add('detail-section');
    observer.observe(section);
    if (section.id === 'surprise') return;
    const type = ['flower', 'bow', 'star', 'flower', 'bubbles', 'music', 'bow'][index];
    ornament(section, 'section-doodle doodle-left', icon(type));
    ornament(section, 'section-doodle doodle-right', icon(index % 2 ? 'star' : type));
    ornament(section, 'section-stitch', '<i></i><i></i><i></i>');
  });
  const hero = document.querySelector('.hero');
  ornament(hero, 'edge-petal petal-left', '');
  ornament(hero, 'edge-petal petal-right', '');
  const envelope = document.querySelector('.envelope');
  ornament(envelope, 'paper-tape envelope-tape', '');
  ornament(envelope, 'postmark', '<b>20 / 10</b><small>GỬI MỸ TÚ</small>');
  document.querySelectorAll('.polaroid').forEach((frame, index) => {
    ornament(frame, 'paper-tape photo-tape', '');
    ornament(frame, 'photo-clip', '');
    const name = ['miffy', 'snoopy', 'bibble'][index];
    const sticker = ornament(frame, 'photo-sticker', '');
    const image = new Image();
    image.src = import.meta.env.BASE_URL + media.characters[name];
    image.alt = '';
    image.loading = 'lazy';
    sticker.append(image);
  });
  document.querySelectorAll('[data-friend]').forEach(card => {
    const type = friendMotif[card.dataset.friend];
    ornament(card, 'friend-doodle friend-doodle-a', icon(type));
    ornament(card, 'friend-doodle friend-doodle-b', icon(type));
    const burst = ornament(card, 'friend-burst', '');
    let timer;
    card.addEventListener('click', () => {
      clearTimeout(timer);
      burst.replaceChildren();
      if (!motionAllowed()) return;
      for (let i = 0; i < 7; i++) {
        const particle = ornament(burst, 'motif-particle', icon(type));
        const angle = Math.PI * 2 * i / 7;
        particle.style.setProperty('--burst-x', `${Math.cos(angle) * 90}px`);
        particle.style.setProperty('--burst-y', `${Math.sin(angle) * 90 - 30}px`);
        particle.style.setProperty('--burst-turn', `${i * 35}deg`);
      }
      timer = setTimeout(() => burst.replaceChildren(), 950);
    });
  });
  const player = document.querySelector('.record-content');
  ornament(player, 'music-bars', Array.from({ length: 19 }, (_, i) =>
    `<i style="--bar-delay:${-(i % 7) * .13}s;--bar-height:${12 + (i * 17 % 25)}px"></i>`).join(''));
  setupPhotoViewer();
}

function setupPhotoViewer() {
  const dialog = document.createElement('dialog');
  dialog.id = 'photoViewer';
  dialog.setAttribute('aria-label', 'Ảnh của chúng mình');
  dialog.innerHTML = '<button type="button" class="viewer-close" aria-label="Đóng ảnh">×</button><img class="viewer-image" alt=""><div class="viewer-controls"><button type="button" class="viewer-prev" aria-label="Ảnh trước">←</button><span class="viewer-count" role="status"></span><button type="button" class="viewer-next" aria-label="Ảnh tiếp theo">→</button></div>';
  document.body.append(dialog);
  let index = 0;
  let previousOverflow = '';
  function show(next) {
    index = (next + media.memories.length) % media.memories.length;
    const photo = media.memories[index];
    const image = dialog.querySelector('img');
    image.src = import.meta.env.BASE_URL + photo.src;
    image.alt = photo.alt;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${media.memories.length} · OUR LITTLE MOMENT`;
  }
  document.querySelectorAll('[data-photo]').forEach(button => {
    button.setAttribute('aria-label', `Xem ảnh ${Number(button.dataset.photo) + 1} lớn hơn`);
    button.addEventListener('click', () => {
      show(Number(button.dataset.photo));
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    });
  });
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    dialog.querySelector('img').removeAttribute('src');
  });
}
