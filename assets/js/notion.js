/***************************************** Notion *****************************************/
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
          return html`
          <style>#latest{display: block;}</style>
          <li style="text-transform: none;">${block.properties.title.map(renderText)}</li>`;
        }
        default:
          return block.title;
    }
  });

  render(content, document.querySelector('#latest + ul'))
}
Noticerun();

/***************************************** Jobs *****************************************/
  const CareerstableTemplate = table => html`
      ${table.map(({Position, Location, Contract, Slug}) => html`
        <style>#jobs{display: block;}</style>
        <li style="text-transform: none;"><a href="${Slug}" target="_blank" data-value="${Location}, ${Contract}">${Position}</a></li>
      `)}
  `;

    fetch('https://notion-api.splitbee.io/v1/table/c87900ce8abc4ed28c77222beebebeac')
      .then(handleAsJson)
      .then(trace('table is'))
      .then(CareerstableTemplate)
      .then(trace('template result is'))
      .then(result =>
        render(result, document.querySelector('#jobs + ul')))
