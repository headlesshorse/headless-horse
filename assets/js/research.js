class Research {
	constructor(containerId, ...tags) {
		Object.assign(this, {
			container: document.getElementById(containerId),
			tagContainer: document.getElementById('tags'),
			tags, activeTagIndex: 0, loadedCount: 0, perLoad: 6,
			observer: new IntersectionObserver(entries => entries[0].isIntersecting && this.loadMore())
		});
		this.loadByTag(0);
	}

	async getResearch(tag) {
		const response = await fetch(`https://widgets.pinterest.com/v3/pidgets/boards/headlesshorse/${tag}/pins/`);
		if (!response.ok) throw new Error('Network Error');
		return (await response.json()).data.pins;
	}

	async loadByTag(index) {
		Object.assign(this, { activeTagIndex: index, feed: await this.getResearch(this.tags[index]), loadedCount: 0 });
		this.render();
	}

	loadMore() { this.render(); }

	render() {
		const feedItems = this.feed.slice(0, this.loadedCount += this.perLoad);
		this.container.innerHTML = feedItems.map(({ images, link, id }) => {
			const imageUrl = images['237x'].url;
			const sourceUrl = link?.replace(/^https?:\/\/(www\.)?/i, '');
			return `<figure><img src="${imageUrl}" width="100%" height="100%" style="filter: grayscale(50%) contrast(0.8) brightness(0.9)"><figcaption><a href="${sourceUrl ? link : `https://pinterest.com/pin/${id}`}" target="_blank">${sourceUrl ? `Source: ${sourceUrl}` : `Source not available`}</a></figcaption></figure>`;
		}).join('');

		if (this.loadedCount < this.feed.length) {
			const sentinel = document.createElement('div');
			sentinel.id = 'sentinel';
			this.container.appendChild(sentinel);
			this.observer.observe(sentinel);
		}
		this.renderTags();
	}

	renderTags() {
		this.tagContainer.innerHTML = '';
		this.tags.forEach((tag, index) => {
			const button = document.createElement('a');
			button.innerHTML = `${index === this.activeTagIndex ? '<span style="animation: blink 1.5s steps(4, start) infinite">↳</span> ' : ''}${tag}`;
			button.addEventListener('click', () => this.loadByTag(index));
			const listItem = document.createElement('li');
			listItem.style.cursor = 'pointer';
			listItem.appendChild(button);
			this.tagContainer.appendChild(listItem);
		});
	}
}

new Research('media', 'Direction', 'Graphic', 'Wellness', 'Print', 'Space', 'Style');