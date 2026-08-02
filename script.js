/* ============================================
   PORTFOLIO ANIMATION ENGINE
   Loader, scroll progress, custom cursor,
   magnetic buttons, 3D tilt, reveals, counters,
   scroll-aware navbar. Respects reduced motion.
   ============================================ */

"use strict";

// Flag JS availability — gates reveal/entrance animations via CSS (html.js ...)
document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none)").matches;

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  initializeLoader();
  initializeTypingEffect();
  updateYearInFooter();
  setupMobileMenu();
  setupSmoothScroll();
  setupScrollReveals();
  setupScrollProgress();
  setupScrollAwareHeader();
  setupCounters();
  setupButtonRipple();
  setupMagneticButtons();
  setupProjectTilt();
  setupHeroParallax();
  setupParticles();
  setupCursorGlow();
  setupCustomCursor();

  // Mark page ready
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
});

// ========== PAGE LOADER ==========
function initializeLoader() {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 350);
  });

  // Fallback: never let the loader trap the user
  setTimeout(() => loader.classList.add("is-hidden"), 4000);
}

// ========== TYPING EFFECT ==========
function initializeTypingEffect() {
  const typingElement = document.getElementById("typing");
  if (!typingElement) return;

  const words = [
    "Web Developer 💻",
    "Frontend Specialist ⚡",
    "Full-Stack Developer 🚀",
    "Tech Enthusiast 🎯"
  ];

  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseTime = 1500;

  function type() {
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      currentCharIndex--;
      typingElement.textContent = currentWord.substring(0, currentCharIndex);

      if (currentCharIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, deleteSpeed);
    } else {
      currentCharIndex++;
      typingElement.textContent = currentWord.substring(0, currentCharIndex);

      if (currentCharIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
      setTimeout(type, typeSpeed);
    }
  }

  type();
}

// ========== YEAR AUTO-UPDATE IN FOOTER ==========
function updateYearInFooter() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ========== MOBILE MENU TOGGLE ==========
function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("header")) {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Expose toggleMobileMenu to global scope for onclick attribute
window.toggleMobileMenu = function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  }
};

// ========== SMOOTH SCROLL BEHAVIOR ==========
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });
}

// ========== SCROLL REVEALS (IntersectionObserver) ==========
function setupScrollReveals() {
  if (prefersReducedMotion) return;

  const revealItems = document.querySelectorAll("[data-reveal]");

  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach((el, index) => {
    // Optional stagger via inline data-delay
    const delay = el.dataset.delay || (index % 5) * 60;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(el);
  });
}

// ========== SCROLL PROGRESS BAR ==========
function setupScrollProgress() {
  if (prefersReducedMotion) return;

  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

// ========== SCROLL-AWARE HEADER + ACTIVE LINK ==========
function setupScrollAwareHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  const updateHeader = () => {
    if (window.pageYOffset > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Highlight the current page's nav link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("is-active");
    } else if (href === "#home" && currentPath === "index.html") {
      link.classList.add("is-active");
    }
  });
}

// ========== ANIMATED COUNTERS ==========
function setupCounters() {
  if (prefersReducedMotion) return;

  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

// ========== BUTTON RIPPLE EFFECT ==========
function setupButtonRipple() {
  if (isTouchDevice) return;
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointerdown", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// ========== MAGNETIC BUTTONS ==========
function setupMagneticButtons() {
  if (prefersReducedMotion || isTouchDevice) return;

  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.35;

    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "translate(0, 0)";
      setTimeout(() => {
        el.style.transition = "";
      }, 400);
    });
  });
}

// ========== 3D PROJECT CARD TILT ==========
function setupProjectTilt() {
  if (prefersReducedMotion || isTouchDevice) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    const maxTilt = 8;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        perspective(1200px)
        rotateY(${px * maxTilt}deg)
        rotateX(${py * -maxTilt}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0)";
      setTimeout(() => {
        card.style.transition = "";
      }, 600);
    });
  });
}

// ========== HERO PARALLAX (mouse-reactive) ==========
function setupHeroParallax() {
  if (prefersReducedMotion || isTouchDevice) return;

  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Animate the containers (not individual chips/shapes) to
  // avoid overriding their CSS float animations.
  const chips = hero.querySelector(".hero-chips");
  const shapes = document.querySelector(".bg-fx__shapes");

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (chips) {
      chips.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
    }
    if (shapes) {
      shapes.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    }
  });

  hero.addEventListener("pointerleave", () => {
    if (chips) {
      chips.style.transition = "transform 0.6s ease";
      chips.style.transform = "";
      setTimeout(() => (chips.style.transition = ""), 600);
    }
    if (shapes) {
      shapes.style.transition = "transform 0.6s ease";
      shapes.style.transform = "";
      setTimeout(() => (shapes.style.transition = ""), 600);
    }
  });
}

// ========== FLOATING PARTICLES ==========
function setupParticles() {
  if (prefersReducedMotion) return;

  const container = document.querySelector(".bg-fx");
  if (!container) return;

  const particleLayer = container.querySelector(".bg-fx__particles");
  if (!particleLayer) return;

  const count = isTouchDevice ? 14 : 26;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "bg-fx__particle";
    const size = Math.random() * 3 + 1.5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.opacity = Math.random() * 0.5 + 0.15;
    dot.style.animationDuration = `${Math.random() * 12 + 8}s`;
    dot.style.animationDelay = `${Math.random() * -12}s`;
    fragment.appendChild(dot);
  }

  particleLayer.appendChild(fragment);
}

// ========== MOUSE-REACTIVE CURSOR GLOW ==========
function setupCursorGlow() {
  if (isTouchDevice) return;

  const glow = document.querySelector(".bg-fx__cursor-glow");
  if (!glow) return;

  window.addEventListener("pointermove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.classList.add("is-visible");
  });

  window.addEventListener("pointerleave", () => {
    glow.classList.remove("is-visible");
  });
}

// ========== CUSTOM CURSOR ==========
function setupCustomCursor() {
  if (prefersReducedMotion || isTouchDevice) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId = null;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

    // Reveal cursor elements on first interaction
    dot.classList.add("is-visible");
    ring.classList.add("is-visible");

    if (!rafId) {
      rafId = requestAnimationFrame(animateRing);
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    rafId = null;
  }

  // Enlarge ring over interactive elements
  document.querySelectorAll("a, button, .btn, .skill, .project-card").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("is-hovering"));
    el.addEventListener("pointerleave", () => ring.classList.remove("is-hovering"));
  });

  // Hide native cursor highlight interaction
  document.addEventListener("pointerdown", () => ring.classList.add("is-hovering"));
  document.addEventListener("pointerup", () => ring.classList.remove("is-hovering"));
}

// ========== UTILITY FUNCTIONS ==========

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ========== ERROR HANDLING ==========
window.addEventListener("error", (event) => {
  console.error("Error:", event.error);
});

// ========== PERFORMANCE NOTE ==========
// All scroll-driven work uses requestAnimationFrame + passive listeners.
// On touch / reduced-motion devices, heavy effects are skipped.

