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
