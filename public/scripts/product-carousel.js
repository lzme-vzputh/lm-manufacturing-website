document.querySelectorAll('[data-product-carousel]').forEach((carousel) => {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const track = carousel.querySelector('[data-carousel-track]');
  const originalSlides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const title = carousel.querySelector('[data-carousel-title]');
  const category = carousel.querySelector('[data-carousel-category]');
  const description = carousel.querySelector('[data-carousel-description]');
  const link = carousel.querySelector('[data-carousel-link]');
  if (!viewport || !track || originalSlides.length === 0) return;

  const count = originalSlides.length;
  const initialLogical = Math.max(0, originalSlides.findIndex((slide) => slide.dataset.active === 'true'));

  originalSlides.forEach((slide, index) => {
    slide.dataset.logicalIndex = String(index);
    slide.dataset.active = 'false';
  });

  if (count > 1) {
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();

    originalSlides.forEach((slide, index) => {
      const cloneBefore = slide.cloneNode(true);
      cloneBefore.dataset.clone = 'true';
      cloneBefore.dataset.logicalIndex = String(index);
      before.appendChild(cloneBefore);

      const cloneAfter = slide.cloneNode(true);
      cloneAfter.dataset.clone = 'true';
      cloneAfter.dataset.logicalIndex = String(index);
      after.appendChild(cloneAfter);
    });

    track.prepend(before);
    track.append(after);
  }

  const slides = Array.from(track.querySelectorAll('[data-carousel-slide]'));
  let physical = count > 1 ? count + initialLogical : initialLogical;
  let logical = initialLogical;
  let jumping = false;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || '0');
  };

  const updateDetail = () => {
    const current = originalSlides[logical];
    if (!current) return;
    if (title) title.textContent = current.dataset.title || '';
    if (category) category.textContent = current.dataset.category || '';
    if (description) description.textContent = current.dataset.description || '';
    if (link && current.dataset.url) link.setAttribute('href', current.dataset.url);
  };

  const update = ({ animate = true } = {}) => {
    const slideWidth = slides[0]?.offsetWidth || 0;
    const gap = getGap();
    const offset = viewport.clientWidth / 2 - slideWidth / 2 - physical * (slideWidth + gap);
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(${offset}px,0,0)`;

    slides.forEach((slide, index) => {
      const active = index === physical;
      slide.dataset.active = active ? 'true' : 'false';
      slide.dataset.side = index < physical ? 'left' : index > physical ? 'right' : 'center';
      slide.setAttribute('aria-current', active ? 'true' : 'false');
      slide.tabIndex = active ? 0 : -1;
    });

    logical = ((Number(slides[physical]?.dataset.logicalIndex ?? physical) % count) + count) % count;
    updateDetail();

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    }
  };

  const normalizeAfterTransition = () => {
    if (count <= 1 || jumping) return;
    if (physical < count) {
      jumping = true;
      physical += count;
      update({ animate: false });
      jumping = false;
    } else if (physical >= count * 2) {
      jumping = true;
      physical -= count;
      update({ animate: false });
      jumping = false;
    }
  };

  const move = (step) => {
    if (count <= 1) return;
    physical += step;
    update({ animate: true });
  };

  prev?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  track.addEventListener('transitionend', normalizeAfterTransition);

  slides.forEach((slide, index) => {
    slide.addEventListener('click', (event) => {
      if (index !== physical) {
        event.preventDefault();
        physical = index;
        update({ animate: true });
      }
    });
  });

  let startX = 0;
  let dragging = false;
  viewport.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    viewport.setPointerCapture?.(event.pointerId);
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    const diff = event.clientX - startX;
    if (Math.abs(diff) > 35) move(diff < 0 ? 1 : -1);
    dragging = false;
  });
  viewport.addEventListener('pointercancel', () => { dragging = false; });
  viewport.addEventListener('pointerleave', () => { dragging = false; });

  window.addEventListener('resize', () => update({ animate: false }), { passive: true });
  update({ animate: false });
});
