// Research
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id),
    searchInput = $('search'),
    resultsList = $('media'),
    searchCount = $('count'),
    popularTerms = $('tags');

  let data = [], timeoutId;

  const fetchData = async () => {
    try {
      const res = await fetch('/assets/data/academic.json');
      data = await res.json();
      fetchAndDisplayData();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAndDisplayData = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      resultsList.innerHTML = '';
      const term = searchInput.value.trim().toLowerCase();
      const filteredData = data.filter(({ title, info }) =>
        [title, info].some(v => v.toLowerCase().includes(term))
      );

      searchCount.textContent = `${filteredData.length} result(s)`;

      for (const { title, info, thumbnail, date, link } of filteredData) {
        const cleanLink = link?.replace(/^https?:\/\/(www\.)?/i, '');

        const figure = document.createElement('figure');
        figure.innerHTML = `
          <h2>${title}</h2>
          <p>${info}</p>
          <img src="${thumbnail}" style="filter: grayscale(50%) contrast(.8) brightness(.9)">
          <figcaption>
            <ul>
              <li>Published: ${date}</li>
              <li><a href="${link}" target="_blank">Source: ${cleanLink}</a></li>
            </ul>
          </figcaption>
        `;
        resultsList.appendChild(figure);
      }
    }, 300);
  };

  fetchData();
  searchInput.addEventListener('input', fetchAndDisplayData);
  popularTerms.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      searchInput.value = e.target.textContent.trim();
      fetchAndDisplayData();
    }
  });
});