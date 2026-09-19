(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const aura = document.querySelector('.pointer-aura');
  const depthCard = document.querySelector('[data-depth-card]');

  if (finePointer.matches && !reducedMotion.matches && aura) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;
    const paint = () => {
      currentX += (targetX - currentX) * .16;
      currentY += (targetY - currentY) * .16;
      aura.style.transform = `translate3d(${currentX}px,${currentY}px,0)`;
      if (Math.abs(targetX - currentX) > .15 || Math.abs(targetY - currentY) > .15) {
        frame = requestAnimationFrame(paint);
      } else {
        currentX = targetX;
        currentY = targetY;
        frame = 0;
      }
    };
    window.addEventListener('pointermove', event => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.body.style.setProperty('--pointer-x', `${targetX}px`);
      document.body.style.setProperty('--pointer-y', `${targetY}px`);
      aura.classList.add('is-visible');
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
    document.addEventListener('pointerover', event => {
      const target = event.target;
      aura.classList.toggle('is-active', target instanceof Element && Boolean(target.closest('a,button,.card')));
    });
    document.documentElement.addEventListener('mouseleave', () => aura.classList.remove('is-visible'));

    if (depthCard) {
      depthCard.addEventListener('pointermove', event => {
        const rect = depthCard.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - .5) * -3;
        const ry = ((event.clientX - rect.left) / rect.width - .5) * 4;
        depthCard.style.setProperty('--depth-rx', `${rx}deg`);
        depthCard.style.setProperty('--depth-ry', `${ry}deg`);
      });
      depthCard.addEventListener('pointerleave', () => {
        depthCard.style.setProperty('--depth-rx', '0deg');
        depthCard.style.setProperty('--depth-ry', '0deg');
      });
    }
  }

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll('main .section .container, main .card, main .stat, main .feature-list article, main .content-list li');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }), { threshold: .08, rootMargin: '0px 0px -36px' });
    items.forEach((item, index) => {
      item.classList.add('reveal-item');
      item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
      observer.observe(item);
    });
  }
})();
