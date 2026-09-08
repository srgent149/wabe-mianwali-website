document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile nav drawer ----
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const scrim = document.querySelector('.nav-scrim');
  const closeBtn = document.querySelector('.nav-close');

  function openNav() {
    nav && nav.classList.add('open');
    scrim && scrim.classList.add('open');
    toggle && toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    nav && nav.classList.remove('open');
    scrim && scrim.classList.remove('open');
    toggle && toggle.setAttribute('aria-expanded', 'false');
  }
  toggle && toggle.addEventListener('click', () => {
    nav && nav.classList.contains('open') ? closeNav() : openNav();
  });
  closeBtn && closeBtn.addEventListener('click', closeNav);
  scrim && scrim.addEventListener('click', closeNav);

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Faculty department filter ----
  const filterButtons = document.querySelectorAll('[data-faculty-filter]');
  const facultyCards = document.querySelectorAll('[data-faculty-department]');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const dept = btn.getAttribute('data-faculty-filter');
      facultyCards.forEach((card) => {
        const match = dept === 'all' || card.getAttribute('data-faculty-department') === dept;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  // ---- Print buttons ----
  document.querySelectorAll('[data-print]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  // ---- Academics: syllabus stage tabs ----
  document.querySelectorAll('.syllabus-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.syllabus-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-syllabus-tab');
      document.querySelectorAll('.syllabus-panel').forEach((p) => {
        p.style.display = p.getAttribute('data-syllabus-panel') === key ? '' : 'none';
      });
    });
  });

  // ---- Careers: pre-select job opening from "Apply for this Role" ----
  document.querySelectorAll('.apply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const select = document.getElementById('field-jobOpeningId');
      if (select) select.value = btn.getAttribute('data-job-id');
    });
  });

  // ---- Ad popups (admissions, careers, etc. -- show every visit; closeable) ----
  document.querySelectorAll('.admissions-popup-overlay').forEach((popup) => {
    const popupClose = popup.querySelector('.admissions-popup-close');
    if (!popupClose) return;
    const closePopup = () => {
      popup.hidden = true;
    };
    popupClose.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePopup();
    });
  });

  // ---- Gallery lightbox ----
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let currentImages = [];
    let currentIndex = 0;
    let currentTitle = '';

    const showImage = () => {
      lightboxImage.src = currentImages[currentIndex];
      lightboxTitle.textContent = currentTitle;
      lightboxCounter.textContent = `${currentIndex + 1} of ${currentImages.length}`;
    };

    document.querySelectorAll('.gallery-tile-photo').forEach((tile) => {
      tile.addEventListener('click', () => {
        currentImages = JSON.parse(tile.getAttribute('data-gallery-images'));
        currentTitle = tile.getAttribute('data-gallery-title');
        currentIndex = 0;
        showImage();
        lightbox.hidden = false;
      });
    });

    const closeLightbox = () => {
      lightbox.hidden = true;
    };
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showImage();
    });
    document.getElementById('lightboxNext').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % currentImages.length;
      showImage();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
      if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
    });
  }
});
