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
      currentX += (targetX - currentX) * .12;
      currentY += (targetY - currentY) * .12;
      aura.style.transform = `translate3d(${currentX}px,${currentY}px,0) rotate(-7deg)`;
      if (Math.abs(targetX - currentX) > .1 || Math.abs(targetY - currentY) > .1) {
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
    const hideAura = () => {
      aura.classList.remove('is-visible', 'is-active');
    };
    document.documentElement.addEventListener('mouseleave', hideAura);
    window.addEventListener('blur', hideAura);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hideAura();
    });

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
