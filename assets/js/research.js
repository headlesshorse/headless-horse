class Research {
	constructor(containerId, ...slugs) {
		this.container = document.getElementById(containerId);
		this.filter = slugs;
		this.filterContainer = document.getElementById('filter');
		this.loadedCount = 0;
		this.perLoad = 15;
		this.loadMoreButton = document.getElementById('loadmore');
		this.loadMoreButton.addEventListener('click', () => this.loadMore());
		this.loadByFilter(0);
	}

	async getResearch(slug) {
		const response = await fetch(`https://widgets.pinterest.com/v3/pidgets/boards/headlesshorse/${slug}/pins/`);
		if (!response.ok) throw new Error('Network Error');
		return (await response.json()).data.pins;
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
		this.container.innerHTML = feedItems.map(({ images, link, id }) => {
			const imageUrl = images['237x'].url;
			const sourceUrl = link?.replace(/^https?:\/\/(www\.)?/i, '');
			return `<figure><img src="${imageUrl}" style="filter: grayscale(50%) contrast(0.8) brightness(0.9)"><figcaption><a href="${sourceUrl ? link : `https://pinterest.com/pin/${id}`}" target="_blank">${sourceUrl ? `Source: ${sourceUrl}` : `Source not available`}</a></figcaption></figure>`;
		}).join('');

		this.loadMoreButton.style.display = this.loadedCount >= this.feed.length ? 'none' : 'block';
		this.renderFilters();
	}

	renderFilters() {
		const createFilter = (text, onClick) => {
			const listItem = document.createElement('li');
			const button = document.createElement('a');
			button.textContent = text;
			button.addEventListener('click', onClick);
			listItem.appendChild(button);
			listItem.style.cursor = 'pointer';
			return listItem;
		};

		this.filterContainer.innerHTML = '';
		this.filter.forEach((slug, index) => {
			const isSelected = index === this.filter.findIndex(s => s === this.feed[0].board);
			const filterClick = () => this.loadByFilter(index);
			this.filterContainer.appendChild(createFilter(slug, filterClick));
		});
	}
}

new Research('media', 'Direction', 'Graphic', 'Wellness', 'Print', 'Space', 'Style');