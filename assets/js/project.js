async function fetchProjectData() {
	const currentPage = window.location.pathname.split('/').pop();
	const { projects } = await (await fetch('/assets/data/projects.json')).json();
	const project = projects.find(({ slug }) => slug === currentPage);

	document.title = `${project.title} | HEADLESS HORSE`;
	populateHTML(project, projects);
}

const getSizeInKB = async (url) => Math.ceil((await (await fetch(url)).blob()).size / 1024);

const populateHTML = async (project, allProjects) => {
	let mediaListHTML = '';
	const mediaItemsHTML = [];

	for (let index = 0; index < project.media.length; index++) {
		const { src, alt } = project.media[index];
		const sizeKB = await getSizeInKB(src);

		const linkNumber = (index + 1).toString().padStart(2, '0');
		mediaListHTML += `<li><a href="#media-${linkNumber}" data-more="Image / ${sizeKB} KB">${linkNumber}. ${alt}</a></li>`;
		mediaItemsHTML.push(`<figure id="media-${linkNumber}"><img src="${src}" alt="${alt}" loading="lazy" width="100%" height="100%"><figcaption>${linkNumber}. ${alt} / ${sizeKB} KB</figcaption></figure>`);
	}

	const getNextProjectLink = (nextProject) => nextProject ? `<a href="/projects/${nextProject.slug}"><span style="animation: blink 1.5s steps(4, start) infinite">↳ </span>Next: ${nextProject.title}</a>` : '';

	document.querySelector('header').insertAdjacentHTML('afterend', `
    <main>
      <article id="details">
        <section>
          <h2>Info</h2>
          <p>${project.description}</p>
        </section>
        <section>
          ${project.links.length ? `<h2>Links</h2><ul>${project.links.map(({ link, title }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${link}">${title}</a></li>`).join('')}</ul>` : ''}
          ${project.press.length ? `<h2>Press</h2><ul>${project.press.map(({ link, title, date }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${date}">${title}</a></li>`).join('')}</ul>` : ''}
          ${project.credits.length ? `<h2>Credits</h2><ul>${project.credits.map(({ link, title, credit }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${credit}">${title}</a></li>`).join('')}</ul>` : ''}
        </section>
        <details>
          <summary>Index</summary>
          <ul>${mediaListHTML}</ul>
        </details>
      </article>

      <div class="line"></div>
      <div id="media">${mediaItemsHTML.join('')}</div>

      <footer>
        <a id="carbon"></a>
        ${getNextProjectLink(allProjects[(allProjects.findIndex(({ slug }) => slug === project.slug) + 1) % allProjects.length])}
      </footer>
    </main>
  `);
};

window.onload = fetchProjectData;