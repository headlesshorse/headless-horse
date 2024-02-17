class PinterestFeed {
    constructor(...slugs) {
        this.feed = [];
        this.container = document.getElementById('media');
        this.boards = slugs;
        this.loadedCount = 0;
        this.perLoad = 15;
        this.loadMoreButton = document.getElementById('loadmore');
        this.loadMoreButton.addEventListener('click', () => this.loadMore());
        this.loadInitial();
    }

    async reflect(p) {
        try {
            return (await p).pins;
        } catch (e) {
            return e;
        }
    }

    async getFeed(slug) {
        const apiUrl = `https://widgets.pinterest.com/v3/pidgets/boards/headlesshorse/${slug}/pins/`;
        try {
            const response = await fetch(apiUrl);
            if (response.ok) return (await response.json()).data;
            throw new Error('Network Error');
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getFeeds() {
        return await Promise.all(this.boards.map(slug => this.reflect(this.getFeed(slug))));
    }

    async loadInitial() {
        try {
            await this.loadFeed();
        } catch (error) {
            console.log(error);
        }
    }

    async loadMore() {
        try {
            await this.loadFeed();
        } catch (error) {
            console.log(error);
        }
    }

    async loadFeed() {
        const feedData = await this.getFeeds();
        this.feed = feedData.flat();
        this.loadedCount += this.perLoad;
        this.renderFeed(this.feed.slice(0, this.loadedCount));
        this.checkLoadMoreButton();
    }

    renderFeed(feedItems) {
        this.container.innerHTML = '';
        feedItems.forEach(item => {
            const { images, link } = item;
            const imageUrl = images['237x'].url;
            const image = document.createElement('img');
            image.src = imageUrl;
            image.style.filter = 'grayscale(50%) contrast(0.8) brightness(0.9)';
            const figure = document.createElement('figure');
            figure.appendChild(image);
            const figcaption = document.createElement('figcaption');
            if (link) {
                const sourceLink = document.createElement('a');
                sourceLink.href = link;
                sourceLink.target = '_blank';
                sourceLink.textContent = `Source: ${link}`;
                figcaption.appendChild(sourceLink);
            } else {
                figcaption.textContent = 'Source not available';
            }
            figure.appendChild(figcaption);
            this.container.appendChild(figure);
        });
    }
}

const feed = new PinterestFeed(
    'direction',
    'wellness',
    'print',
    'space',
    'looks'
);

// Typing
document.querySelectorAll("section *").forEach(element => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 && !element.classList.contains("typewriter")) {
        element.classList.add("typewriter");
        typeWriter(element, 120);
    }
});

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

// Carbon
const displayCarbonData = async () => {
    const apiUrl = `https://digitalbeacon.co/badge?url=${encodeURIComponent(window.location.href)}`;
    const { size = '', url = '', co2 = '' } = await (await fetch(apiUrl)).json();
    document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
  };  

displayCarbonData();