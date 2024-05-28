const fetchProjectData = async () => {
  const { projects } = await (await fetch('/assets/data/projects.json')).json();

  const titleCounts = {};
  const pressLinks = projects.flatMap(project => (project.press || []).map(link => {
    const title = link.title.toUpperCase();
    titleCounts[title] = (titleCounts[title] || 0) + 1;
    const sectionLink = titleCounts[title] > 1 ? ` / ${titleCounts[title]}` : '';
    return { ...link, projectName: project.title, sectionLink, firstOccurrence: titleCounts[title] === 1 };
  }));

  const pressGroups = pressLinks.reduce((groups, link) => {
    groups[link.title] = groups[link.title] || [];
    groups[link.title].push(link);
    return groups;
  }, {});

  const sortedPressGroups = Object.keys(pressGroups).sort();

  const template = `
    <section>
      <h2>Press</h2>
      <ul>
        ${sortedPressGroups.map(title => {
          const group = pressGroups[title];
          return `<li>${group.map((link, index) => `<a href="${link.link}" target="_blank" rel="noreferrer" data-more="${link.projectName}, ${link.date}">${index === 0 ? link.title : ''}${link.sectionLink}</a>`).join('')}</li>`;
        }).join('')}
      </ul>
    </section>
  `;

  document.querySelector('section').parentNode.insertAdjacentHTML('beforeend', template);

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
};

window.onload = fetchProjectData;

// Hours
const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours() + 1;
const isOpen = (day === 0 || day === 6) || (day === 5 && hour >= 18) ? 'We are out of office and will return Monday morning.' : (hour >= 9 && hour < 18) ? 'The studio is open today from 09:00-18:00.' : 'We are out of office. We will be open tomorrow, 09:00-18:00.';

document.querySelector('p').insertAdjacentHTML('beforeend', '<br>' + isOpen);