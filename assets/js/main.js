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



/***************************************** NOTICE *****************************************/

  async function Noticerun() {

    const result = await fetch("https://notion-api.splitbee.io/v1/page/f97f1af964fe48989650aae62609bf37").then(handleAsJson)

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



/***************************************** INFO *****************************************/



  async function Info() {

    const result = await fetch("https://notion-api.splitbee.io/v1/page/a1f6fd4a910349c0ad29c9d8ee428780").then(handleAsJson)

    const page = Object.values(result).find(x => x.value.type === 'page');

    const blocks = page.value.content.map(id => result[id].value);

console.log(blocks.map(x => x.type))

  const content = blocks.map(block => {
    switch (block.type) {
      case 'sub_header':
        return html`<p style="text-transform: uppercase;">${block.properties.title}</p>`;
      case 'divider':
        return html`<br>`;
      case 'text':
        if (!block.properties) return '';
        else {
          return html`<p>${block.properties.title.map(renderText)}</p>`;
        }
        default:
          return block.title;
    }
  });

  render(content, document.getElementById('info-list'))
}
Inforun();


/***************************************** CLIENTS *****************************************/


  const ClientstableTemplate = table => html`
      ${table.map(({Client}) => html`
        <span>${Client}</span>
      `)}
  `;

    fetch("https://notion-api.splitbee.io/v1/table/2879a5a7fb2e4341b79a7132b2d399ca")
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ClientstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('clients-list')))



/***************************************** SERVICES *****************************************/



  const ServicestableTemplate = table => html`
      ${table.map(({Service}) => html`
        <span>${Service}</span>
      `)}
  `;

    fetch("https://notion-api.splitbee.io/v1/table/152f1eda45414a1fa5a625b607a8915b")
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ServicestableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('services-list')))



/***************************************** PROJECTS *****************************************/



  const ProjectstableTemplate = table => html`
      ${table.map(({id, Project, Date, Status, Slug}) => html`
        <li><a href="${Slug}" target="_blank"><span>${Project}</span><span>${Date}</span><span>${Status}</span></a></li>
      `)}
  `;

    fetch("https://notion-api.splitbee.io/v1/table/40ee05b104644055b139eefafd9ae800")
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(ProjectstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('project-list')))



/***************************************** PRESS *****************************************/



  const PresstableTemplate = table => html`
      ${table.map(({id, Recognition, Outlet, Project, Published, Slug}) => html`
        <li><a href="${Slug}" target="_blank"><span>${Outlet}</span><span>${Recognition}</span><span>${Project}</span><span>${Published}</span></a></li>
      `)}
  `;

    fetch("ttps://notion-api.splitbee.io/v1/table/cd48ac8833464607818ff47ee43fb791")
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(PresstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('press-list')))








/***************************************** SHOP *****************************************/

  $(document).on("keypress", "input", function(e) {
    if (e.which == 13) {
      var inputVal = $(this).val();
      if (inputVal == "shop") {
        setTimeout(function(e) {
          window.open('https://shop.headless.horse/', '_blank');
        }, 1000);
      }
    }
  });





/***************************************** PRIVATE LOGIN *****************************************/

(function() {
  var textArea = document.getElementById("command--input");

  textArea.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      doclientSearch(textArea);
    }
  });
})();

function doclientSearch(textArea) {
	var value = textArea.value;

  if (value.match(/^([\w\-]+)/)[1].toLowerCase() === "uname") {

    window.open('https://dev.headless.horse/' + value.match('uname(.*)')[1].trim());
  }
}



/***************************************** CAREERS *****************************************/


  const CareerstableTemplate = table => html`
      ${table.map(({id, Status, Location, Position, Contract, close, Slug}) => html`
        <p><a href="${Slug}" target="_blank">${Location}, ${Position}, ${Contract} – ${Status}.</a></p>
      `)}
  `;

    fetch("https://notion-api.splitbee.io/v1/table/c87900ce8abc4ed28c77222beebebeac")
    .then(handleAsJson) // Promise<TableJson>
    .then(trace('table is'))
    .then(CareerstableTemplate) // Promise<TemplateResult>
		.then(trace('template result is'))
    .then(result =>
			render(result, document.getElementById('careers-list')))




/***************************************** THANKS *****************************************/



  async function Thanksrun() {

    const result = await fetch("https://notion-api.splitbee.io/v1/page/5973e1cc89df455dbc0e9c4e517b3e9f").then(handleAsJson)

    const page = Object.values(result).find(x => x.value.type === 'page');

    const blocks = page.value.content.map(id => result[id].value);

console.log(blocks.map(x => x.type))

  const content = blocks.map(block => {
    switch (block.type) {
      case 'sub_header':
        return html`<p style="text-transform: uppercase;">${block.properties.title}</p>`;
      case 'divider':
        return html`<br>`;
      case 'text':
        if (!block.properties) return '';
        else {
          return html`<p>${block.properties.title.map(renderText)}</p>`;
        }
        default:
          return block.title;
    }
  });

  render(content, document.getElementById('thanks-list'))
}
Thanksrun();




/***************************************** IMPRINT *****************************************/



  async function Imprintrun() {

    const result = await fetch("https://notion-api.splitbee.io/v1/page/314869ae00f14b728bd642c732f70915").then(handleAsJson)

    const page = Object.values(result).find(x => x.value.type === 'page');

    const blocks = page.value.content.map(id => result[id].value);

console.log(blocks.map(x => x.type))

  const content = blocks.map(block => {
    switch (block.type) {
      case 'sub_header':
        return html`<p style="text-transform: uppercase;">${block.properties.title}</p>`;
      case 'divider':
        return html`<br>`;
      case 'text':
        if (!block.properties) return '';
        else {
          return html`<p>${block.properties.title.map(renderText)}</p>`;
        }
        default:
          return block.title;
    }
  });

  render(content, document.getElementById('imprint-list'))
}
Imprintrun();
