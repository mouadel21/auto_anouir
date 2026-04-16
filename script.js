/* ===========================
   AUTO ÉCOLE ANOUAR — SCRIPT
   =========================== */

// ---- AOS Init ----
AOS.init({ duration: 700, once: true, offset: 80 });

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 300);
});

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.querySelector('i').className = mobileMenu.classList.contains('open')
    ? 'ri-close-line' : 'ri-menu-3-line';
});
// Close on nav link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelector('i').className = 'ri-menu-3-line';
  });
});

// ---- LANGUAGE TOGGLE ----
let currentLang = 'fr';
const langToggle = document.getElementById('langToggle');

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Toggle button display
  document.querySelector('.lang-fr').style.display = lang === 'fr' ? 'inline' : 'none';
  document.querySelector('.lang-ar').style.display = lang === 'ar' ? 'inline' : 'none';

  // Update all data-fr / data-ar elements
  document.querySelectorAll('[data-fr]').forEach(el => {
    const key = lang === 'ar' ? 'ar' : 'fr';
    if (el.dataset[key]) el.textContent = el.dataset[key];
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-fr]').forEach(el => {
    const key = lang === 'ar' ? 'placeholderAr' : 'placeholderFr';
    if (el.dataset[key]) el.placeholder = el.dataset[key];
  });
}

langToggle.addEventListener('click', () => applyLanguage(currentLang === 'fr' ? 'ar' : 'fr'));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}

const counters = document.querySelectorAll('.stat-card');
let counted = false;

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      counters.forEach(card => {
        const target = parseInt(card.dataset.count);
        const el = card.querySelector('.counter');
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.3 });

if (document.querySelector('.why-stats')) {
  counterObserver.observe(document.querySelector('.why-stats'));
}

// ---- TESTIMONIALS SLIDER ----
const track = document.getElementById('testimonialTrack');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
const total = cards.length;

// Create dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  currentSlide = (index + total) % total;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('nextBtn').addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto slide
let sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 4500);
document.getElementById('testimonialsSlider').addEventListener('mouseenter', () => clearInterval(sliderInterval));
document.getElementById('testimonialsSlider').addEventListener('mouseleave', () => {
  sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 4500);
});

// Swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
});

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !phone || !email || !message) {
    showFormMsg(currentLang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Veuillez remplir tous les champs.', 'error');
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'flex';
  formMsg.style.display = 'none';

  try {
    const response = await fetch('http://localhost:3000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, message })
    });

    const data = await response.json();

    if (response.ok) {
      showFormMsg(
        currentLang === 'ar'
          ? '✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
          : '✅ Message envoyé avec succès ! Nous vous contacterons bientôt.',
        'success'
      );
      form.reset();
    } else {
      throw new Error(data.message || 'Erreur serveur');
    }
  } catch (err) {
    showFormMsg(
      currentLang === 'ar'
        ? '❌ حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو الاتصال عبر WhatsApp.'
        : '❌ Erreur lors de l\'envoi. Veuillez réessayer ou contacter via WhatsApp.',
      'error'
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display = 'inline';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
  }
});

function showFormMsg(msg, type) {
  formMsg.textContent = msg;
  formMsg.className = 'form-message ' + type;
  formMsg.style.display = 'block';
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- SCROLL TO TOP ----
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SMOOTH SCROLL for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
