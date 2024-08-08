const fetchWorkData = async () => {
  const currentPage = window.location.pathname.split('/').pop();
  const works = await (await fetch('/assets/data/work.json')).json();
  const work = works.find(({ slug }) => slug === currentPage);

  document.title = `${work.title} | HEADLESS HORSE`;

  populateHTML(work, works);
};

const populateHTML = (work, allWorks) => {
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

      <div class="line"></div>
      <div id="media"></div>

      <div class="line"></div>
      <footer>
        <a id="carbon"></a>
        <ul>
          <li>™ and © <script>document.write(new Date().getFullYear())</script></li>
          <li><a href="https://withcabin.com/privacy/headless.horse" target="_blank">Privacy Policy</a></li>
        </ul>
      </footer>
    </main>
  `);

  new Media('media', work.slug);
};

// Media
class Media {
  constructor(containerId, boardExtension) {
    this.container = document.getElementById(containerId);
    this.loadedCount = 0;
    this.perLoad = 6;
    this.observer = new IntersectionObserver(entries => entries[0].isIntersecting && this.loadMore());
    this.boardExtension = boardExtension;
    this.feed = [];
    this.load();
  }

  async getMedia() {
    const baseUrl = 'https://widgets.pinterest.com/v3/pidgets/';
    const endpoint = `sections/headlesshorse/by-headless-horse/${this.boardExtension}/pins/`;
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) throw new Error('Network Error');
    return (await response.json()).data.pins;
  }

  async load() {
    this.feed = await this.getMedia();
    this.render();
  }

  loadMore() {
    this.render();
  }

  render() {
    const feedItems = this.feed.slice(0, this.loadedCount += this.perLoad);
    this.container.innerHTML = feedItems.map(({ images, link, id }) => {
      const image = images['564x'].url;
      const cleanLink = link?.replace(/^https?:\/\/(www\.)?/i, '');
      return `<figure><img src="${image}"><figcaption><a href="${cleanLink ? link : `https://pinterest.com/pin/${id}`}" target="_blank">${cleanLink ? `Source: ${cleanLink}` : 'Source not available'}</a></figcaption></figure>`;
    }).join('');

    if (this.loadedCount < this.feed.length) {
      const sentinel = document.createElement('div');
      sentinel.id = 'sentinel';
      this.container.appendChild(sentinel);
      this.observer.observe(sentinel);
    }
  }
}

window.onload = fetchWorkData;