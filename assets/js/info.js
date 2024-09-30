// Press
const fetchWorkData = async () => {
  const works = await (await fetch('/assets/data/work.json')).json();

  const titleCounts = {};
  const pressLinks = works.flatMap(work => (work.press || []).map(link => {
    const title = link.title.toUpperCase();
    titleCounts[title] = (titleCounts[title] || 0) + 1;
    return { ...link, projectName: work.title, sectionLink: titleCounts[title] > 1 ? ` / ${titleCounts[title]}` : '', firstOccurrence: titleCounts[title] === 1 };
  }));

  const pressGroups = pressLinks.reduce((groups, link) => {
    (groups[link.title] = groups[link.title] || []).push(link);
    return groups;
  }, {});

  const template = `
    <h2>Press</h2>
    <ul>${Object.keys(pressGroups).sort().map(title => `<li>${pressGroups[title].map((link, index) => `<a href="${link.link}" target="_blank" rel="noreferrer" data-more="${link.projectName}, ${link.date}">${index === 0 ? link.title : ''}${link.sectionLink}</a>`).join('')}</li>`).join('')}</ul>
  `;
  document.querySelector('section:last-of-type').insertAdjacentHTML('afterbegin', template);
};

window.onload = fetchWorkData;

// Hours
const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours() + 1;

const isOpen = 
  (day === 0 || day === 6) || 
  (day === 5 && hour >= 18) ? 'We are out of office and will return Monday morning.' : 
  (hour >= 9 && hour < 18) ? 'The studio is open today from 09:00-18:00.' : 
  'We are out of office. We will be open tomorrow, 09:00-18:00.';

document.querySelector('p').insertAdjacentHTML('beforeend', '<br>' + isOpen);