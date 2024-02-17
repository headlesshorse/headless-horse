const fetchProjectData = async () => {
  const { projects } = await (await fetch('/assets/data/projects.json')).json();
  const sortedPressLinks = projects.flatMap(project => (project.press || []).map(link => ({ ...link, projectName: project.title })))
    .slice().sort((a, b) => a.title.localeCompare(b.title));
  
  const template = `
    <section>
      <h2>Press</h2>
      <ul>
        ${sortedPressLinks.map(link => `<li><a href="${link.link}" target="_blank" rel="noreferrer" data-more="${link.projectName}, ${link.date}">${link.title}</a></li>`).join('')}
      </ul>
    </section>
  `;
  document.querySelector('section').parentNode.insertAdjacentHTML('beforeend', template);
  
  // Typing
  document.querySelectorAll("section *").forEach(element => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 && !element.classList.contains("typewriter")) {
      element.classList.add("typewriter");
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
  const CO2 = async () => {
    const { size = '', url = '', co2 = '' } = await (await fetch(`https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`)).json();
    document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
  };
  
  CO2();
};

window.onload = fetchProjectData;

// Hours
const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours() + 1;
const isOpen = (day === 0 || day === 6) || (day === 5 && hour >= 18) ? 'We are out of office and will return Monday morning.' : (hour >= 9 && hour < 18) ? 'The studio is open today from 09:00-18:00.' : 'We are out of office. We will be open tomorrow, 09:00-18:00.';

document.querySelector('p').insertAdjacentHTML('beforeend', '<br>' + isOpen);