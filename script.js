/* ============================================
   PORTFOLIO JAVASCRIPT
   Enhanced with modern interactions and utilities
   ============================================ */

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  initializeTypingEffect();
  updateYearInFooter();
  setupMobileMenu();
  setupSmoothScroll();
  setupScrollAnimations();
  setupButtonAnimations();
});

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
  const typeSpeed = isDeleting ? 50 : 100;
  const deleteSpeed = 50;
  const pauseTime = 1500;

  function type() {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      // Deleting
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
      // Typing
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

  // Close menu when a link is clicked
  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("header")) {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Expose toggleMobileMenu to global scope for onclick attribute
window.toggleMobileMenu = function() {
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
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe project cards and sections
  document.querySelectorAll(".project-card, .section").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });

  // Stagger animation for skill items
  const skills = document.querySelectorAll(".skill");
  skills.forEach((skill, index) => {
    skill.style.opacity = "0";
    skill.style.transform = "translateY(10px)";
    skill.style.transition = `opacity 0.6s ease-out ${index * 50}ms, transform 0.6s ease-out ${index * 50}ms`;
    observer.observe(skill);
  });
}

// ========== BUTTON ANIMATIONS ==========
function setupButtonAnimations() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// ========== UTILITY FUNCTIONS ==========

// Debounce function for scroll events
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

// Check if element is in viewport
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

// ========== PERFORMANCE OPTIMIZATION ==========
// Lazy load images if needed in the future
if ("IntersectionObserver" in window) {
  // Intersection Observer is supported
} else {
  // Fallback for older browsers
  console.warn("IntersectionObserver is not supported");
}