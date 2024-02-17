async function fetchProjectData() {
  const currentPage = window.location.pathname.split('/').pop();
  const { projects } = await (await fetch('/assets/data/projects.json')).json();
  const project = projects.find(({ slug }) => slug === currentPage);

  document.title = `${project.title} | HEADLESS HORSE`;
  populateHTML(project, projects);
}

const getSizeInKB = async (url) => Math.ceil((await fetch(url).then(res => res.blob())).size / 1024);

const populateHTML = async (project, allProjects) => {

  let mediaListHTML = '';
  const mediaItemsHTML = [];
  for (let index = 0; index < project.media.length; index++) {
    const { src, alt, type } = project.media[index];
    const sizeKB = await getSizeInKB(src);
    
    const mediaContent = type === 'Image' 
      ? `<img src="${src}" alt="${alt}" loading="lazy" width="auto" height="100%">`
      : `<video autoplay loop muted preload="none" width="auto" height="100%"><source src="${src}" type="video/mp4"></video>`;
    
    const linkNumber = (index + 1).toString().padStart(2, '0');
    const listItem = `<li><a href="#media-${linkNumber}" data-more="${type} / ${sizeKB} KB">${linkNumber}. ${alt}</a></li>`;
    mediaListHTML += listItem;
  
    const figureItem = `<figure id="media-${linkNumber}">${mediaContent}<figcaption>${linkNumber}. ${alt} / ${sizeKB} KB</figcaption></figure>`;
    mediaItemsHTML.push(figureItem);
  }
  
  const getNextProjectLink = (nextProject) => nextProject ? `<a href="/projects/${nextProject.slug}">Next: ${nextProject.title}</a>` : '';

  const template = `
    <main>
      <article id="details">
        <section>
          <h2>${project.title}</h2>
          <p>${project.description}</p>
        </section>
        <section>
          ${project.links.length > 0 ? '<h2>Links</h2>' : ''}
          <ul>${project.links.map(({ link, title }) => `
            <li><a href="${link}" target="_blank" rel="noreferrer" data-more="${link}">${title}</a></li>`).join('')}
          </ul>
          ${project.press.length > 0 ? '<h2>Press</h2>' : ''}
          <ul>${project.press.map(({ link, title, date }) => `
            <li><a href="${link}" target="_blank" rel="noreferrer" data-more="${date}">${title}</a></li>`).join('')}
          </ul>
          ${project.credits.length > 0 ? '<h2>Credits</h2>' : ''}
          <ul>${project.credits.map(({ link, title, credit }) => `
            <li><a href="${link}" target="_blank" rel="noreferrer" data-more="${credit}">${title}</a></li>`).join('')}
          </ul>
        </section>
        <details>
          <summary>Index</summary>
          <ul>${mediaListHTML}</ul>
        </details>
      </article>

      <section id="media">
        ${mediaItemsHTML.join('')}
      </section>

      <footer>
        <a id="carbon"></a>
        <a "${getNextProjectLink(allProjects[(allProjects.findIndex(({ slug }) => slug === project.slug) + 1) % allProjects.length])}</a>
      </footer>
    </main>
  `;

  document.querySelector('header').insertAdjacentHTML('afterend', template);

  // Typing
  document.querySelectorAll("article h2, article p, article a").forEach(element => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 && !element.classList.contains("typewriter")) {
      element.classList.add("typewriter");
      typeWriter(element, 120);
    }
  });

  // Carbon
  const displayCarbonData = async () => {
    const apiUrl = `https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`;
    const { size = '', url = '', co2 = '' } = await (await fetch(apiUrl)).json();
    document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
  };  
  
  displayCarbonData();
};

window.onload = fetchProjectData;

// Typing
function typeWriter(element, speed) {
  let text = element.textContent;
  element.textContent = text.substring(0, text.length - 20);

  let i = Math.max(0, text.length - 20);
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      setTimeout(type, speed);
    }
  }
  type();
}