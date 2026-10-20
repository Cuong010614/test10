// Add the selected recording as public/music.mp3 before publishing the build.
export function setupMusicPlayer() {
  const audio = document.querySelector('#giftAudio');
  const toggle = document.querySelector('#musicToggle');
  const status = document.querySelector('#musicStatus');
  const record = document.querySelector('.record-player');
  audio.src = `${import.meta.env.BASE_URL}music.mp3`;
  audio.volume = 0.55;

  function sync() {
    const playing = !audio.paused && !audio.ended && !audio.error;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    toggle.querySelector('.sound-label').textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
    record.classList.toggle('is-playing', playing);
  }

  function reportError() {
    sync();
    status.textContent = 'Chưa tải được bài hát. Em thử bấm phát lại nhé.';
  }

  function play() {
    if (audio.error) audio.load();
    // Called directly from the heart/button gesture, including on mobile Safari.
    const pending = audio.play();
    pending?.catch(error => {
      if (error.name === 'AbortError') return;
      sync();
      status.textContent = error.name === 'NotAllowedError'
        ? 'Em bấm phát bên dưới để nghe nhé.'
        : 'Chưa phát được bài hát. Em thử lại nhé.';
    });
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('playing', () => {
    sync();
    status.textContent = 'Đang phát · Thích Em Hơi Nhiều — Wren Evans';
  });
  audio.addEventListener('pause', () => {
    sync();
    status.textContent = audio.error ? 'Chưa tải được bài hát. Em thử lại nhé.' : 'Đã tạm dừng.';
  });
  audio.addEventListener('waiting', () => {
    status.textContent = 'Đang tải nhạc…';
  });
  audio.addEventListener('error', reportError);
  sync();
  return { play };
}
