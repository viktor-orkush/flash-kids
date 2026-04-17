/* ============================================
   Flash Kids — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- STICKY HEADER ----------
  const header = document.getElementById('header');
  let tickingHeader = false;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50);
    tickingHeader = false;
  };

  window.addEventListener('scroll', () => {
    if (!tickingHeader) {
      window.requestAnimationFrame(onScroll);
      tickingHeader = true;
    }
  }, { passive: true });
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

  let tickingNav = false;
  window.addEventListener('scroll', () => {
    if (!tickingNav) {
      window.requestAnimationFrame(() => {
        activateLink();
        tickingNav = false;
      });
      tickingNav = true;
    }
  }, { passive: true });

  // ---------- SCROLL PROGRESS BAR ----------
  const scrollProgress = document.getElementById('scrollProgress');

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

  // ---------- ANIMATED COUNTERS ----------
  const statNums = document.querySelectorAll('.fk-hero__stat-num[data-target]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const isDecimal = String(target).includes('.');
    const duration = 1500;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = easedProgress * target;

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Start counters after hero fadeIn
  setTimeout(() => {
    statNums.forEach(el => animateCounter(el));
  }, 500);

  // ---------- PARALLAX + MOUSE FOLLOW HERO SHAPES ----------
  const heroShapes = document.querySelectorAll('.fk-hero__shape[data-speed]');
  let mouseX = 0, mouseY = 0;
  const isHoverDevice = window.matchMedia('(hover: hover)').matches;

  if (isHoverDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // ---------- WORD-BY-WORD TITLE REVEAL ----------
  const sectionTitles = document.querySelectorAll('.fk-section__title');

  sectionTitles.forEach(title => {
    const text = title.textContent.trim();
    const words = text.split(/\s+/);
    title.innerHTML = words.map((word, i) =>
      `<span class="fk-word-mask"><span class="fk-word" style="transition-delay:${i * 80}ms">${word}</span></span>`
    ).join(' ');
  });

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fk-title-revealed');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  sectionTitles.forEach(title => titleObserver.observe(title));

  // ---------- 3D TILT ON PROGRAM CARDS ----------
  if (isHoverDevice) {
    const programCards = document.querySelectorAll('.fk-program-card');
    programCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 32px rgba(0,0,0,0.12)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // ---------- CURSOR SPARKLE TRAIL ----------
  if (window.matchMedia('(pointer: fine)').matches) {
    const sparkleChars = ['✦', '✧', '★', '⭐', '✨'];
    const sparkleColors = ['#FFD234', '#3A7BD5', '#FFB020', '#FF6B6B', '#FFECA0'];
    let sparkleCount = 0;
    let lastSparkle = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSparkle < 60 || sparkleCount > 18) return;
      lastSparkle = now;

      const spark = document.createElement('div');
      spark.className = 'fk-sparkle';
      spark.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      spark.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      spark.style.setProperty('--sx', (Math.random() - 0.5) * 20 + 'px');
      spark.style.fontSize = (10 + Math.random() * 10) + 'px';
      document.body.appendChild(spark);
      sparkleCount++;

      spark.addEventListener('animationend', () => {
        spark.remove();
        sparkleCount--;
      });
    }, { passive: true });
  }

  // ---------- STEP CONNECTOR ANIMATION ----------
  const stepConnector = document.getElementById('stepConnector');
  if (stepConnector) {
    const connectorPath = stepConnector.querySelector('path');
    const pathLength = connectorPath.getTotalLength();
    stepConnector.style.setProperty('--path-length', pathLength);
    connectorPath.style.strokeDasharray = pathLength;
    connectorPath.style.strokeDashoffset = pathLength;

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stepConnector.classList.add('is-drawn');
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    stepObserver.observe(stepConnector);
  }

  // ---------- WAVY DIVIDER MORPH ON SCROLL ----------
  const wavePaths = document.querySelectorAll('.fk-wave-path');

  // ---------- PRICING CARD SPOTLIGHT ----------
  if (isHoverDevice) {
    const priceCards = document.querySelectorAll('.fk-price-card');
    priceCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ---------- COMBINED SCROLL HANDLER ----------
  let tickingScroll = false;
  window.addEventListener('scroll', () => {
    if (!tickingScroll) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Scroll progress bar
        if (scrollProgress) {
          scrollProgress.style.transform = `scaleX(${docHeight > 0 ? scrollY / docHeight : 0})`;
        }

        // Parallax hero shapes
        heroShapes.forEach(shape => {
          const speed = parseFloat(shape.dataset.speed);
          let tx = 0, ty = scrollY * speed * 0.3;
          if (isHoverDevice) {
            tx += mouseX * 15 * speed;
            ty += mouseY * 10 * speed;
          }
          shape.style.transform = `translate(${tx}px, ${ty}px)`;
        });

        tickingScroll = false;
      });
      tickingScroll = true;
    }
  }, { passive: true });

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


  // ---------- GIFT MODAL ----------
  const giftBtn = document.getElementById('heroGiftBtn');
  const giftModal = document.getElementById('giftModal');
  const giftModalOverlay = document.getElementById('giftModalOverlay');
  const giftModalClose = document.getElementById('giftModalClose');

  function openGiftModal() {
    giftModal.classList.add('is-open');
    giftModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGiftModal() {
    giftModal.classList.remove('is-open');
    giftModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  giftBtn.addEventListener('click', openGiftModal);
  giftModalOverlay.addEventListener('click', closeGiftModal);
  giftModalClose.addEventListener('click', closeGiftModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && giftModal.classList.contains('is-open')) {
      closeGiftModal();
    }
  });

  // ---------- CONFETTI BURST ----------
  (function confettiBurst() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FFD234', '#3A7BD5', '#FF6B6B', '#FF8C00', '#7B2FBE', '#2AABEE'];
    const particles = [];
    const count = 100;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        w: 4 + Math.random() * 6,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        round: Math.random() > 0.5,
      });
    }

    let frame = 0;
    const maxFrames = 200;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        p.vy += 0.12;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.015;
        }
        if (p.opacity <= 0) continue;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      frame++;
      if (alive && frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        window.removeEventListener('resize', resize);
      }
    }

    setTimeout(() => requestAnimationFrame(draw), 800);
  })();

  // ---------- FAQ ACCORDION ----------
  const faqItems = document.querySelectorAll('.fk-faq__item');

  faqItems.forEach(item => {
    const header = item.querySelector('.fk-faq__header');
    const content = item.querySelector('.fk-faq__content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');

      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          otherItem.querySelector('.fk-faq__content').style.maxHeight = null;
          otherItem.querySelector('.fk-faq__header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('is-active');
      const isExpanded = item.classList.contains('is-active');
      header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      if (isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // ---------- SOAP BUBBLES ON SCROLL ----------
  (function soapBubblesOnScroll() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let activeBubbles = 0;
    const maxBubbles = 8;
    let bubbleId = 0;
    let lastScrollY = window.scrollY;
    let scrollDelta = 0;

    function spawnBubble(fromX) {
      if (activeBubbles >= maxBubbles) return;

      const size = 20 + Math.random() * 50; // 20px to 70px
      const startX = fromX !== undefined
        ? fromX
        : (Math.random() * window.innerWidth);
      const startY = (70 + Math.random() * 30); // start from bottom 70-100vh
      const floatDuration = 5 + Math.random() * 5; // 5s to 10s
      const wobbleSpeed = 2 + Math.random() * 3; // 2s to 5s
      const shimmerSpeed = 3 + Math.random() * 4; // 3s to 7s
      const driftX = -40 + Math.random() * 80; // -40px to +40px
      const wobbleX = 5 + Math.random() * 15; // 5px to 20px
      const opacity = 0.4 + Math.random() * 0.35; // 0.4 to 0.75

      const bubble = document.createElement('div');
      bubble.className = 'fk-bubble';
      bubble.id = 'bubble-' + (++bubbleId);

      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.setProperty('--start-x', startX + 'px');
      bubble.style.setProperty('--start-y', startY + 'vh');
      bubble.style.setProperty('--float-duration', floatDuration + 's');
      bubble.style.setProperty('--wobble-speed', wobbleSpeed + 's');
      bubble.style.setProperty('--shimmer-speed', shimmerSpeed + 's');
      bubble.style.setProperty('--drift-x', driftX + 'px');
      bubble.style.setProperty('--wobble-x', wobbleX + 'px');
      bubble.style.setProperty('--bubble-size', (0.8 + Math.random() * 0.5).toFixed(2));
      bubble.style.setProperty('--bubble-opacity', opacity.toFixed(2));

      container.appendChild(bubble);
      activeBubbles++;

      // Start floating after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bubble.classList.add('is-floating');
        });
      });

      // Clean up after animation
      const cleanup = () => {
        if (bubble.parentNode) {
          bubble.remove();
          activeBubbles--;
        }
      };

      bubble.addEventListener('animationend', (e) => {
        if (e.animationName === 'bubbleFloat') {
          cleanup();
        }
      });

      // Safety cleanup
      setTimeout(cleanup, (floatDuration + 2) * 1000);
    }

    // Spawn a cluster of bubbles
    function spawnCluster(count) {
      const baseX = Math.random() * window.innerWidth;
      for (let i = 0; i < count; i++) {
        const delay = i * (200 + Math.random() * 400);
        const offsetX = baseX + (Math.random() - 0.5) * 300;
        setTimeout(() => spawnBubble(Math.max(0, Math.min(offsetX, window.innerWidth))), delay);
      }
    }

    // Section-triggered bubbles using IntersectionObserver
    const sectionEls = document.querySelectorAll('.fk-section');
    const bubbleTriggered = new Set();

    const bubbleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !bubbleTriggered.has(entry.target.id)) {
          bubbleTriggered.add(entry.target.id);
          // Spawn 2-4 bubbles in a cluster
          spawnCluster(2 + Math.floor(Math.random() * 3));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px'
    });

    sectionEls.forEach(section => bubbleObserver.observe(section));

    // Continuous gentle bubbles while scrolling
    let scrollSpawnTimeout = null;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      scrollDelta += Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;

      // Spawn a bubble every ~300px of scrolling
      if (scrollDelta > 300) {
        scrollDelta = 0;
        if (!scrollSpawnTimeout) {
          scrollSpawnTimeout = setTimeout(() => {
            spawnBubble();
            scrollSpawnTimeout = null;
          }, 100);
        }
      }
    }, { passive: true });

    // First bubble on initial scroll
    let firstBubbleDone = false;
    function onFirstScroll() {
      if (!firstBubbleDone && window.scrollY > 150) {
        firstBubbleDone = true;
        spawnCluster(3);
        window.removeEventListener('scroll', onFirstScroll);
      }
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true });
  })();

});
