var modalElement = document.getElementById('modal');
var infoBtn = document.getElementById('info-btn');
var closeBtn = document.getElementById('close-btn');
var infoElement = document.getElementById('info');
var projectElement = document.getElementById('project');
var wallimage = document.getElementById('wall-image');

infoBtn.addEventListener('click', function () {
  history.pushState(null, null, '/info');
  document.title = `Info | HEADLESS HORSE`;
  modalElement.style.height = '100%';
  infoBtn.textContent = 'headless.horse';
  closeBtn.style.opacity = '1';
  infoElement.style.display = 'grid';
  projectElement.style.display = 'none';
  wallimage.classList.add('wall-image--filter');
  setTimeout(function () {
    infoElement.style.opacity = '1';
  }, 500);
});

document.querySelectorAll('[project]').forEach(function (projectOpen) {
  projectOpen.addEventListener('click', function () {
    modalElement.style.height = '100%';
    closeBtn.style.opacity = '1';
    infoElement.style.opacity = '0';
    projectElement.style.display = 'grid';
    wallimage.classList.add('wall-image--filter');
    setTimeout(function () {
      projectElement.style.opacity = '1';
    }, 500);
  });
});

closeBtn.addEventListener('click', function () {
  document.title = `HEADLESS HORSE`;
  modalElement.style.transition = 'height 1s';
  closeBtn.style.opacity = '0';
  infoElement.style.opacity = '0';
  projectElement.style.opacity = '0';
  wallimage.classList.remove('wall-image--filter');
  setTimeout(function () {
    modalElement.style.height = '40px';
    infoElement.style.display = 'none';
    projectElement.style.display = 'none';
  }, 500);
});

import router from '../js/router.js';

