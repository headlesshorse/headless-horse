// Menu
document.addEventListener('DOMContentLoaded', () => {
    const [menuTrigger, menuOverlay] = ['horseshoe', 'menu'].map(id => document.getElementById(id));

    const toggleMenu = () => {
        menuOverlay.style.display = (menuOverlay.style.display === 'flex') ? 'none' : 'flex';
        menuTrigger.style.display = (menuTrigger.style.display === 'none') ? 'flex' : 'none';
    };

    menuTrigger.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', (e) => (e.target === menuOverlay) && toggleMenu());
});

// Carbon
const CO2 = async () => {
    const { size = '', url = '', co2 = '' } = await (await fetch(`https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`)).json();
    document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
};

CO2();