(() => {
  const buttons = document.querySelectorAll('[data-category]');
  const cards = document.querySelectorAll('[data-product-category]');
  const status = document.querySelector('[data-filter-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  buttons.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const selected = button.dataset.category;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => {
      const visible = selected === 'all' || card.dataset.productCategory === selected;
      card.hidden = !visible;
      if (visible) {
        count++;
        if (!reducedMotion.matches) {
          card.animate(
            [{ opacity: .35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' }
          );
        }
      }
    });
    if (status) status.textContent = (status.dataset.template || 'Showing {count} products').replace('{count}', String(count));
  }));
})();
