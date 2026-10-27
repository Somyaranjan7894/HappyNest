const audio = document.querySelector('#bekhudi-audio');
const playerCard = document.querySelector('.player-card');
const playToggle = document.querySelector('#play-toggle');
const seekControl = document.querySelector('#seek-control');
const elapsedTime = document.querySelector('#elapsed-time');
const totalTime = document.querySelector('#total-time');
const playerStatus = document.querySelector('#player-status');
const motionPreference = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;
let prefersReducedMotion = Boolean(motionPreference?.matches);

if (audio && playerCard && playToggle && seekControl && elapsedTime && totalTime && playerStatus) {
  let isPlaying = false;
  let isStarting = false;
  let hasError = false;
  const musicParticles = document.querySelector('.music-particles');
  const activeNotes = new Map();
  let noteInterval = null;

  const stopMusicNotes = () => {
    if (noteInterval !== null) window.clearInterval(noteInterval);
    noteInterval = null;
    activeNotes.forEach((timer, note) => {
      window.clearTimeout(timer);
      note.remove();
    });
    activeNotes.clear();
  };

  const createMusicNote = () => {
    if (!musicParticles || prefersReducedMotion || audio.paused || audio.ended || activeNotes.size >= 4) return;

    const note = document.createElement('span');
    const notes = ['♪', '♫', '♬'];
    note.className = 'music-particle';
    note.setAttribute('aria-hidden', 'true');
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.left = `${8 + Math.random() * 84}%`;
    musicParticles.appendChild(note);

    const timer = window.setTimeout(() => {
      activeNotes.delete(note);
      note.remove();
    }, 2800);
    activeNotes.set(note, timer);
    note.addEventListener('animationend', () => {
      window.clearTimeout(timer);
      activeNotes.delete(note);
      note.remove();
    }, { once: true });
  };

  const startMusicNotes = () => {
    if (!musicParticles || prefersReducedMotion || audio.paused || audio.ended || noteInterval !== null) return;
    createMusicNote();
    noteInterval = window.setInterval(createMusicNote, 850);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '--:--';

    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainder = String(wholeSeconds % 60).padStart(2, '0');

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}:${String(minutes % 60).padStart(2, '0')}:${remainder}`;
    }

    return `${minutes}:${remainder}`;
  };

  const setStatus = (message, isError = false) => {
    playerStatus.textContent = message;
    playerStatus.classList.toggle('is-error', isError);
  };

  const setPlaybackState = (playing) => {
    isPlaying = playing;
    isStarting = false;
    playerCard.classList.toggle('is-playing', playing);
    playToggle.setAttribute('aria-pressed', String(playing));
    playToggle.setAttribute('aria-label', playing ? 'Pause Bekhudi' : 'Play Bekhudi');
    playToggle.disabled = false;
    if (!playing) stopMusicNotes();
  };

  const updateProgress = () => {
    const duration = audio.duration;
    const hasDuration = Number.isFinite(duration) && duration > 0;

    seekControl.disabled = !hasDuration;
    totalTime.textContent = hasDuration ? formatTime(duration) : '--:--';

    if (!hasDuration) {
      elapsedTime.textContent = formatTime(audio.currentTime);
      seekControl.value = '0';
      seekControl.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of --:--`);
      return;
    }

    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const progress = Math.min(1, Math.max(0, currentTime / duration));
    seekControl.value = String(Math.round(progress * Number(seekControl.max)));
    elapsedTime.textContent = formatTime(currentTime);
    seekControl.setAttribute('aria-valuetext', `${formatTime(currentTime)} of ${formatTime(duration)}`);
  };

  const seekToControlValue = () => {
    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    const fraction = Number(seekControl.value) / Number(seekControl.max);
    const targetTime = Math.min(duration, Math.max(0, fraction * duration));
    if (!Number.isFinite(targetTime)) return;

    audio.currentTime = targetTime;
    elapsedTime.textContent = formatTime(targetTime);
    seekControl.setAttribute('aria-valuetext', `${formatTime(targetTime)} of ${formatTime(duration)}`);
  };

  playToggle.addEventListener('click', async () => {
    if (isPlaying) {
      audio.pause();
      setPlaybackState(false);
      if (!hasError) setStatus('Paused. Pick up whenever you like.');
      return;
    }

    if (isStarting) return;

    isStarting = true;
    playToggle.disabled = true;
    setStatus('Getting the song ready…');

    try {
      if (audio.error) audio.load();
      await audio.play();
      if (!audio.paused && !audio.ended) {
        hasError = false;
        setPlaybackState(true);
        setStatus('Playing Bekhudi.');
      } else {
        setPlaybackState(false);
        if (!hasError) setStatus('Paused. Pick up whenever you like.');
      }
    } catch {
      setPlaybackState(false);
      hasError = true;
      setStatus('The song could not be started. Please try again in a moment.', true);
    }
  });

  seekControl.addEventListener('input', seekToControlValue);

  audio.addEventListener('loadstart', () => {
    if (!isPlaying && !isStarting && !hasError) setStatus('Getting the song ready…');
  });

  audio.addEventListener('loadedmetadata', () => {
    updateProgress();
    hasError = false;
    if (!isPlaying && !isStarting) setStatus('The song is ready when you are.');
  });

  audio.addEventListener('durationchange', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('seeked', updateProgress);

  audio.addEventListener('playing', () => {
    hasError = false;
    setPlaybackState(true);
    startMusicNotes();
    setStatus('Playing Bekhudi.');
  });

  audio.addEventListener('waiting', () => {
    if (isPlaying) setPlaybackState(false);
    if (!hasError) setStatus('The song is buffering…');
  });

  audio.addEventListener('pause', () => {
    if (isPlaying || isStarting) {
      setPlaybackState(false);
      if (!hasError && !audio.ended) setStatus('Paused. Pick up whenever you like.');
    }
  });

  audio.addEventListener('ended', () => {
    setPlaybackState(false);
    updateProgress();
    setStatus('The song has ended. You can play it again whenever you like.');
  });

  audio.addEventListener('error', () => {
    setPlaybackState(false);
    hasError = true;
    setStatus('This song could not be loaded. Please try again later.', true);
  });

  updateProgress();

  motionPreference?.addEventListener?.('change', (event) => {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) stopMusicNotes();
    else if (!audio.paused && !audio.ended) startMusicNotes();
  });
}

