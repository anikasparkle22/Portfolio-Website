
  const phrases = [
    "Software Developer",
    "Frontend Engineer",
    "Data Scientist",
    "UX Designer"
  ];

  let index = 0;
  const textElement = document.getElementById("rotating-text");

  function rotateText() {
    textElement.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % phrases.length;
      textElement.textContent = phrases[index];
      textElement.style.opacity = 1;
    }, 800);
  }

  setInterval(rotateText, 3000);

  function scrollProjects() {
  document.getElementById("projectsScroll").scrollBy({
    left: 420,
    behavior: "smooth"
  });
}