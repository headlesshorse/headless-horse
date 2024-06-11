class Research {
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

    async getResearch(slug) {
        const response = await fetch(`https://widgets.pinterest.com/v3/pidgets/boards/headlesshorse/${slug}/pins/`);
        if (response.ok) return (await response.json()).data.pins;
        throw new Error('Network Error');
    }

    async loadFeed() {
        const feedData = await Promise.all(this.filter.map(slug => this.getResearch(slug)));
        this.feed = feedData.flat();
        this.loadedCount = 0;
        this.render();
    }

    async loadByFilter(index) {
        this.feed = await this.getResearch(this.filter[index]);
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

new Research('media', 'Direction', 'Graphic', 'Wellness', 'Print', 'Space', 'Style');