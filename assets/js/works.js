async function fetchWorkData() {
	const currentPage = window.location.pathname.split('/').pop();
	const { works } = await (await fetch('/assets/data/work.json')).json();
	const work = works.find(({ slug }) => slug === currentPage);

	document.title = `${work.title} | HEADLESS HORSE`;
	populateHTML(work, works);
}

const getSizeInKB = async (url) => Math.ceil((await (await fetch(url)).blob()).size / 1024);

const populateHTML = async (work, allWorks) => {
	let mediaListHTML = '';
	const mediaItemsHTML = [];

	for (let index = 0; index < work.media.length; index++) {
		const { src, alt } = work.media[index];
		const sizeKB = await getSizeInKB(src);

		const linkNumber = (index + 1).toString().padStart(2, '0');
		mediaListHTML += `<li><a href="#media-${linkNumber}" data-more="Image / ${sizeKB} KB">${linkNumber}. ${alt}</a></li>`;
		mediaItemsHTML.push(`<figure id="media-${linkNumber}"><img src="${src}" alt="${alt}" loading="lazy" width="100%" height="100%"><figcaption>${linkNumber}. ${alt} / ${sizeKB} KB</figcaption></figure>`);
	}

	const getNextWorkLink = (nextWork) => nextWork ? `<a href="/work/${nextWork.slug}"><span class="marker">↳</span> Next: ${nextWork.title}</a>` : '';

	document.querySelector('header').insertAdjacentHTML('afterend', `
    <main>
      <div id="subnav">
        <h1>/Work/${work.title}</h1>
        <ul>
          <li>${getNextWorkLink(allWorks[(allWorks.findIndex(({ slug }) => slug === work.slug) + 1) % allWorks.length])}</li>
        </ul>
      </div>
      <div class="line"></div>

      <article id="info">
        <section>
          <h2>Info</h2>
          <p>${work.info}</p>
        </section>
        <section>
          ${work.links.length ? `<h2>Links</h2><ul>${work.links.map(({ link, title }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${link}">${title}</a></li>`).join('')}</ul>` : ''}
          ${work.press.length ? `<h2>Press</h2><ul>${work.press.map(({ link, title, date }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${date}">${title}</a></li>`).join('')}</ul>` : ''}
          ${work.credits.length ? `<h2>Credits</h2><ul>${work.credits.map(({ link, title, credit }) => `<li><a href="${link}" target="_blank" rel="noreferrer" data-more="${credit}">${title}</a></li>`).join('')}</ul>` : ''}
        </section>
      </article>

      <details>
        <summary><span class="marker">↳</span> Index</summary>
        <ul>${mediaListHTML}</ul>
      </details>
      <div class="line"></div>
      <div id="media">${mediaItemsHTML.join('')}</div>

      <footer>
        <a id="carbon"></a>
      </footer>
    </main>
  `);
};

window.onload = fetchWorkData;