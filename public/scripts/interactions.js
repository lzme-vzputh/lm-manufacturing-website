(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const aura = document.querySelector('.pointer-aura');
  const depthCard = document.querySelector('[data-depth-card]');

  if (finePointer.matches && !reducedMotion.matches && aura) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let frame = 0;
    const paint = () => {
      aura.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = 0;
    };
    window.addEventListener('pointermove', event => {
      x = event.clientX;
      y = event.clientY;
      document.body.style.setProperty('--pointer-x', `${x}px`);
      document.body.style.setProperty('--pointer-y', `${y}px`);
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
