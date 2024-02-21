class Mood {
    constructor(containerId, ...slugs) {
        this.feed = [];
        this.container = document.getElementById(containerId);
        this.filter = slugs;
        this.filterContainer = document.getElementById('filter');
        this.loadedCount = 0;
        this.perLoad = 15;
        this.loadMoreButton = document.getElementById('loadmore');
        this.loadMoreButton.addEventListener('click', () => this.loadMore());
        this.loadFeed();
    }

    async getMood(slug) {
        const response = await fetch(`https://widgets.pinterest.com/v3/pidgets/boards/headlesshorse/${slug}/pins/`);
        if (response.ok) return (await response.json()).data.pins;
        throw new Error('Network Error');
    }

    async loadFeed() {
        const feedData = await Promise.all(this.filter.map(slug => this.getMood(slug)));
        this.feed = feedData.flat();
        this.loadedCount = 0;
        this.render();
    }

    async loadByFilter(index) {
        this.feed = await this.getMood(this.filter[index]);
        this.loadedCount = 0;
        this.render();
    }

    loadMore() {
        this.render();
    }

    render() {
        const feedItems = this.feed.slice(0, this.loadedCount += this.perLoad);
        this.container.innerHTML = '';
        feedItems.forEach(({ images, link, id }) => {
            const imageUrl = images['237x'].url;
            const sourceUrl = link?.replace(/^https?:\/\/(www\.)?/i, '');
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${imageUrl}" style="filter: grayscale(50%) contrast(0.8) brightness(0.9)">
                <figcaption><a href="${sourceUrl ? link : `https://pinterest.com/pin/${id}`}" target="_blank">${sourceUrl ? `Source: ${sourceUrl}` : `Source not available`}</a></figcaption>
            `;
            this.container.appendChild(figure);
        });
        this.loadMoreButton.style.display = this.loadedCount >= this.feed.length ? 'none' : 'block';
        this.renderFilters();
    }

    renderFilters() {
        this.filterContainer.innerHTML = '';
        const createFilter = (text, onClick) => {
            const listItem = document.createElement('li');
            const button = document.createElement('a');
            button.textContent = text;
            button.addEventListener('click', onClick);
            listItem.appendChild(button);
            listItem.style.cursor = 'pointer';
            return listItem;
        };
        this.filterContainer.appendChild(createFilter('All', () => this.loadFeed()));
        this.filter.forEach((slug, index) => {
            this.filterContainer.appendChild(createFilter(slug, () => this.loadByFilter(index)));
        });
    }
}

new Mood('media', 'Direction', 'Wellness', 'Print', 'Space', 'Style');

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
const CO2 = async () => {
    const { size = '', url = '', co2 = '' } = await (await fetch(`https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`)).json();
    document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
};

CO2();