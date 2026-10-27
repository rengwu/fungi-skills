import {normalizeInput,snapshot,restoreDraft} from './model.mjs';
const element=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node};
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const message=document.getElementById('message');
const showError=error=>{message.textContent=error.message;message.hidden=false};

function renderReport(markdown){
 const report=document.getElementById('outcome-report'),renderer=new marked.Renderer();
 renderer.html=({text})=>escape(text);
 renderer.image=({href,text})=>/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(href)?`<img src="${escape(href)}" alt="${escape(text)}">`:escape('[Image unavailable: '+text+']');
 renderer.link=({href,text})=>`<span class="source-reference">${escape(text)} (${escape(href)})</span>`;
 report.innerHTML=DOMPurify.sanitize(marked.parse(markdown,{gfm:true,renderer}),{ALLOWED_TAGS:['p','br','strong','em','del','ul','ol','li','blockquote','h1','h2','h3','h4','h5','h6','pre','code','table','thead','tbody','tr','th','td','hr','img','span'],ALLOWED_ATTR:['class','align','start','src','alt']});
 let number=0;
 for(const code of report.querySelectorAll('pre>code.language-mermaid')){
  const source=code.textContent,box=element('div');box.className='diagram';box.setAttribute('aria-label','Outcome diagram');code.parentElement.replaceWith(box);
  try{
   if(/%%\s*\{/.test(source)||/^\s*---/.test(source))throw new Error('Configuration directives are unsupported.');
   const {svg}=pele.render(source,{idPrefix:'outcome-'+(++number),links:false,images:false,autoDirection:false,limit:12000,maxEdges:150,outputLimit:1000000});
   box.innerHTML=DOMPurify.sanitize(svg,{USE_PROFILES:{svg:true,svgFilters:true},FORBID_TAGS:['foreignObject','image','a','style']});box.dataset.renderState='ready';
  }catch{
   const warning=element('p','Diagram could not be rendered; source follows.');warning.className='diagram-error';
   box.append(warning,element('pre',source));box.dataset.renderState='error';
  }
 }
}

async function start(){
 const ready=await fungi.ready(),spec=normalizeInput(ready.input);
 const draft=restoreDraft(ready.draft,ready.attachments,spec,ready.limits);
 const form=document.getElementById('feedback'),notes=document.getElementById('notes'),submit=document.getElementById('submit'),close=document.getElementById('cancel'),warning=document.getElementById('draft-message');
 document.getElementById('title').textContent=spec.title;
 const project=document.getElementById('project-name');project.textContent=spec.projectName;project.hidden=!spec.projectName;
 document.title=[spec.projectName,spec.title].filter(Boolean).join(' — ');
 document.getElementById('delivery').textContent='Feedback is optional. Submit to send and close.'+(ready.delivery?.mode==='manual'?' After submitting, tell your agent “done”.':'');
 renderReport(spec.markdown);
 const images=draft.images,urls=new Map();let nextImage=Math.max(0,...images.keys())+1,busy=false,timer,saving=Promise.resolve(),generation=0;
 notes.value=draft.notes;notes.disabled=false;close.disabled=false;
 const payload=(submitted=false)=>snapshot(spec,notes.value,images,ready.limits,submitted);
 function renderImages(){
  const box=document.getElementById('images');box.replaceChildren();
  const referenced=new Set([...notes.value.matchAll(/\[Image #(\d+)\]/g)].map(m=>Number(m[1])));
  for(const [id,blob] of images){
   if(!referenced.has(id))continue;
   if(!urls.has(id))urls.set(id,URL.createObjectURL(blob));
   const button=element('button');button.type='button';button.className='image-chip';button.setAttribute('aria-label','Preview Image #'+id);
   const image=element('img');image.src=urls.get(id);image.alt='';button.append(image,element('span',`[Image #${id}]`));
   button.addEventListener('click',()=>{const dialog=document.getElementById('image-preview');dialog.querySelector('img').src=urls.get(id);dialog.showModal();});box.append(button);
  }
 }
 function updateButton(){try{payload(true);submit.disabled=busy;}catch{submit.disabled=true;}}
 function saveDraft(){
  clearTimeout(timer);timer=undefined;if(busy)return saving;
  let value;const current=generation;
  try{value=payload();}catch(error){warning.textContent='Draft not saved';warning.hidden=false;showError(error);return saving;}
  saving=saving.catch(()=>{}).then(()=>fungi.saveDraft(value.data,value.attachments)).then(()=>{if(current===generation&&!timer){warning.textContent='Draft saved';warning.hidden=false;}}).catch(error=>{warning.textContent='Draft not saved';warning.hidden=false;showError(error);});
  return saving;
 }
 function changed(){
  if(busy)return;
  generation++;message.hidden=true;renderImages();updateButton();warning.textContent='Saving draft…';warning.hidden=false;clearTimeout(timer);timer=setTimeout(saveDraft,400);
 }
 notes.addEventListener('input',changed);
 notes.addEventListener('paste',event=>{
  const files=[...(event.clipboardData?.items??[])].filter(item=>item.kind==='file').map(item=>item.getAsFile()).filter(Boolean);
  if(!files.length)return;event.preventDefault();if(busy)return;
  // Validate the complete proposed edit before changing the editor.
  const proposed=new Map(images),ids=[];
  for(const blob of files){const id=nextImage++;proposed.set(id,blob);ids.push(id);}
  const inserted=ids.map(id=>`[Image #${id}]`).join(' ');
  const value=notes.value.slice(0,notes.selectionStart)+inserted+notes.value.slice(notes.selectionEnd);
  try{snapshot(spec,value,proposed,ready.limits);}catch(error){showError(error);return;}
  for(const id of ids)images.set(id,proposed.get(id));
  notes.setRangeText(inserted,notes.selectionStart,notes.selectionEnd,'end');changed();
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  let value;try{value=payload(true);}catch(error){showError(error);return;}
  clearTimeout(timer);busy=true;form.inert=true;submit.disabled=true;submit.textContent='Submitting…';message.hidden=true;
  try{await saving;await fungi.submit(value.data,value.attachments);}catch(error){busy=false;form.inert=false;submit.textContent='Submit feedback';updateButton();showError(error);message.focus();}
 });
 close.addEventListener('click',async()=>{
  if(busy)return;const pending=saveDraft();busy=true;form.inert=true;
  try{await pending;await fungi.cancel();}catch(error){busy=false;form.inert=false;showError(error);}
 });
 renderImages();updateButton();
 if(ready.draft){warning.textContent='Saved draft restored';warning.hidden=false;}
}
start().catch(showError);
