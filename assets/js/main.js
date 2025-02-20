// Menu
document.addEventListener('DOMContentLoaded', () => {
  const menuTrigger = document.getElementById('horseshoe');
  const menuOverlay = document.getElementById('menu');
  const body = document.body;

  const toggleMenu = () => {
    const isOpen = menuOverlay.style.display === 'flex';
    menuOverlay.style.display = isOpen ? 'none' : 'flex';
    menuTrigger.style.display = isOpen ? 'flex' : 'none';
    body.style.touchAction = isOpen ? '' : 'none';
    body.style.overflow = isOpen ? '' : 'hidden';
  };

  menuTrigger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) toggleMenu();
  });

  const currentPath = window.location.pathname;
  document.querySelectorAll('#menu a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
      Object.assign(link.style, {
        padding: '1em 3em',
        background: 'var(--corner)',
        backgroundSize: '4px 4px',
        backgroundRepeat: 'no-repeat',
      });
    }
  });
});

// Typing
document.querySelectorAll('section *').forEach(element => {
  if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 && !element.classList.contains('typewriter')) {
    element.classList.add('typewriter');
    let text = element.textContent;
    element.textContent = text.substring(0, text.length - 20);
    let i = Math.max(0, text.length - 20);
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i++);
        setTimeout(type, 120);
      }
    }
    type();
  }
});

// Carbon
(async () => {
  const { size, url, co2, rating } = await (await fetch(`https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`)).json();
  const loadTime = (performance.timing.loadEventEnd - performance.timing.navigationStart) / 1000
  document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="${size} in ${loadTime.toFixed(2)}s using clean energy .𖥔 ݁˖">${rating.toUpperCase()} ${parseFloat(co2).toFixed(3)}g CO2</a>`;
})();