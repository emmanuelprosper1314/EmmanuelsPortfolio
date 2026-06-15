document.addEventListener("DOMContentLoaded", () => {

  const typingElement = document.getElementById("typing");

  if (!typingElement) return;

  const words = [
    "Web Developer 💻",
    "Frontend Developer ⚡",
    "Tech Enthusiast 🚀"
  ];

  let i = 0;
  let j = 0;
  let deleting = false;

  function type() {
    const current = words[i];

    typingElement.textContent = deleting
      ? current.substring(0, j--)
      : current.substring(0, j++);

    if (!deleting && j === current.length) {
      deleting = true;
      setTimeout(type, 1000);
      return;
    }

    if (deleting && j === 0) {
      deleting = false;
      i = (i + 1) % words.length;
    }

    setTimeout(type, deleting ? 60 : 120);
  }

  type();
});