const chocolateCloseTimers = new WeakMap();
document.querySelectorAll('.chocolate-reveal').forEach((button) => {
  const messageId = button.getAttribute('aria-controls');
  const message = messageId ? document.getElementById(messageId) : null;
  if (!message) return;
  const card = button.closest('.chocolate-card');

  button.addEventListener('click', () => {
    const isOpening = button.getAttribute('aria-expanded') !== 'true';
    const closeTimer = chocolateCloseTimers.get(button);
    if (closeTimer !== undefined) window.clearTimeout(closeTimer);
    button.setAttribute('aria-expanded', String(isOpening));
    button.textContent = button.getAttribute(isOpening ? 'data-hide-label' : 'data-reveal-label');

    if (isOpening) {
      message.hidden = false;
      message.removeAttribute('aria-hidden');
      card?.classList.remove('is-closing');
      card?.classList.add('is-open');
      return;
    }

    message.setAttribute('aria-hidden', 'true');
    card?.classList.remove('is-open');
    card?.classList.add('is-closing');
    const timer = window.setTimeout(() => {
      if (button.getAttribute('aria-expanded') === 'false') message.hidden = true;
      card?.classList.remove('is-closing');
      chocolateCloseTimers.delete(button);
    }, prefersReducedMotion ? 0 : 220);
    chocolateCloseTimers.set(button, timer);
  });
});

const letterToggle = document.querySelector('#letter-toggle');
const friendLetter = document.querySelector('#best-friend-letter');

if (letterToggle && friendLetter) {
  const envelopeCard = letterToggle.closest('.envelope-card');
  let letterCloseTimer = null;

  letterToggle.addEventListener('click', () => {
    const isOpening = letterToggle.getAttribute('aria-expanded') !== 'true';
    if (letterCloseTimer !== null) window.clearTimeout(letterCloseTimer);
    letterCloseTimer = null;
    letterToggle.setAttribute('aria-expanded', String(isOpening));
    letterToggle.textContent = letterToggle.getAttribute(isOpening ? 'data-close-label' : 'data-open-label');

    if (isOpening) {
      friendLetter.hidden = false;
      friendLetter.removeAttribute('aria-hidden');
      friendLetter.classList.remove('is-closing');
      friendLetter.classList.add('is-opening');
      envelopeCard?.classList.add('is-open');
      return;
    }

    friendLetter.setAttribute('aria-hidden', 'true');
    friendLetter.classList.remove('is-opening');
    friendLetter.classList.add('is-closing');
    envelopeCard?.classList.remove('is-open');
    letterCloseTimer = window.setTimeout(() => {
      if (letterToggle.getAttribute('aria-expanded') === 'false') friendLetter.hidden = true;
      friendLetter.classList.remove('is-closing');
      letterCloseTimer = null;
    }, prefersReducedMotion ? 0 : 240);
  });
}
