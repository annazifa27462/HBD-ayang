/**
 * ========================================================
 * WEB UCAPAN ULANG TAHUN KEKINIAN
 * Khusus Untuk: Niken Widia Astuti 💖
 * Dari: Ramaditya Maulana
 * ========================================================
 */

// --- STATE MANAGEMENT ---
let isPlaying = false;
let currentSongIndex = 0; // 0: Ed Sheeran (Perfect) starts first!, 1: James Arthur
let candleBlown = false;

// Playlist Configuration with Real MP3 Files (Ed Sheeran first)
const PLAYLIST = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    src: "asets/ed-sheeran-perfect.mp3",
    photo: "asets/aset%201.jpeg"
  },
  {
    title: "Say You Won't Let Go",
    artist: "James Arthur",
    src: "asets/james-arthur-say-you-wont-let-go.mp3",
    photo: "asets/aset%202.jpeg"
  }
];

// All 10 Memory Photos in asets (Galeri kita)
const MEMORY_PHOTOS = [
  {
    url: "asets/aset%201.jpeg",
    caption: "Senyuman termanismu 🌸"
  },
  {
    url: "asets/aset%202.jpeg",
    caption: "Momen paling bahagia ✨"
  },
  {
    url: "asets/aset%203.jpeg",
    caption: "Selalu bikin kangen 💖"
  },
  {
    url: "asets/aset4.jpeg",
    caption: "Tawa lepas kita berdua 🥂"
  },
  {
    url: "asets/aset5.jpeg",
    caption: "Bidadari kesayanganku 🌟"
  },
  {
    url: "asets/aset6.jpeg",
    caption: "Cantik di setiap waktu 🥰"
  },
  {
    url: "asets/aset%207.jpeg",
    caption: "Hari yang indah bersamamu 🌸"
  },
  {
    url: "asets/aset8.jpeg",
    caption: "Selalu ada tawa bersamamu 💫"
  },
  {
    url: "asets/aset9.jpeg",
    caption: "Cerita manis kita berdua 🌷"
  },
  {
    url: "asets/aset10.jpeg",
    caption: "Selamanya di hatiku ❤️"
  }
];

// ========================================================
// INITIALIZATION
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  initAndroidClock();
  initCalendarDate();
  initAmbientCanvas();
  setupAudioPlayer();
  setupEventListeners();

  // Try auto-playing audio immediately on load (Ed Sheeran - Perfect)
  const audio = document.getElementById("main-audio-player");
  if (audio) {
    audio.play().then(() => {
      onAudioStartSuccess();
    }).catch(() => {
      // Browser requires first touch/click interaction
      window.addEventListener("click", () => {
        if (!isPlaying) playAudio();
      }, { once: true });
      window.addEventListener("touchstart", () => {
        if (!isPlaying) playAudio();
      }, { once: true });
    });
  }
});

// Update Android Status Bar Clock
function initAndroidClock() {
  const clockEl = document.getElementById("android-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}`;
  }
  update();
  setInterval(update, 30000);
}

// Populate Dynamic Date on Calendar
function initCalendarDate() {
  const now = new Date();
  const dayNames = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  const monthNames = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];

  const calMonthYear = document.getElementById("cal-month-year");
  const calDayName = document.getElementById("cal-day-name");
  const calDateNumber = document.getElementById("cal-date-number");

  if (calMonthYear) calMonthYear.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  if (calDayName) calDayName.textContent = dayNames[now.getDay()];
  if (calDateNumber) calDateNumber.textContent = String(now.getDate());
}

// ========================================================
// SCREEN 0: START EXPERIENCE FROM INTRO SCREEN
// ========================================================
function startExperienceFromIntro() {
  playAudio();

  const introScreen = document.getElementById("page-intro");
  const envelopeScreen = document.getElementById("page-envelope");

  if (introScreen && envelopeScreen) {
    introScreen.classList.remove("active");
    introScreen.classList.add("prev");

    envelopeScreen.classList.add("active");
  }
}

// ========================================================
// PAGE NAVIGATION SYSTEM (SEPARATED PAGES SURPRISE)
// ========================================================
const PAGE_IDS = [
  "page-1", // Index 0: Calendar / Cake
  "page-2", // Index 1: Birthday letter from Ramaditya Maulana
  "page-4", // Index 2: Music Vinyl Player (Ed Sheeran first)
  "page-5", // Index 3: Memories Gallery (Galeri kita)
  "page-6"  // Index 4: Ending Love Screen
];

