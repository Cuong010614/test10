const tracks = [
  { title: 'Thích Em Hơi Nhiều', artist: 'Wren Evans', file: 'Thích Em Hơi Nhiều.mp3' },
  { title: 'Tại Vì Sao', artist: 'MCK', file: 'Tại Vì Sao.mp3' },
];

export function setupMusicPlayer() {
  const audio = document.querySelector('#giftAudio');
  const toggle = document.querySelector('#musicToggle');
  const status = document.querySelector('#musicStatus');
  const record = document.querySelector('.record-player');
  const choices = [...document.querySelectorAll('[data-track]')];
  let current = 0;
  audio.volume = 0.55;

  function select(index) {
    audio.pause();
    current = index;
    const track = tracks[current];
    audio.src = encodeURI(`${import.meta.env.BASE_URL}${track.file}`);
    audio.setAttribute('aria-label', `${track.title} — ${track.artist}`);
    document.querySelector('#trackTitle').textContent = track.title;
    document.querySelector('#trackArtist').textContent = track.artist;
    choices.forEach(button => {
      const selected = Number(button.dataset.track) === current;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    status.textContent = 'Bấm phát để nghe nhé.';
    sync();
  }

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
    const requestedTrack = current;
    // Called directly from the heart/button gesture, including on mobile Safari.
    const pending = audio.play();
    pending?.catch(error => {
      if (error.name === 'AbortError' || requestedTrack !== current) return;
      sync();
      status.textContent = error.name === 'NotAllowedError'
        ? 'Em bấm phát bên dưới để nghe nhé.'
        : 'Chưa phát được bài hát. Em thử lại nhé.';
    });
  }

  choices.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.track);
    if (index !== current) select(index);
    play();
  }));
  toggle.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('playing', () => {
    sync();
    const track = tracks[current];
    status.textContent = `Đang phát · ${track.title} — ${track.artist}`;
  });
  audio.addEventListener('pause', () => {
    sync();
    status.textContent = audio.error ? 'Chưa tải được bài hát. Em thử lại nhé.' : 'Đã tạm dừng.';
  });
  audio.addEventListener('waiting', () => {
    status.textContent = 'Đang tải nhạc…';
  });
  audio.addEventListener('error', reportError);
  select(0);
  return { play };
}
