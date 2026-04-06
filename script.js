document.addEventListener("DOMContentLoaded", () => {

  // ====================== STARFIELD CANVAS ======================
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");

  let W, H, stars = [];
  const STAR_COUNT = 260;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function makeStar() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(0.4, 2.2),
      vx: randomBetween(-0.06, 0.06),
      vy: randomBetween(-0.08, 0.02),
      opacity: randomBetween(0.3, 1),
      opacityTarget: randomBetween(0.3, 1),
      opacitySpeed: randomBetween(0.003, 0.012),
      hue: Math.random() < 0.5 ? null : (Math.random() < 0.5 ? "220" : "270"),
    };
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar());
  }

  function drawStar(s) {
    const color = s.hue
      ? `hsla(${s.hue}, 80%, 85%, ${s.opacity})`
      : `rgba(255,255,255,${s.opacity})`;

    // soft glow
    const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
    grd.addColorStop(0, color);
    grd.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // crisp core
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function updateStar(s) {
    s.x += s.vx;
    s.y += s.vy;

    if (s.x < -5) s.x = W + 5;
    if (s.x > W + 5) s.x = -5;
    if (s.y < -5) s.y = H + 5;
    if (s.y > H + 5) s.y = -5;

    if (Math.abs(s.opacity - s.opacityTarget) < 0.01) {
      s.opacityTarget = randomBetween(0.2, 1);
    }
    s.opacity += (s.opacityTarget - s.opacity) * s.opacitySpeed;
  }

  function drawBackground() {
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
    grad.addColorStop(0, "#1a063a");
    grad.addColorStop(0.5, "#0d0520");
    grad.addColorStop(1, "#060110");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    stars.forEach(s => {
      updateStar(s);
      drawStar(s);
    });
    requestAnimationFrame(tick);
  }

  resizeCanvas();
  initStars();
  tick();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initStars();
  });

  // ====================== LOADING SCREEN ======================
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => loadingScreen.remove(), 900);
    }, 3600);
  }

  // ====================== ROTATING TEXT ======================
  const phrases = [
    "Software Developer",
    "Frontend Engineer",
    "Data Scientist",
    "UX Designer",
    "Music Producer"
  ];
  let index = 0;
  const textElement = document.getElementById("rotating-text");

  function rotateText() {
    if (!textElement) return;
    textElement.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % phrases.length;
      textElement.textContent = phrases[index];
      textElement.style.opacity = 1;
    }, 800);
  }
  setInterval(rotateText, 3000);

  // ====================== NAV TOGGLE ======================
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

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

  // ====================== SCROLL REVEAL ======================
  const titles = document.querySelectorAll("section h2, .intro-title");
  titles.forEach(title => title.classList.add("fade-title"));

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  titles.forEach(title => titleObserver.observe(title));

  // ====================== PROJECT PARALLAX ======================
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  let cardTicking = false;

  const updateCardParallax = () => {
    if (window.innerWidth < 700) return;
    const viewportCenter = window.innerHeight / 2;
    projectCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceRatio = (viewportCenter - cardCenter) / window.innerHeight;
      const offset = distanceRatio * 18;
      card.style.setProperty("--parallax-offset", `${offset}px`);
    });
  };

  const handleCardScroll = () => {
    if (!cardTicking) {
      requestAnimationFrame(() => {
        updateCardParallax();
        cardTicking = false;
      });
      cardTicking = true;
    }
  };

  window.addEventListener("scroll", handleCardScroll, { passive: true });
  updateCardParallax();

  // ====================== CONSTELLATION MOUSE PARALLAX ======================
  const constellationSvg = document.querySelector(".constellation-svg");
  if (constellationSvg && !("ontouchstart" in window)) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    const animateConstellations = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      constellationSvg.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.25)`;
      requestAnimationFrame(animateConstellations);
    };

    window.addEventListener("mousemove", (event) => {
      const percentX = event.clientX / window.innerWidth - 0.5;
      const percentY = event.clientY / window.innerHeight - 0.5;
      targetX = percentX * 22;
      targetY = percentY * 16;
    });

    animateConstellations();
  }

});