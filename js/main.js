/* ============================================
   Flash Kids — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- STICKY HEADER ----------
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- MOBILE MENU ----------
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    nav.classList.toggle('is-open');
    document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close menu on link click
  nav.querySelectorAll('.fk-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-active');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // ---------- ACTIVE NAV LINK ----------
  const sections = document.querySelectorAll('.fk-section, .fk-hero');
  const navLinks = document.querySelectorAll('.fk-nav__link');

  const activateLink = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });

  // ---------- SCROLL ANIMATIONS ----------
  const animateEls = document.querySelectorAll('.fk-animate');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.fk-animate'));
        const index = siblings.indexOf(entry.target);
        const delay = index * 100;

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateEls.forEach(el => observer.observe(el));

  // ---------- REVIEWS CAROUSEL ----------
  const track = document.querySelector('.fk-reviews__track');
  const cards = document.querySelectorAll('.fk-review-card');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsContainer = document.getElementById('reviewDots');
  let currentSlide = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('fk-reviews__dot');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.fk-reviews__dot');

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide > 0 ? currentSlide - 1 : cards.length - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide < cards.length - 1 ? currentSlide + 1 : 0);
  });

  // Auto-advance every 5 seconds
  let autoPlay = setInterval(() => {
    goToSlide(currentSlide < cards.length - 1 ? currentSlide + 1 : 0);
  }, 5000);

  // Pause on hover
  const carousel = document.getElementById('reviewsCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      goToSlide(currentSlide < cards.length - 1 ? currentSlide + 1 : 0);
    }, 5000);
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlide < cards.length - 1 ? currentSlide + 1 : 0);
      } else {
        goToSlide(currentSlide > 0 ? currentSlide - 1 : cards.length - 1);
      }
    }
  }, { passive: true });

  // ---------- CONTACT FORM ----------
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const parentName = form.parentName.value.trim();
    const phone = form.phone.value.trim();

    if (!parentName || !phone) return;

    // Show success message (no backend yet)
    formSuccess.classList.add('is-visible');
    form.reset();

    setTimeout(() => {
      formSuccess.classList.remove('is-visible');
    }, 5000);
  });

});