const fetchProjects = async () => {
  try {
    const response = await fetch('public/data/projects.json');
    return (await response.json()).projects || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const showProject = async (slug) => {
  const projects = await fetchProjects();
  const projectIndex = projects.findIndex(proj => proj.slug === slug);
  const project = projects.find(proj => proj.slug === slug);

  if (project) {
    const { title, description, links, press, credits, media } = project;

    const extractFileNumber = (fileName) => {
      const match = fileName.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const sortedMedia = media.sort((a, b) => extractFileNumber(a.src) - extractFileNumber(b.src));

    const sortedMediaWithSize = await Promise.all(sortedMedia.map(async (item) => {
      if (item.type === 'image' || item.type === 'video') {
        const response = await fetch(item.src);
        const sizeBytes = parseInt(response.headers.get('Content-Length'), 10);
        const sizeKB = Math.ceil(sizeBytes / 1024);
        return { ...item, sizeKB };
      } else {
        return item;
      }
    }));

    const nextProjectIndex = (projectIndex + 1) % projects.length;
    const nextProject = projects[nextProjectIndex];

    projectElement.innerHTML = `
      <div id="project-details">
        <div>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
        <div>
          ${links.length > 0 ? '<h2>Links</h2>' : ''}
          <ul>${links.map(pr => `<li><a href="${pr.link}" target="_blank" rel="noreferrer" data-more="${pr.link}">${pr.title}</a></li>`).join('')}</ul>
          ${press.length > 0 ? '<h2>Press</h2>' : ''}
          <ul>${press.map(pr => `<li><a href="${pr.link}" target="_blank" rel="noreferrer" data-more="${pr.date}">${pr.title}</a></li>`).join('')}</ul>
        </div>
        <div>
          ${credits.length > 0 ? '<h2>Credits</h2>' : ''}
          <ul>${credits.map(pr => `<li><a href="${pr.link}" target="_blank" rel="noreferrer" data-more="${pr.credit}">${pr.title}</a></li>`).join('')}</ul>
        </div>
      </div>
      <div id="project-media">
        ${sortedMediaWithSize.map(item => {
          const mediaContent = item.type === 'image'
            ? `<img src="${item.src}" alt="${item.alt}" loading="lazy" width="auto" height="100%">`
            : `<video autoplay loop preload="none" width="auto" height="100%"><source src="${item.src}" type="video/mp4"></video>`;
          return `<figure>${mediaContent}<figcaption>${item.alt} / ${item.sizeKB}kB</figcaption></figure>`;
        }).join('')}
      </div>
      <div id="project-footer">
        <a href="/${nextProject.slug}">[Next Project: ${nextProject.title}]</a>
      </div>
    `;
    infoBtn.textContent = `headless.horse/${slug}`;
    document.title = `${title} | HEADLESS HORSE`;
    modalElement.style.height = '100%';
    modalElement.style.transition = 'height 0s';
    closeBtn.style.opacity = '1';
    projectElement.style.display = 'grid';
    projectElement.style.opacity = '1';
    wallimage.classList.add('wall-image--filter');
  }
};

const showInfo = async () => {
  modalElement.style.height = '100%';
  modalElement.style.transition = 'height 0s';
  closeBtn.style.opacity = '1';
  infoElement.style.display = 'grid';
  infoElement.style.opacity = '1';
};

router.eventSource.addEventListener('routechanged', () => {
  const currentRoute = router.getRoute();
  if (currentRoute === 'info') {
    showInfo();
  } else if (currentRoute) {
    showProject(currentRoute);
  }
});

const initialRoute = router.getRoute();
if (initialRoute === 'info') {
  document.title = `Info | HEADLESS HORSE`;
  showInfo();
} else if (initialRoute) {
  showProject(initialRoute);
}

window.addEventListener('popstate', () => {
  const currentRoute = router.getRoute();
  if (currentRoute === 'info') {
    showInfo();
  } else if (currentRoute) {
    showProject(currentRoute);
  }
});

document.body.addEventListener('click', function (event) {
  if (event.target.id === 'close-btn') {
    handleCloseBtn();
  }
});

const handleCloseBtn = () => {
  router.setRoute('');
  showProject(router.getRoute());
  if (infoBtn) {
    infoBtn.textContent = 'headless.horse';
  }
};

const handleClick = async (event) => {
  const projectTitle = event.target.getAttribute('project');
  if (projectTitle) {
    const projects = await fetchProjects();
    const project = projects.find(proj => proj.title === projectTitle);

    if (project) {
      router.setRoute(project.slug);
      showProject(project.slug);
    }
  }

  if (event.target.id === 'close-btn') {
    handleCloseBtn();
  }
};

document.body.addEventListener('click', handleClick);

const printPressLinks = async () => {
  const projects = await fetchProjects();
  const projectListDiv = document.getElementById('press-list');

  if (projectListDiv) {
    const pressLinksMap = new Map();

    projects
      .filter(project => project.press.length > 0)
      .forEach(project =>
        project.press.forEach(pr => {
          const key = pr.title.toLowerCase();
          pressLinksMap.set(key, [...(pressLinksMap.get(key) || []), { projectName: project.title, ...pr }]);
        })
      );

    const sortedPressLinks = Array.from(pressLinksMap.values()).map(links =>
      links.sort((a, b) => a.title.localeCompare(b.title))
    );
    
    sortedPressLinks.sort((a, b) => a[0].title.localeCompare(b[0].title));

    const pressLinksHTML = sortedPressLinks
      .map(links => `<li>${links.map(pr => `<a href="${pr.link}" target="_blank" rel="noreferrer" data-more="${pr.projectName}, ${pr.date}">${pr.title}</a>`).join(' / ')}</li>`)
      .join('');

    projectListDiv.innerHTML = `<ul>${pressLinksHTML}</ul>`;
  }
};

printPressLinks();

/* Wall */
const i = { e: document.querySelector('#wall-image'), x: 0, y: 0 };
let tX = 0, tY = 0;
let decelerate = false;

function init() {
  r();
  i.e.style.transform = 'translate(0px, 0px)';
  window.addEventListener('mousemove', mV);
  window.addEventListener('touchmove', mV);
  window.addEventListener('resize', r);
}

function r() {
  const { innerWidth: w, innerHeight: h } = window;
  i.xM = w - i.e.naturalWidth;
  i.yM = h - i.e.naturalHeight;
}

function mV(event) {
  const { clientX, clientY } = event.targetTouches?.[0] || event;
  tX = map(clientX, 0, window.innerWidth, 0, i.xM);
  tY = map(clientY, 0, window.innerHeight, 0, i.yM);
  decelerate = false;
}

function map(x, a, b, c, d) { return c + ((d - c) * (x - a)) / (b - a) || 0; }

function l(s, e, t) { return s * (1 - t) + e * t; }

function animate() {
  if (!cV()) {
    if (decelerate) {
      i.x = l(i.x, tX, 0.02);
      i.y = l(i.y, tY, 0.02);
    } else {
      i.x = l(i.x, tX, 0.01);
      i.y = l(i.y, tY, 0.01);
    }

    i.e.style.transform = `translate(${i.x}px, ${i.y}px)`;
  } else {
    decelerate = true;
  }
  requestAnimationFrame(animate);
}

function cV() {
  return !!(
    document.querySelector('#info').offsetParent ||
    document.querySelector('#project').offsetParent
  );
}

window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animate);
});

const areas = document.getElementsByTagName('area');
const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

for (const area of areas) {
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  area.addEventListener('mouseover', mouseOver);
  area.addEventListener('mouseout', mouseOut);
}

function mouseOver(event) {
  if (mobile) return;
  const tooltip = document.createElement('div');
  tooltip.id = 'tooltip';
  tooltip.style.position = 'absolute';
  tooltip.innerHTML = this.getAttribute('title');
  document.body.appendChild(tooltip);
  updateTooltipPosition(event, tooltip);
  window.addEventListener('mousemove', (event) => updateTooltipPosition(event, tooltip));
  this.removeAttribute('title');
}

function mouseOut() {
  if (mobile) return;
  const tooltip = document.getElementById('tooltip');
  tooltip.remove();
  this.setAttribute('title', tooltip.innerHTML);
}

function updateTooltipPosition(event, tooltip) {
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.style.left = `${event.pageX + 10}px`;
}