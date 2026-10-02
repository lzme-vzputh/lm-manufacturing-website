document.querySelectorAll('[data-product-carousel]').forEach((carousel) => {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const title = carousel.querySelector('[data-carousel-title]');
  const category = carousel.querySelector('[data-carousel-category]');
  const description = carousel.querySelector('[data-carousel-description]');
  const link = carousel.querySelector('[data-carousel-link]');
  if (!viewport || !track || slides.length === 0) return;

  let active = Math.max(0, slides.findIndex((slide) => slide.dataset.active === 'true'));

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || '0');
  };

  const update = () => {
    const slideWidth = slides[0].offsetWidth;
    const gap = getGap();
    const offset = viewport.clientWidth / 2 - slideWidth / 2 - active * (slideWidth + gap);
    track.style.transform = `translate3d(${offset}px,0,0)`;

    slides.forEach((slide, index) => {
      const delta = index - active;
      slide.dataset.active = index === active ? 'true' : 'false';
      slide.dataset.side = delta < 0 ? 'left' : delta > 0 ? 'right' : 'center';
      slide.style.setProperty('--slide-offset', String(delta));
      slide.setAttribute('aria-current', index === active ? 'true' : 'false');
      slide.tabIndex = index === active ? 0 : -1;
    });

    const current = slides[active];
    if (current) {
      if (title) title.textContent = current.dataset.title || '';
      if (category) category.textContent = current.dataset.category || '';
      if (description) description.textContent = current.dataset.description || '';
      if (link && current.dataset.url) link.setAttribute('href', current.dataset.url);
    }
  };

  const goTo = (index) => {
    active = (index + slides.length) % slides.length;
    update();
  };

  prev?.addEventListener('click', () => goTo(active - 1));
  next?.addEventListener('click', () => goTo(active + 1));

  slides.forEach((slide, index) => {
    slide.addEventListener('click', (event) => {
      if (index !== active) {
        event.preventDefault();
        goTo(index);
      }
    });
  });

  let startX = 0;
  let dragging = false;
  viewport.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    const diff = event.clientX - startX;
    if (Math.abs(diff) > 35) {
      goTo(active + (diff < 0 ? 1 : -1));
    }
    dragging = false;
  });
  viewport.addEventListener('pointerleave', () => { dragging = false; });
  window.addEventListener('resize', update, { passive: true });
  update();
});
