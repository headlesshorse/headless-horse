// Menu
document.addEventListener('DOMContentLoaded', () => {
  const [menuTrigger, menuOverlay] = ['horseshoe', 'nav'].map(id => document.getElementById(id));

  const toggleMenu = () => {
    menuOverlay.style.display = (menuOverlay.style.display === 'flex') ? 'none' : 'flex';
    menuTrigger.style.display = (menuTrigger.style.display === 'none') ? 'flex' : 'none';
  };

  menuTrigger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', (e) => (e.target === menuOverlay) && toggleMenu());
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
  const { size = '', url = '', co2 = '', rating = '' } = await (await fetch(`https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`)).json();
  const co2Formatted = parseFloat(co2).toFixed(2);
  const ratingFormatted = rating.toUpperCase();
  document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="${size}, powered by clean energy ⋆˚✿˖°">${ratingFormatted} / ${co2Formatted}g CO2e</a>`;
})();