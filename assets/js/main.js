/*****************************************  Notion Render  *****************************************/

import { html, render } from 'https://unpkg.com/lit?module';

const handleAsJson = response => response.json();

const trace = tag => x => {
  console.log(tag, x);
  return x;
}

function renderText(node) {
  if (node.length === 1)
    return node[0];

  const [content, [[tagName, attr]]] = node;
  if (tagName === 'a') {
    return html`
      <a href="${attr}" target="_blank">${content}</a>
    `;
  }
  else return node;
}

/***************************************** Notice *****************************************/

  async function Noticerun() {

    const result = await fetch('https://notion-api.splitbee.io/v1/page/f97f1af964fe48989650aae62609bf37').then(handleAsJson)

    const page = Object.values(result).find(x => x.value.type === 'page');

    const blocks = page.value.content.map(id => result[id].value);

console.log(blocks.map(x => x.type))

const content = blocks.map(block => {
  switch (block.type) {
    case 'text':
      if (!block.properties) return '';
      else {
        return html`<span>${block.properties.title.map(renderText)}</span>`;
      }
      default:
        return block.title;
  }
  });

  render(content, document.getElementById('nav-bottom--notice'))
}
Noticerun();

/***************************************** Clients *****************************************/

  const ClientstableTemplate = table => html`
      ${table.map(({Client}) => html`
        <span>${Client}</span>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/2879a5a7fb2e4341b79a7132b2d399ca')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ClientstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('clients-list')))

/***************************************** Services *****************************************/

  const ServicestableTemplate = table => html`
      ${table.map(({Service}) => html`
        <span>${Service}</span>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/152f1eda45414a1fa5a625b607a8915b')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ServicestableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('services-list')))

/***************************************** Projects *****************************************/

  const ProjectstableTemplate = table => html`
      ${table.map(({id, Project, Date, Status, Slug}) => html`
        <li><a href="${Slug}" target="_blank"><span>${Project}</span><span>${Date}</span><span>${Status}</span></a></li>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/40ee05b104644055b139eefafd9ae800')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ProjectstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('project-list')))

/***************************************** Press *****************************************/

  const PresstableTemplate = table => html`
      ${table.map(({id, Recognition, Outlet, Project, Published, Slug}) => html`
        <li><a href="${Slug}" target="_blank"><span>${Outlet}</span><span>${Recognition}</span><span>${Project}</span><span>${Published}</span></a></li>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/cd48ac8833464607818ff47ee43fb791')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(PresstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('press-list')))

/***************************************** Jobs *****************************************/

  const CareerstableTemplate = table => html`
      ${table.map(({id, Status, Location, Position, Contract, close, Slug}) => html`
        <p><a href="${Slug}" target="_blank">${Location}, ${Position}, ${Contract} – ${Status}.</a></p>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/c87900ce8abc4ed28c77222beebebeac')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(CareerstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('jobs-list')))

/***************************************** Login *****************************************/

(function() {
  var textArea = document.getElementById('command--input');

  textArea.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      login(textArea);
    }
  });
})();

function login(textArea) {
	var value = textArea.value;

  if (value.match(/^([\w\-]+)/)[1].toLowerCase() === 'uname') {

    window.open('https://dev.headless.horse/' + value.match('uname(.*)')[1].trim());
  }
}

/***************************************** Privacy *****************************************/

  $(document).on('keypress', 'input', function(e) {
    if (e.which == 13) {
      var inputVal = $(this).val();
      if (inputVal == 'privacy') {
        setTimeout(function(e) {
          window.open('https://www.iubenda.com/privacy-policy/86096520/', '_blank');
        });
      }
    }
  });

/***************************************** Tweet *****************************************/

  $(document).on('keypress', 'input', function(e) {
    if (e.which == 13) {
      var inputVal = $(this).val();
      if (inputVal == 'tweet') {
        setTimeout(function(e) {
          window.open('https://twitter.com/intent/tweet?url=headless.horse&text=@headless__horse', '_blank');
        });
      }
    }
  });

/***************************************** Email *****************************************/

  $(document).on('keypress', 'input', function(e) {
    if (e.which == 13) {
      var inputVal = $(this).val();
      if (inputVal == 'email') {
        setTimeout(function(e) {
          window.location.href = 'mailto:name@email.com?subject=Headless%20Horse&body=I%20thought%20you%20might%20like%20this:%20https://headless.horse/';
        });
      }
    }
  });
