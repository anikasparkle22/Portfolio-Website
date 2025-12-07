document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // LOADING SCREEN FADE OUT
  // -----------------------------
  const loadingScreen = document.getElementById("loading-screen");

  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");

      setTimeout(() => {
        loadingScreen.remove();
      }, 900);
    }, 3600);
  }

  // -----------------------------
  // ROTATING TEXT
  // -----------------------------
  const phrases = [
    "Software Developer",
    "Frontend Engineer",
    "Data Scientist",
    "UX Designer"
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
});

// -----------------------------
// PROJECT SCROLL BUTTON
// -----------------------------
function scrollProjects() {
  const scrollContainer = document.getElementById("projectsScroll");

  if (!scrollContainer) return;

  scrollContainer.scrollBy({
    left: 420,
    behavior: "smooth"
  });
}

 // -----------------------------
  // TITLE FADE-IN ON SCROLL
  // -----------------------------
  const titles = document.querySelectorAll("section h2, .intro-title");

  titles.forEach((title) => title.classList.add("fade-title"));

  const titleObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  titles.forEach((title) => titleObserver.observe(title));

  // -----------------------------
  // PROJECT CARD PARALLAX
  // -----------------------------
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  let cardTicking = false;

  const updateCardParallax = () => {
    const viewportCenter = window.innerHeight / 2;

    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceRatio = (viewportCenter - cardCenter) / window.innerHeight;
      const offset = distanceRatio * 18; // subtle drift
      card.style.setProperty("--parallax-offset", `${offset}px`);
    });
  };

  const handleCardScroll = () => {
    if (!cardTicking) {
      window.requestAnimationFrame(() => {
        updateCardParallax();
        cardTicking = false;
      });
      cardTicking = true;
    }
  };

  updateCardParallax();
  window.addEventListener("scroll", handleCardScroll, { passive: true });

  // -----------------------------
  // CONSTELLATION PARALLAX DRIFT
  // -----------------------------
  const constellationSvg = document.querySelector(".constellation-svg");

  if (constellationSvg) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

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