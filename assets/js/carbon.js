const displayCarbonData = async () => {
  const apiUrl = `https://digitalbeacon.co/badge?url=${encodeURIComponent(currentPageUrl)}`
  const { size = '', url = '', co2 = '' } = await (await fetch(apiUrl)).json();
  document.getElementById('carbon').outerHTML = `<a href="${url}" target="_blank" data-more="Low-consumption site using renewable energy.">${size} / ${co2}</a>`;
};
displayCarbonData();