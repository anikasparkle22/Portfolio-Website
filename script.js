document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // STARFIELD CANVAS (fixed background)
  // ============================================================
  const sfCanvas = document.getElementById("starfield");
  if (sfCanvas) {
    const sfCtx = sfCanvas.getContext("2d");
    let sfW, sfH, stars = [];
    const STAR_COUNT = 220;

    function rb(a, b) { return a + Math.random() * (b - a); }

    function makeStar() {
      return {
        x: rb(0, sfW), y: rb(0, sfH),
        r: rb(0.4, 2.0),
        vx: rb(-0.05, 0.05), vy: rb(-0.07, 0.02),
        opacity: rb(0.3, 1), opacityTarget: rb(0.3, 1),
        opacitySpeed: rb(0.004, 0.013),
        hue: Math.random() < 0.5 ? null : (Math.random() < 0.5 ? "220" : "270"),
      };
    }

    function sfResize() {
      sfW = sfCanvas.width  = window.innerWidth;
      sfH = sfCanvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar());
    }

    function sfTick() {
      // background gradient
      const grad = sfCtx.createRadialGradient(sfW*0.5, sfH*0.35, 0, sfW*0.5, sfH*0.5, Math.max(sfW,sfH)*0.9);
      grad.addColorStop(0,   "#1a063a");
      grad.addColorStop(0.5, "#0d0520");
      grad.addColorStop(1,   "#060110");
      sfCtx.fillStyle = grad;
      sfCtx.fillRect(0, 0, sfW, sfH);

      stars.forEach(s => {
        // move
        s.x += s.vx; s.y += s.vy;
        if (s.x < -5) s.x = sfW+5; if (s.x > sfW+5) s.x = -5;
        if (s.y < -5) s.y = sfH+5; if (s.y > sfH+5) s.y = -5;
        // twinkle
        if (Math.abs(s.opacity - s.opacityTarget) < 0.01) s.opacityTarget = rb(0.2, 1);
        s.opacity += (s.opacityTarget - s.opacity) * s.opacitySpeed;
        // draw
        const col = s.hue ? `hsla(${s.hue},80%,85%,${s.opacity})` : `rgba(255,255,255,${s.opacity})`;
        const grd = sfCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3.5);
        grd.addColorStop(0, col); grd.addColorStop(1, "transparent");
        sfCtx.beginPath(); sfCtx.arc(s.x, s.y, s.r*3.5, 0, Math.PI*2);
        sfCtx.fillStyle = grd; sfCtx.fill();
        sfCtx.beginPath(); sfCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        sfCtx.fillStyle = col; sfCtx.fill();
      });

      requestAnimationFrame(sfTick);
    }

    sfResize();
    window.addEventListener("resize", sfResize);
    sfTick();
  }

  // ============================================================
  // LOADING SCREEN
  // ============================================================
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => loadingScreen.remove(), 900);
    }, 3200);
  }

  // ============================================================
  // ROTATING TEXT
  // ============================================================
  const phrases = ["Software Developer","Frontend Engineer","Data Scientist","UX Designer","Music Producer"];
  let phraseIndex = 0;
  const textEl = document.getElementById("rotating-text");
  function rotateText() {
    if (!textEl) return;
    textEl.style.opacity = 0;
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      textEl.textContent = phrases[phraseIndex];
      textEl.style.opacity = 1;
    }, 800);
  }
  setInterval(rotateText, 3000);

  // ============================================================
  // NAVBAR HAMBURGER
  // ============================================================
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  // ============================================================
  // TITLE FADE-IN ON SCROLL
  // ============================================================
  document.querySelectorAll("section h2, .intro-title").forEach(el => {
    el.classList.add("fade-title");
  });
  const titleObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".fade-title").forEach(el => titleObserver.observe(el));

  // ============================================================
  // PROJECT CARD PARALLAX (desktop only)
  // ============================================================
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  let cardTicking = false;
  function updateCardParallax() {
    if (window.innerWidth < 700) return;
    const vc = window.innerHeight / 2;
    projectCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const offset = ((vc - (rect.top + rect.height/2)) / window.innerHeight) * 18;
      card.style.setProperty("--parallax-offset", `${offset}px`);
    });
  }
  window.addEventListener("scroll", () => {
    if (!cardTicking) {
      requestAnimationFrame(() => { updateCardParallax(); cardTicking = false; });
      cardTicking = true;
    }
  }, { passive: true });
  updateCardParallax();

  // ============================================================
  // DYNAMIC CONSTELLATION CANVAS
  // ============================================================
  const cc = document.getElementById("constellationCanvas");
  if (!cc) return;

  const cx = cc.getContext("2d");

  // 5 real constellations, normalized 0-1 coords, each star labeled with a skill
  // Stars: [nx, ny, skillLabel]
  const CONSTELLATIONS = [
    {
      name: "Orion",
      stars: [
        [0.42, 0.10, "JavaScript"], // Betelgeuse
        [0.70, 0.13, "React"],      // Bellatrix
        [0.35, 0.42, "HTML"],       // Mintaka
        [0.50, 0.44, "CSS"],        // Alnilam
        [0.65, 0.42, "PHP"],        // Alnitak
        [0.30, 0.70, "Python"],     // Saiph
        [0.72, 0.68, "SQL"],        // Rigel
        [0.20, 0.28, "Java"],       // shoulder
        [0.82, 0.24, "Figma"],      // shoulder
        [0.50, 0.82, "R"],          // base
      ],
      edges: [[0,2],[0,1],[1,8],[2,3],[3,4],[4,8],[2,7],[5,3],[4,6],[5,9],[6,9]],
    },
    {
      name: "Cassiopeia",
      stars: [
        [0.12, 0.52, "HTML"],   // α Cas
        [0.28, 0.24, "CSS"],    // β Cas
        [0.50, 0.48, "JavaScript"], // γ Cas
        [0.70, 0.20, "React"],  // δ Cas
        [0.88, 0.44, "PHP"],    // ε Cas
        [0.22, 0.76, "Python"],
        [0.50, 0.78, "SQL"],
        [0.76, 0.74, "Java"],
        [0.38, 0.14, "Figma"],
        [0.62, 0.88, "R"],
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[1,8],[8,3],[6,9]],
    },
    {
      name: "Ursa Major",
      stars: [
        [0.18, 0.32, "Python"],  // Dubhe
        [0.28, 0.22, "SQL"],     // Merak
        [0.42, 0.24, "Java"],    // Phecda
        [0.52, 0.34, "R"],       // Megrez
        [0.62, 0.26, "Figma"],   // Alioth
        [0.72, 0.20, "HTML"],    // Mizar
        [0.86, 0.16, "CSS"],     // Alkaid (end of handle)
        [0.10, 0.50, "JavaScript"],
        [0.36, 0.60, "React"],
        [0.60, 0.65, "PHP"],
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,7],[2,8],[4,9],[0,3]],
    },
    {
      name: "Leo",
      stars: [
        [0.52, 0.10, "React"],   // Regulus
        [0.34, 0.18, "HTML"],    // η Leo
        [0.20, 0.34, "CSS"],     // γ Leo
        [0.24, 0.52, "JavaScript"], // ζ Leo
        [0.40, 0.62, "PHP"],     // μ Leo
        [0.58, 0.56, "Python"],  // ε Leo
        [0.72, 0.32, "SQL"],     // δ Leo
        [0.82, 0.16, "Java"],    // β Leo (Denebola)
        [0.50, 0.78, "Figma"],
        [0.72, 0.74, "R"],
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[5,6],[6,7],[7,0],[4,8],[8,9],[9,5]],
    },
    {
      name: "Scorpius",
      stars: [
        [0.42, 0.10, "SQL"],    // Antares
        [0.26, 0.20, "Python"], // σ Sco
        [0.58, 0.18, "Java"],   // τ Sco
        [0.20, 0.38, "R"],      // α neck
        [0.50, 0.36, "Figma"],  // centre
        [0.74, 0.32, "HTML"],   // right
        [0.30, 0.56, "CSS"],    // body curve
        [0.52, 0.60, "JavaScript"], // lower body
        [0.38, 0.76, "React"],  // tail
        [0.50, 0.90, "PHP"],    // stinger
      ],
      edges: [[0,1],[0,2],[1,3],[2,5],[0,4],[4,3],[4,5],[3,6],[6,7],[7,8],[8,9],[4,7]],
    },
  ];

  const NODE_COUNT = 10;
  const HOLD_MS  = 1000;
  const MORPH_MS = 2400;

  let cW = cc.offsetWidth  || 600;
  let cH = cc.offsetHeight || 480;

  function ccResize() {
    cW = cc.offsetWidth  || 600;
    cH = cc.offsetHeight || 480;
    const dpr = window.devicePixelRatio || 1;
    cc.width  = Math.round(cW * dpr);
    cc.height = Math.round(cH * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Convert normalized [0-1] to canvas px with padding
  function toPx(nx, ny) {
    const px = 0.09, py = 0.09;
    return {
      x: px * cW + nx * cW * (1 - px * 2),
      y: py * cH + ny * cH * (1 - py * 2),
    };
  }

  // Per-star twinkle state (10 stars, persistent across morphs)
  const twinkles = Array.from({ length: NODE_COUNT }, () => ({
    opacity: 0.5 + Math.random() * 0.5,
    target:  0.5 + Math.random() * 0.5,
    speed:   0.006 + Math.random() * 0.014,
    pulse:   Math.random(),
    pulseDir: Math.random() < 0.5 ? 1 : -1,
    pulseSpeed: 0.007 + Math.random() * 0.013,
  }));

  function updateTwinkle(tw) {
    if (Math.abs(tw.opacity - tw.target) < 0.02)
      tw.target = 0.35 + Math.random() * 0.65;
    tw.opacity += (tw.target - tw.opacity) * tw.speed;
    tw.pulse   += tw.pulseDir * tw.pulseSpeed;
    if (tw.pulse >= 1) { tw.pulse = 1; tw.pulseDir = -1; }
    if (tw.pulse <= 0) { tw.pulse = 0; tw.pulseDir =  1; }
  }

  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  // idxCurrent = fully visible constellation, idxNext = one we're morphing toward
  let idxCurrent = 0;
  let idxNext    = 1;
  let morphT     = 0;      // always 0 during hold, rises 0→1 during morph
  let phase      = "hold"; // "hold" | "morph"
  let phaseStart = performance.now() + HOLD_MS; // delay first morph by HOLD_MS
  let nameAlpha  = 0;

  let mouseX = 0.5, mouseY = 0.5;
  window.addEventListener("mousemove", e => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  });

  function drawStar(x, y, tw) {
    const r    = 3.5 + tw.pulse * 2.5;
    const glow = 13 + tw.pulse * 17;
    const g = cx.createRadialGradient(x, y, 0, x, y, glow);
    g.addColorStop(0, `rgba(198,160,255,${tw.opacity * 0.5})`);
    g.addColorStop(1, "rgba(198,160,255,0)");
    cx.beginPath(); cx.arc(x, y, glow, 0, Math.PI * 2);
    cx.fillStyle = g; cx.fill();
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(255,255,255,${tw.opacity})`; cx.fill();
  }

  function drawLabel(x, y, text, alpha, tw) {
    const fontSize = Math.max(11, Math.min(cW * 0.028, 18));
    cx.font = `600 ${fontSize}px "Quicksand", sans-serif`;
    cx.textAlign = "center";
    // flip label below if near top edge
    const ly = y < cH * 0.18 ? y + fontSize + 12 : y - 14 - tw.pulse * 3;
    cx.fillStyle = `rgba(255,255,255,${alpha * (0.55 + tw.opacity * 0.38)})`;
    cx.fillText(text, x, ly);
  }

  function drawEdge(x1, y1, x2, y2, alpha) {
    if (alpha < 0.005) return;
    cx.beginPath();
    cx.moveTo(x1, y1); cx.lineTo(x2, y2);
    cx.strokeStyle = `rgba(198,160,255,${alpha})`;
    cx.lineWidth = 1.5;
    cx.stroke();
  }

  function ccTick(now) {
    requestAnimationFrame(ccTick);

    const elapsed = now - phaseStart;

    if (phase === "hold") {
      // Fully showing idxCurrent — wait HOLD_MS then start morph
      morphT = 0;
      nameAlpha = 0;
      if (elapsed >= HOLD_MS) {
        phase      = "morph";
        phaseStart = now;
      }
    } else {
      // Morphing idxCurrent → idxNext
      morphT = Math.min(elapsed / MORPH_MS, 1);

      // Name fades in mid-morph, fades out near end
      if      (morphT < 0.25) nameAlpha = Math.max(0, nameAlpha - 0.04);
      else if (morphT < 0.55) nameAlpha = Math.min(1, nameAlpha + 0.05);
      else                    nameAlpha = Math.max(0, nameAlpha - 0.03);

      if (morphT >= 1) {
        // Arrived — snap current to next, pick new next, start hold
        idxCurrent = idxNext;
        idxNext    = (idxNext + 1) % CONSTELLATIONS.length;
        morphT     = 0;
        nameAlpha  = 0;
        phase      = "hold";
        phaseStart = now;
      }
    }

    const e  = easeInOut(morphT);
    const cA = CONSTELLATIONS[idxCurrent];
    const cB = CONSTELLATIONS[idxNext];

    const driftX = (mouseX - 0.5) * 14;
    const driftY = (mouseY - 0.5) * 9;

    cx.clearRect(0, 0, cW, cH);
    cx.save();
    cx.translate(driftX, driftY);

    // Lerped star positions
    const pos = Array.from({ length: NODE_COUNT }, (_, i) => {
      const pA = toPx(cA.stars[i][0], cA.stars[i][1]);
      const pB = toPx(cB.stars[i][0], cB.stars[i][1]);
      return { x: pA.x + (pB.x - pA.x) * e, y: pA.y + (pB.y - pA.y) * e };
    });

    // Edges: A fades out, B fades in
    cA.edges.forEach(([i, j]) => drawEdge(pos[i].x, pos[i].y, pos[j].x, pos[j].y, (1 - e) * 0.52));
    cB.edges.forEach(([i, j]) => drawEdge(pos[i].x, pos[i].y, pos[j].x, pos[j].y,       e * 0.52));

    // Stars + cross-fading labels
    for (let i = 0; i < NODE_COUNT; i++) {
      updateTwinkle(twinkles[i]);
      drawStar(pos[i].x, pos[i].y, twinkles[i]);
      if (1 - e > 0.01) drawLabel(pos[i].x, pos[i].y, cA.stars[i][2], 1 - e, twinkles[i]);
      if (      e > 0.01) drawLabel(pos[i].x, pos[i].y, cB.stars[i][2],     e, twinkles[i]);
    }

    // Incoming constellation name
    if (nameAlpha > 0.01) {
      const fontSize = Math.max(12, cW * 0.032);
      cx.font = `600 ${fontSize}px "Quicksand", sans-serif`;
      cx.textAlign = "center";
      cx.fillStyle = `rgba(198,160,255,${nameAlpha * 0.75})`;
      cx.fillText(cB.name, cW * 0.5, cH * 0.95);
    }

    cx.restore();
  }

  ccResize();
  window.addEventListener("resize", ccResize);
  requestAnimationFrame(ccTick);

});