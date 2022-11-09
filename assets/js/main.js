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
      ${table.map(({id, Position, Location, Contract, Slug}) => html`
        <p><a href="${Slug}" target="_blank">${Position} — ${Location}, ${Contract}.</a></p>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/c87900ce8abc4ed28c77222beebebeac')
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(CareerstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('jobs-list')))