function goToPage(targetIndex) {
  // Hide intro & envelope if visible
  const introScreen = document.getElementById("page-intro");
  const envelopeScreen = document.getElementById("page-envelope");
  if (introScreen) {
    introScreen.classList.remove("active");
    introScreen.classList.add("prev");
  }
  if (envelopeScreen) {
    envelopeScreen.classList.remove("active");
    envelopeScreen.classList.add("prev");
  }

  // Update Page Classes
  PAGE_IDS.forEach((id, idx) => {
    const pageEl = document.getElementById(id);
    if (!pageEl) return;

    pageEl.classList.remove("active", "prev");
    if (idx === targetIndex) {
      pageEl.classList.add("active");
    } else if (idx < targetIndex) {
      pageEl.classList.add("prev");
    }
  });

  updateStoryProgressBar(targetIndex);

  // Ensure music is active
  if (!isPlaying) {
    playAudio();
  }
}

// Update Top Story Progress Indicators (5 Segments)
function updateStoryProgressBar(activeIndex) {
  for (let i = 0; i < 5; i++) {
    const progEl = document.getElementById(`prog-${i}`);
    if (!progEl) continue;

    if (i < activeIndex) {
      progEl.style.width = "100%";
    } else if (i === activeIndex) {
      progEl.style.width = "100%";
    } else {
      progEl.style.width = "0%";
    }
  }
}

// ========================================================
// SCREEN 1: ENVELOPE OPENING
// ========================================================
function openEnvelope() {
  const envelopeBox = document.querySelector(".envelope-box");
  if (!envelopeBox || envelopeBox.classList.contains("open")) return;

  envelopeBox.classList.add("open");

  // Ensure music plays right from start!
  playAudio();

  // Initial confetti burst
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#FF4D79', '#FFA3B5', '#FFE4E8', '#FFFFFF']
  });

  // Slide to Page 1 (Calendar)
  setTimeout(() => {
    goToPage(0);
  }, 1100);
}

// ========================================================
// PAGE 1: CALENDAR -> CAKE SLIDE & BLOW CANDLE
// ========================================================
function revealCakeStage() {
  const calStage = document.getElementById("calendar-stage");
  const cakeStage = document.getElementById("cake-stage");

  if (!calStage || !cakeStage) return;

  calStage.style.opacity = "0";
  calStage.style.transform = "translateX(-30px)";

  setTimeout(() => {
    calStage.classList.add("hidden");
    cakeStage.classList.remove("hidden");
    cakeStage.style.opacity = "0";
    cakeStage.style.transform = "translateX(30px)";

    setTimeout(() => {
      cakeStage.style.opacity = "1";
      cakeStage.style.transform = "translateX(0)";
    }, 50);
  }, 400);
}

function blowCandleAndAdvance() {
  if (candleBlown) return;
  candleBlown = true;

  const flame = document.getElementById("candle-flame");
  const smoke = document.getElementById("candle-smoke");
  const instruction = document.getElementById("cake-instruction");

  // Blow out flame
  if (flame) {
    flame.style.transform = "translateX(-50%) scale(0)";
    flame.style.opacity = "0";
  }

  // Show rising smoke
  if (smoke) smoke.classList.remove("hidden");

  if (instruction) {
    instruction.innerHTML = `✨ <span class="text-sweetPink-600 font-bold">Lilin Padam!</span> Permohonanmu terkabul! ✨`;
  }

  // Massive Celebration Confetti Cannon!
  triggerCelebrationConfetti();

  // Automatically advance to birthday letter page (Page 2)
  setTimeout(() => {
    goToPage(1); // Page 2: Birthday letter from Ramaditya Maulana
  }, 1800);
}

function triggerCelebrationConfetti() {
  if (typeof confetti !== "function") return;

  const count = 180;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#FF4D79', '#FF7597', '#FFCCD5', '#FFF0F5', '#DFB15B', '#FFFFFF']
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 30, startVelocity: 50 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// ========================================================
// REAL AUDIO PLAYER & VINYL TURNTABLE INTEGRATION
// ========================================================
function setupAudioPlayer() {
  const audio = document.getElementById("main-audio-player");
  if (!audio) return;

  // Auto-advance to next song when current one finishes
  audio.addEventListener("ended", () => {
    nextSong();
  });

  audio.addEventListener("play", () => {
    onAudioStartSuccess();
  });

  audio.addEventListener("pause", () => {
    onAudioPauseSuccess();
  });
}

function onAudioStartSuccess() {
  isPlaying = true;
  document.getElementById("vinyl-disc")?.classList.add("spinning");
  document.getElementById("vinyl-tonearm")?.classList.add("active");
  document.getElementById("sound-equalizer")?.classList.add("playing");
  document.getElementById("mini-disc")?.classList.add("animate-spin");

  const playIcon = document.getElementById("vinyl-play-icon");
  if (playIcon) {
    playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  }

  const song = PLAYLIST[currentSongIndex];
  const miniTitle = document.getElementById("mini-music-title");
  if (miniTitle && song) {
    miniTitle.textContent = song.title.split(" ")[0] + " 🎵";
  }
}

function onAudioPauseSuccess() {
  isPlaying = false;
  document.getElementById("vinyl-disc")?.classList.remove("spinning");
  document.getElementById("vinyl-tonearm")?.classList.remove("active");
  document.getElementById("sound-equalizer")?.classList.remove("playing");
  document.getElementById("mini-disc")?.classList.remove("animate-spin");

  const playIcon = document.getElementById("vinyl-play-icon");
  if (playIcon) {
    playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
  }
}

function playAudio() {
  const audio = document.getElementById("main-audio-player");
  if (!audio) return;

  audio.play().then(() => {
    onAudioStartSuccess();
  }).catch((err) => {
    console.log("Audio play waiting for user tap:", err);
  });
}

function pauseAudio() {
  const audio = document.getElementById("main-audio-player");
  if (!audio) return;
  audio.pause();
  onAudioPauseSuccess();
}

function toggleAudioPlayback() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function switchSong(index) {
  currentSongIndex = index;
  const song = PLAYLIST[index];
  const audio = document.getElementById("main-audio-player");

  // Update Song Details in UI
  document.getElementById("song-tab-0")?.classList.toggle("active", index === 0);
  document.getElementById("song-tab-1")?.classList.toggle("active", index === 1);

  document.getElementById("current-song-title").textContent = song.title;
  document.getElementById("current-song-artist").textContent = `${song.artist} (Original Audio)`;
  document.getElementById("vinyl-art").src = song.photo;

  if (audio) {
    audio.src = song.src;
    audio.load();
    playAudio();
  }
}

function nextSong() {
  switchSong((currentSongIndex + 1) % PLAYLIST.length);
}

function prevSong() {
  switchSong((currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
}

// ========================================================
// FLOATING HEARTS SPREADER
// ========================================================
function setupEventListeners() {
  const heartBtn = document.getElementById("floating-heart-btn");
  if (heartBtn) {
    heartBtn.addEventListener("click", (e) => {
      createFloatingHeart(e.clientX, e.clientY);
    });
  }
}

function createFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "floating-heart";

  const emojis = ["💖", "🌸", "✨", "🥰", "🎂", "💌", "🍓", "❤️"];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const posX = (x || window.innerWidth / 2) + (Math.random() * 30 - 15);
  const posY = (y || window.innerHeight / 2) + (Math.random() * 20 - 10);

  heart.style.left = `${posX}px`;
  heart.style.top = `${posY}px`;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2200);
}

// ========================================================
// POLAROID LIGHTBOX (GALERI KITA)
// ========================================================
function openPhotoModal(index) {
  const photo = MEMORY_PHOTOS[index];
  if (!photo) return;

  const modal = document.getElementById("photo-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCap = document.getElementById("modal-caption");

  if (modalImg) modalImg.src = photo.url;
  if (modalCap) modalCap.textContent = photo.caption;

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closePhotoModal() {
  const modal = document.getElementById("photo-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Special Photo Lightbox (Rama & Niken)
function openSpecialPhoto(who) {
  const modal = document.getElementById("photo-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCap = document.getElementById("modal-caption");

  if (who === "rama") {
    if (modalImg) modalImg.src = "asets/rama%20kecil.jpeg";
    if (modalCap) modalCap.textContent = "Rama 👦 - Pacar terbaikmu!";
  } else {
    if (modalImg) modalImg.src = "asets/niken%20kecil.jpeg";
    if (modalCap) modalCap.textContent = "Niken 👧 - Bidadari tercantik!";
  }

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

// ========================================================
// AMBIENT BACKGROUND PARTICLES (PINK SPARKLES)
// ========================================================
function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 1,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? "rgba(255, 117, 151," : "rgba(255, 204, 213,"
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += 0.02;
      const currentAlpha = p.alpha + Math.sin(p.phase) * 0.2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${Math.max(0.08, currentAlpha)})`;
      ctx.fill();

      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    }

    requestAnimationFrame(animate);
  }

  animate();
}
