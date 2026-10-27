// UI adapted from jstack ff6ac0b. See ../references/provenance.md.
import {normalizeSpec, IMAGE_LIMITS, validRegion} from './model.mjs';
import {snapshot, restoreDraft} from './transport.mjs';
async function start(){
// Inline image editing for the offline form. The browser owns text editing and
// undo; image bytes stay outside the editable DOM and travel in the answer JSON.
const imageAssets = new Map();
let nextImageId = 1;
let previewDialog;
const imageToken = id => `[Image #${id}]`;
const imageTypes = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
function readNotes(root) {
 const result = {notes: '', images: []};
 function visit(parent) {
  [...parent.childNodes].forEach((node, i, siblings) => {
   const block = node.nodeType === 1 && /^(DIV|P)$/.test(node.tagName);
   const previousBlock = i > 0 && /^(DIV|P)$/.test(siblings[i-1].nodeName);
   if (i > 0 && (block || previousBlock)) result.notes += '\n';
   if (node.nodeType === 3) result.notes += node.textContent;
   else if (node.nodeType === 1) {
    const id = Number(node.dataset.imageId);
    if (node.classList.contains('image-chip') && imageAssets.has(id)) {
     result.images.push({id, offset: result.notes.length, dataUrl: imageAssets.get(id).dataUrl});
     result.notes += imageToken(id);
    } else if (node.tagName === 'BR') {
     // A final BR is the browser's caret placeholder, not a second newline.
     if (i < siblings.length - 1) result.notes += '\n';
    } else visit(node);
   }
  });
 }
 visit(root);
 return result;
}
function imageChip(id) {
 const chip = element('span', imageToken(id), 'image-chip');
 chip.contentEditable = 'false'; chip.dataset.imageId = id; chip.tabIndex = 0;
 chip.setAttribute('role', 'button'); chip.setAttribute('aria-label', 'Preview Image #'+id);
 chip.title = 'Preview Image #'+id;
 return chip;
}
function notesFragment(answer) {
 const fragment = document.createDocumentFragment();
 let offset = 0;
 for (const image of answer.images ?? []) {
  fragment.append(document.createTextNode(answer.notes.slice(offset, image.offset)), imageChip(image.id));
  offset = image.offset + imageToken(image.id).length;
 }
 fragment.append(document.createTextNode(answer.notes.slice(offset)));
 return fragment;
}
function restoreImages() {
 for (const answer of allNotes()) {
  let end = 0;
  if (!Array.isArray(answer.images ?? [])) throw new Error('Invalid draft images');
  for (const image of answer.images ?? []) {
   if (!Number.isSafeInteger(image.id) || image.id < 1 || image.id > 1_000_000 || imageAssets.has(image.id) ||
       !Number.isSafeInteger(image.offset) || image.offset < end || answer.notes.slice(image.offset, image.offset + imageToken(image.id).length) !== imageToken(image.id) ||
       typeof image.dataUrl !== 'string' || !/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image.dataUrl)) throw new Error('Invalid draft image');
   const base64 = image.dataUrl.split(',')[1], bytes = atob(base64).length;
   if (bytes > state.imageLimits.fileBytes) throw new Error('Draft image too large');
   imageAssets.set(image.id, {dataUrl: image.dataUrl, bytes});
   nextImageId = Math.max(nextImageId, image.id + 1);
   end = image.offset + imageToken(image.id).length;
  }
 }
 if (imageAssets.size > state.imageLimits.count || [...imageAssets.values()].reduce((sum, image) => sum + image.bytes, 0) > state.imageLimits.totalBytes) throw new Error('Draft images too large');
}
function previewImage(id) {
 const asset = imageAssets.get(id);
 if (!asset?.dataUrl) return;
 if (!previewDialog) {
  previewDialog = element('dialog', undefined, 'image-preview');
  const heading = element('h2'); heading.id = 'image-preview-title';
  previewDialog.setAttribute('aria-labelledby', heading.id);
  const close = element('button', 'Close preview'); close.type = 'button';
  close.addEventListener('click', () => previewDialog.close());
  previewDialog.append(heading, element('img'), close); document.body.append(previewDialog);
 }
 previewDialog.querySelector('h2').textContent = imageToken(id);
 const img = previewDialog.querySelector('img'); img.src = asset.dataUrl; img.alt = 'Image #'+id;
 previewDialog.showModal();
}
function notesReady() {
 return allNotes().every(answer => answer.notes.length <= 12000 && (answer.images ?? []).every(image => !!image.dataUrl));
}
function allNotes() { return answers.flatMap(answer => [answer, ...(answer.comments ?? [])]); }
function createNotesEditor(question, index, answer = answers[index], onChange = () => {}) {
 let disposed = false;
 const notes = element('div', undefined, 'notes-editor'); notes.id = 'notes-'+question.id;
 notes.contentEditable = 'true'; notes.setAttribute('role', 'textbox'); notes.setAttribute('aria-multiline', 'true');
 notes.setAttribute('aria-label', 'Notes for question '+question.number);
 notes.append(notesFragment(answer));
 const error = element('p', '', 'error'); error.hidden = true; error.id = notes.id+'-error'; error.setAttribute('role', 'status');
 notes.setAttribute('aria-describedby', error.id);
 function warn(text) { error.textContent = text; error.hidden = !text; }
 function moveCaretOutsideChip() {
  const selection = getSelection();
  if (!selection.isCollapsed || !selection.focusNode) return;
  const node = selection.focusNode.nodeType === 3 ? selection.focusNode.parentElement : selection.focusNode;
  const chip = node.closest?.('.image-chip');
  if (chip && notes.contains(chip)) {
   const range = document.createRange(); range.setStartAfter(chip); range.collapse(true);
   selection.removeAllRanges(); selection.addRange(range);
  }
 }
 function sync() {
  if(disposed)return;
  // Redo may recreate nodes without the attributes applied after insertion.
  notes.querySelectorAll('.image-chip').forEach(chip => { chip.contentEditable = 'false'; });
  moveCaretOutsideChip();
  Object.assign(answer, readNotes(notes));
  const failed = answer.images.some(image => imageAssets.get(image.id)?.failed);
  const pending = answer.images.some(image => !image.dataUrl);
  const tooLong = answer.notes.length > 12000;
  notes.setAttribute('aria-invalid', String(tooLong || failed));
  warn(tooLong ? 'Keep notes within 12,000 characters.' : failed ? 'An image could not be read. Delete its chip and paste it again.' : pending ? 'Reading image…' : '');
  update(); onChange();
 }
 // Editing commands preserve native undo, including image insertion/deletion.
 function insertHTML(html) {
  // Chromium can move an already noneditable fragment outside its current line.
  // Make chips atomic after insertion, retaining the inserted nodes for undo.
  if (!document.execCommand('insertHTML', false, html.replaceAll('contenteditable="false"', 'contenteditable="true"'))) { warn('This browser could not insert the clipboard content.'); return false; }
  sync(); return true;
 }
 function selectChip(chip) {
  const range = document.createRange(); range.selectNode(chip);
  const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
 }
 notes.addEventListener('input', sync);
 notes.addEventListener('click', event => {
  const chip = event.target.closest('.image-chip'); if (chip) previewImage(Number(chip.dataset.imageId));
 });
 notes.addEventListener('keydown', event => {
  const focused = event.target.closest('.image-chip');
  if (focused && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); previewImage(Number(focused.dataset.imageId)); return; }
  if (!['Backspace', 'Delete'].includes(event.key) || event.isComposing) return;
  const selection = getSelection();
  if (focused) { event.preventDefault(); notes.focus(); selectChip(focused); document.execCommand('delete'); sync(); return; }
  if (!selection.rangeCount || !selection.isCollapsed) return;
  const range = selection.getRangeAt(0), backward = event.key === 'Backspace';
  let node = range.startContainer, offset = range.startOffset;
  if (node.nodeType === 3) {
   if (backward ? offset > 0 : offset < node.length) return;
  } else {
   const child = node.childNodes[backward ? offset-1 : offset];
   if (child) node = child;
   else if (node === notes) return;
  }
  // Look across empty text nodes at the caret without crossing a line boundary.
  while (node !== notes && !(node.nodeType === 1 && node.classList.contains('image-chip'))) {
   if (node.nodeType === 3 && node !== range.startContainer && node.length) return;
   if (node.nodeType === 1) return;
   node = backward ? node.previousSibling : node.nextSibling;
   if (!node) return;
  }
  if (node !== notes && node?.classList?.contains('image-chip')) {
   event.preventDefault(); selectChip(node); document.execCommand('delete'); sync();
  }
 });
 notes.addEventListener('paste', event => {
  const clipboard = event.clipboardData; if (!clipboard) return;
  event.preventDefault();
  const files = [...clipboard.items].filter(item => item.kind === 'file').map(item => item.getAsFile()).filter(Boolean);
  const active = allNotes().flatMap(answer => answer.images ?? []);
  function fits(incoming) {
   if (active.length + incoming.length > state.imageLimits.count || active.reduce((sum, image) => sum + imageAssets.get(image.id).bytes, 0) + incoming.reduce((sum, image) => sum + image.bytes, 0) > state.imageLimits.totalBytes) {
    warn('Use at most 20 images and 20 MiB of images per form.'); return false;
   }
   return true;
  }
  if (files.length) {
   if (files.some(file => !imageTypes.has(file.type))) { warn('Paste a PNG, JPEG, GIF, or WebP image.'); return; }
   if (files.some(file => file.size > state.imageLimits.fileBytes)) { warn('Each image must be 5 MiB or smaller.'); return; }
   if (!fits(files.map(file => ({bytes: file.size})))) return;
   const pending = files.map(file => {
    const id = nextImageId++; imageAssets.set(id, {bytes: file.size}); return {id, file};
   });
   // Insert immediately so an asynchronous read cannot move the paste to a new caret.
   if (!insertHTML(pending.map(({id}) => imageChip(id).outerHTML).join(''))) return;
   for (const {id, file} of pending) {
    const reader = new FileReader();
    reader.onload = () => {
     const img = new Image();
     img.onload = () => { imageAssets.get(id).dataUrl = reader.result; sync(); };
     img.onerror = () => { imageAssets.get(id).failed = true; sync(); };
     img.src = reader.result;
    };
    reader.onerror = () => { imageAssets.get(id).failed = true; sync(); };
    reader.readAsDataURL(file);
   }
   return;
  }
  // Keep references when moving/copying text within this form. External text
  // that happens to contain "[Image #1]" remains ordinary text.
  try {
   const copied = JSON.parse(clipboard.getData('application/x-grill-form-notes'));
   if (copied.sessionId === state.sessionId && typeof copied.notes === 'string' && copied.notes.length <= 12000 && Array.isArray(copied.images) && copied.images.length) {
    let end = 0;
    const valid = copied.images.every(image => {
     const token = imageToken(image.id);
     if (!imageAssets.get(image.id)?.dataUrl || !Number.isSafeInteger(image.offset) || image.offset < end || copied.notes.slice(image.offset, image.offset + token.length) !== token) return false;
     end = image.offset + token.length; return true;
    });
    if (valid) {
     if (!fits(copied.images.map(image => imageAssets.get(image.id)))) return;
     let html = '', offset = 0;
     for (const image of copied.images) {
      const id = nextImageId++; imageAssets.set(id, imageAssets.get(image.id));
      html += escapeHTML(copied.notes.slice(offset, image.offset)) + imageChip(id).outerHTML;
      offset = image.offset + imageToken(image.id).length;
     }
     insertHTML(html + escapeHTML(copied.notes.slice(offset))); return;
    }
   }
  } catch {} // Other applications supply plain text or ordinary image files.
  // Only plain text enters from external rich-text clipboard content.
  const text = clipboard.getData('text/plain');
  if (text) { document.execCommand('insertText', false, text); sync(); }
 });
 for (const type of ['copy', 'cut']) notes.addEventListener(type, event => {
  const selection = getSelection();
  if (!event.clipboardData || !selection.rangeCount || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  if (!notes.contains(range.startContainer) || !notes.contains(range.endContainer)) return;
  const copied = readNotes(range.cloneContents());
  event.clipboardData.setData('text/plain', copied.notes);
  event.clipboardData.setData('application/x-grill-form-notes', JSON.stringify({sessionId: state.sessionId, notes: copied.notes, images: copied.images.map(({id, offset}) => ({id, offset}))}));
  event.preventDefault();
  if (type === 'cut') { document.execCommand('delete'); sync(); }
 });
 // Native rich-text drops could insert untracked images or formatting.
 notes.addEventListener('drop', event => event.preventDefault());
 notes.addEventListener('beforeinput', event => { if (event.inputType.startsWith('format')) event.preventDefault(); });
 return {notes, error, dispose(){disposed=true}};
}

// Every preview has an opaque origin. Only bounded state, scroll positions and
// region coordinates cross the boundary; no form CSS or DOM is shared.
function previewBridge(token, initial, restore) {
 const send = (type, value) => parent.postMessage({grill: token, type, value}, '*');
 let current = initial;
 const copy = value => {
  const json = JSON.stringify(value);
  if (!value || typeof value !== 'object' || Array.isArray(value) || json.length > 12000) throw new Error('Use a state object within 12,000 characters');
  return JSON.parse(json);
 };
 Object.defineProperty(window, 'grill', {value: Object.freeze({
  get state() { return copy(current); },
  setState(value) { current = copy(value); send('state', current); }
 })});
 // Capturing observes clicks even when prototype controls stop propagation.
 window.addEventListener('click', event => {
  send('select', null);
  if (event.target.closest?.('a')) event.preventDefault();
 }, true);
 document.addEventListener('submit', event => event.preventDefault());
 window.addEventListener('message', event => {
  if (event.source !== parent || event.data?.grill !== token || event.data.type !== 'capture-region') return;
  const scroll = [];
  for (const node of document.querySelectorAll('html,body,body *')) {
   if ((!node.scrollLeft && !node.scrollTop) || scroll.length >= 64) continue;
   const path = [];
   for (let child=node; child.parentElement; child=child.parentElement) path.unshift([...child.parentElement.children].indexOf(child));
   if (path.length <= 32) scroll.push({path,x:node.scrollLeft,y:node.scrollTop});
  }
  send('region', {request:event.data.value, state:copy(current), scroll});
 });
 if (restore) window.addEventListener('load', () => requestAnimationFrame(() => {
  for (const s of restore) {
   let node = document.documentElement;
   for (const i of s.path) node = node?.children[i];
   if (node) { node.scrollLeft=s.x; node.scrollTop=s.y; }
  }
 }));
}
function renderPreview(preview, index, key, onRegion, onSelect, snapshot) {
 const shell=element('div',undefined,'preview-shell'+(snapshot?' comment-location':''));
 const stage=element('div',undefined,'preview-stage');
 const frame=element('iframe',undefined,'prototype');
 frame.title=(questions[index].prompt||'Review '+questions[index].number)+(key==='main'?' preview':' — '+questions[index].options.find(o=>'option-'+o.id===key).label);
 frame.setAttribute('sandbox','allow-scripts');frame.setAttribute('referrerpolicy','no-referrer');
 frame.style.height=(snapshot?.region.viewportHeight??preview.height)+'px';
 if(snapshot){
  frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');stage.inert=true;
  stage.style.width=snapshot.region.viewportWidth+'px';frame.style.width=stage.style.width;
 }
 const token=crypto.randomUUID();
 const initial=snapshot?.state??answers[index].states?.[key]??preview.state;
 const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
 const policy="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
 // The policy and bridge precede all authored markup, including its styles.
 frame.srcdoc='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="'+policy+'"><script>('+previewBridge.toString()+')('+json(token)+','+json(initial)+','+json(snapshot?.region.scroll??null)+')<\/script></head><body>'+preview.html+'</body></html>';
 const overlay=element('div',undefined,'comment-surface');overlay.hidden=!snapshot;
 const rectangle=element('div',undefined,'comment-region');rectangle.hidden=true;overlay.append(rectangle);
 let commenting=false,toggle,hint,drag,selected,pending,timer;
 function paint(region){
  selected=region;rectangle.hidden=!region;
  if(region)Object.assign(rectangle.style,{left:region.x+'px',top:region.y+'px',width:region.width+'px',height:region.height+'px'});
 }
 function mode(active){
  clearTimeout(timer);pending=null;drag=null;paint(null);
  commenting=active;overlay.hidden=!active;
  toggle.setAttribute('aria-pressed',String(active));toggle.textContent=active?'Cancel selection':'Comment on preview';
  hint.hidden=!active;hint.textContent='Drag any area. Arrows move; Shift + arrows resize; Enter comments.';
  if(active)overlay.focus();
 }
 function capture(){
  if(!selected||pending)return;
  onSelect?.();
  pending={request:crypto.randomUUID(),region:{...selected,viewportWidth:frame.clientWidth,viewportHeight:frame.clientHeight}};
  frame.contentWindow.postMessage({grill:token,type:'capture-region',value:pending.request},'*');
  hint.textContent='Opening comment…';
  timer=setTimeout(()=>{pending=null;hint.textContent='Could not capture this area. Try selecting it again.'},2000);
 }
 if(!snapshot&&!state.archived&&!questions[index].options.length){
  const toolbar=element('div',undefined,'preview-toolbar');
  toggle=element('button','Comment on preview','comment-toggle');toggle.type='button';toggle.setAttribute('aria-pressed','false');
  hint=element('span',undefined,'comment-hint');hint.hidden=true;hint.setAttribute('role','status');
  toggle.addEventListener('click',()=>mode(!commenting));toolbar.append(toggle,hint);shell.append(toolbar);
  overlay.tabIndex=0;overlay.setAttribute('role','group');overlay.setAttribute('aria-label','Comment area. Drag to select, or use arrow keys to move, Shift and arrows to resize, and Enter to comment. Escape cancels.');
  const point=event=>{const r=overlay.getBoundingClientRect();return {x:Math.max(0,Math.min(frame.clientWidth,Math.round(event.clientX-r.left))),y:Math.max(0,Math.min(frame.clientHeight,Math.round(event.clientY-r.top)))}};
  overlay.addEventListener('pointerdown',event=>{
   if(!event.isPrimary||event.button!==0||pending)return;
   event.preventDefault();overlay.focus();drag={...point(event),id:event.pointerId};paint(null);overlay.setPointerCapture(event.pointerId);
  });
  overlay.addEventListener('pointermove',event=>{
   if(!drag||event.pointerId!==drag.id)return;
   const p=point(event);paint({x:Math.min(drag.x,p.x),y:Math.min(drag.y,p.y),width:Math.abs(p.x-drag.x),height:Math.abs(p.y-drag.y)});
  });
  overlay.addEventListener('pointerup',event=>{
   if(!drag||event.pointerId!==drag.id)return;
   drag=null;overlay.releasePointerCapture(event.pointerId);
   if(selected?.width>=4&&selected.height>=4)capture();else paint(null);
  });
  for(const type of ['pointercancel','lostpointercapture'])overlay.addEventListener(type,()=>{if(drag){drag=null;paint(null)}});
  overlay.addEventListener('keydown',event=>{
   if(event.key==='Enter'){event.preventDefault();capture();return}
   if(!event.key.startsWith('Arrow')||pending)return;
   event.preventDefault();
   const r={...(selected??{x:20,y:20,width:Math.min(120,frame.clientWidth-20),height:Math.min(80,frame.clientHeight-20)})};
   const dx=event.key==='ArrowLeft'?-8:event.key==='ArrowRight'?8:0,dy=event.key==='ArrowUp'?-8:event.key==='ArrowDown'?8:0;
   if(event.shiftKey){r.width=Math.max(4,Math.min(frame.clientWidth-r.x,r.width+dx));r.height=Math.max(4,Math.min(frame.clientHeight-r.y,r.height+dy))}
   else {r.x=Math.max(0,Math.min(frame.clientWidth-r.width,r.x+dx));r.y=Math.max(0,Math.min(frame.clientHeight-r.height,r.y+dy))}
   paint(r);
  });
  shell.addEventListener('keydown',event=>{if(event.key==='Escape'&&commenting){event.preventDefault();mode(false);toggle.focus()}});
 }
 stage.append(frame,overlay);shell.append(stage);
 const resize=new ResizeObserver(()=>{
  if(snapshot){
   const r=snapshot.region,scale=Math.min(1,shell.clientWidth/r.viewportWidth,260/r.viewportHeight);
   stage.style.width=r.viewportWidth+'px';stage.style.height=r.viewportHeight+'px';frame.style.width=r.viewportWidth+'px';
   stage.style.transform='scale('+scale+')';stage.style.marginLeft=(shell.clientWidth-r.viewportWidth*scale)/2+'px';
   shell.style.height=(r.viewportHeight*scale+2)+'px';paint(r);
  }else{
   // Chromium rounds its viewport down. Round up and clip the fractional outer
   // pixel so the iframe background cannot leave a white seam at its edge.
   const width=Math.ceil(stage.getBoundingClientRect().width)+'px';
   if(frame.style.width!==width){frame.style.width=width;if(commenting)mode(false)}
  }
 });
 resize.observe(shell);
 const receive=event=>{
  if(event.source!==frame.contentWindow||event.data?.grill!==token||state.archived||snapshot)return;
  const {type,value}=event.data;
  try{
   if(type==='state'&&value&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(value).length<=12000){
    answers[index].states??={};answers[index].states[key]=JSON.parse(JSON.stringify(value));update();
   }else if(type==='select')onSelect?.();
   else if(type==='region'&&pending&&value?.request===pending.request){
    const region={...pending.region,scroll:value.scroll};
    if(!validRegion(region)||!value.state||typeof value.state!=='object'||Array.isArray(value.state)||JSON.stringify(value.state).length>12000)return;
    mode(false);onRegion(key,region,value.state);
   }
  }catch{} // Malformed messages cannot alter the parent form.
 };
 window.addEventListener('message',receive);
 shell.dispose=()=>{clearTimeout(timer);resize.disconnect();window.removeEventListener('message',receive)};
 return shell;
}
function itemPreviews(q) {
 return Object.fromEntries([...(q.preview ? [['main', q.preview]] : []), ...q.options.filter(o=>o.preview).map(o=>['option-'+o.id,o.preview])]);
}
function validReviewDraft(a,q) {
 const previews=itemPreviews(q);
 const validState=value=>value&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(value).length<=12000;
 return (!a.states || (typeof a.states==='object'&&!Array.isArray(a.states))) && Object.keys(a.states ?? {}).every(key=>Object.hasOwn(previews,key)&&validState(a.states[key])) &&
  Array.isArray(a.comments ?? []) && (a.comments ?? []).length<=20 && (a.comments ?? []).every(c=>
   c&&Object.hasOwn(previews,c.preview)&&(c.region===undefined?previews[c.preview].anchors.includes(c.anchor):c.anchor===undefined&&validRegion(c.region))&&typeof c.notes==='string'&&c.notes.length<=12000&&validState(c.state));
}
function hasFeedback(a, q) {
 return complete(a) || (a.comments ?? []).some(c=>c.notes.trim()) ||
  Object.entries(a.states ?? {}).some(([key,value])=>JSON.stringify(value)!==JSON.stringify(itemPreviews(q)[key]?.state));
}
function canSubmit() {
 if (state.archived) return false;
 if (!state.review) return answers.every(complete);
 return answers.some((a,i)=>hasFeedback(a,questions[i])) && answers.every((a,i)=>
  (!questions[i].required || hasFeedback(a,questions[i])) &&
  (a.choiceId!=='other' || a.notes.trim() || (a.comments ?? []).some(c=>c.notes.trim())));
}
function commentControls(q, index) {
 const previews = itemPreviews(q), answer = answers[index];
 const box = element('div', undefined, 'comments');
 let nextComment = 0;
 answer.comments=(answer.comments ?? []).filter(c=>c.notes.trim());
 const label=comment=>{
  const option=q.options.find(o=>'option-'+o.id===comment.preview);
  return (option?option.label+' · ':'')+(comment.anchor??'Area '+(answer.comments.indexOf(comment)+1));
 };
 function commentBody(comment){
  const body=element('div',undefined,'comment-body');body.append(notesFragment(comment));
  const openImage=event=>{const chip=event.target.closest('.image-chip');if(chip){event.preventDefault();previewImage(Number(chip.dataset.imageId))}};
  body.addEventListener('click',openImage);
  body.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key))openImage(event)});
  return body;
 }
 function draw(){
  box.replaceChildren();
  for(const comment of answer.comments){
   if(!comment.notes.trim())continue;
   const row=element('section',undefined,'comment-summary');
   const heading=element('div',undefined,'comment-heading');
   heading.append(element('strong',label(comment)));
   if(!state.archived||comment.region){const edit=element('button',state.archived?'View area':'View / edit','quiet view-comment');edit.type='button';edit.addEventListener('click',()=>compose(comment));heading.append(edit)}
   row.append(heading,commentBody(comment));box.append(row);
  }
 }
 function compose(comment,isNew=false){
  const readonly=state.archived;
  const original=JSON.parse(JSON.stringify(comment));
  const dialog=element('dialog',undefined,'comment-dialog');
  const heading=element('h2',label(comment));heading.id=q.id+'-comment-heading';dialog.setAttribute('aria-labelledby',heading.id);
  const location=comment.region?renderPreview(previews[comment.preview],index,comment.preview,null,null,comment):null;
  const save=element('button','Save comment');save.type='button';save.className='save-comment';
  const cancel=element('button','Cancel','quiet');cancel.type='button';
  const remove=element('button','Delete comment','quiet');remove.type='button';
  let committed=false;
  const ready=()=>{save.disabled=!comment.notes.trim()||comment.notes.length>12000||(comment.images??[]).some(image=>!image.dataUrl)};
  const editor=readonly?null:createNotesEditor({id:q.id+'-comment-'+(++nextComment),number:q.number},index,comment,ready);
  const notes=editor?.notes??commentBody(comment);
  if(!readonly)notes.setAttribute('aria-label','Comment on '+label(comment));
  const actions=element('div',undefined,'comment-actions');actions.append(cancel,save);
  if(!isNew)actions.prepend(remove);
  if(readonly){cancel.textContent='Close';actions.replaceChildren(cancel)}
  save.addEventListener('click',()=>{if(save.disabled)return;committed=true;dialog.close()});
  cancel.addEventListener('click',()=>dialog.close());
  remove.addEventListener('click',()=>{answer.comments.splice(answer.comments.indexOf(comment),1);committed=true;dialog.close()});
  dialog.addEventListener('close',()=>{
   editor?.dispose();location?.dispose();
   if(!readonly&&!committed){if(isNew)answer.comments.splice(answer.comments.indexOf(comment),1);else{for(const key of Object.keys(comment))delete comment[key];Object.assign(comment,original)}}
   dialog.remove();draw();update();
   (box.querySelector('button')??box.closest('fieldset')?.querySelector('.comment-toggle'))?.focus();
  });
  dialog.append(heading);if(location)dialog.append(location);
  dialog.append(notes);if(editor)dialog.append(editor.error);dialog.append(actions);
  document.body.append(dialog);ready();dialog.showModal();(readonly?cancel:notes).focus();
 }
 function add(key,region,current){
  if(state.archived)return;
  if(answer.comments.length>=20){box.append(element('p','This item has 20 comments. Edit or remove one before adding another.','error'));return}
  const comment={preview:key,region,state:JSON.parse(JSON.stringify(current)),notes:''};
  answer.comments.push(comment);compose(comment,true);
 }
 draw();return {box,add};
}

let busy=false,saveTimer,saving=Promise.resolve(),generation=0;
const cancel=document.getElementById('cancel'),warning=document.getElementById('draft-message');
function showError(error){message.className='error';message.textContent=error.message;message.hidden=false;}
function saveDraft(){
 clearTimeout(saveTimer);saveTimer=undefined;
 if(busy||!notesReady())return saving;
 // Capture at the debounce boundary, then preserve mutation order.
 let payload;const savedGeneration=generation;
 try{payload=snapshot(spec,answers,fungiReady.limits)}catch(error){warning.textContent='Draft not saved';showError(error);return saving;}
 saving=saving.catch(()=>{}).then(()=>fungi.saveDraft(payload.data,payload.attachments)).then(()=>{
  if(savedGeneration===generation&&!saveTimer){warning.textContent='Draft saved';warning.hidden=false;}
 }).catch(error=>{warning.textContent='Draft not saved';showError(error);});
 return saving;
}
async function submitForm(event){
 event.preventDefault();if(busy||!canSubmit()||!notesReady())return;
 clearTimeout(saveTimer);saveTimer=undefined;busy=true;form.inert=true;submit.disabled=true;submit.textContent='Submitting…';message.hidden=true;
 try{
  const payload=snapshot(spec,answers,fungiReady.limits,true);
  await saving;
  await fungi.submit(payload.data,payload.attachments);
 }catch(error){busy=false;form.inert=false;submit.textContent='Submit feedback';submit.disabled=!canSubmit()||!notesReady();showError(error);message.focus();}
}
async function cancelForm(){
 if(busy)return;
 const pending=saveDraft();busy=true;form.inert=true;
 try{await pending;await fungi.cancel()}catch(error){busy=false;form.inert=false;showError(error);}
}
'use strict';
const fungiReady=await fungi.ready();
const spec=normalizeSpec(fungiReady.input,{richText:true,review:true});
const state={spec,richText:true,review:true,sessionId:crypto.randomUUID(),
 projectName:typeof fungiReady.input.projectName==='string'?fungiReady.input.projectName:'',
 imageLimits:{...IMAGE_LIMITS,fileBytes:Math.min(IMAGE_LIMITS.fileBytes,fungiReady.limits.artifactBytes),totalBytes:Math.min(IMAGE_LIMITS.totalBytes,fungiReady.limits.totalArtifactBytes)}};
const questions=state.spec.questions;
const form=document.getElementById('questions');
const actions=document.getElementById('actions');
const submit=document.getElementById('submit');
const message=document.getElementById('message');
const title=document.getElementById('title');
document.getElementById('project-name').textContent=state.projectName;
title.textContent=state.spec.title;document.title=state.projectName+' — '+state.spec.title;
let answers=questions.map(q=>({questionId:q.id,choiceId:null,notes:''}));
const draft=await restoreDraft(fungiReady.draft,fungiReady.attachments,spec);
if(draft){
 if(Array.isArray(draft)&&draft.length===questions.length&&draft.every((a,i)=>a&&a.questionId===questions[i].id&&typeof a.notes==='string'&&a.notes.length<=12000&&validReviewDraft(a,questions[i])&&(a.choiceId===null||a.choiceId==='other'||questions[i].options.some(o=>o.id===a.choiceId))))answers=draft;
 else throw new Error('Saved draft does not match this questionnaire. Preserve this session for recovery.');
}
restoreImages();
function element(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node}
const escapeHTML=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let diagramNumber=0;
let diagramQueue=Promise.resolve();
function diagramFallback(container,source,reason){
 container.replaceChildren(element('p','Diagram could not be rendered. '+reason,'diagram-error'));
 const details=element('details');details.open=true;
 const pre=element('pre');pre.append(element('code',source));
 details.append(element('summary','Diagram source'),pre);container.append(details);container.dataset.renderState='error';
}
async function renderDiagram(container,source){
 if(/%%\s*\{/.test(source)||/^\s*---/.test(source)){
  diagramFallback(container,source,'Use Mermaid syntax without configuration directives.');return;
 }
 try{
  const {svg}=pele.render(source,{idPrefix:'grill-diagram-'+(++diagramNumber),links:false,images:false,autoDirection:false,limit:12000,maxEdges:150,outputLimit:1000000});
  container.innerHTML=DOMPurify.sanitize(svg,{USE_PROFILES:{svg:true,svgFilters:true},FORBID_TAGS:['foreignObject','image','a','style']});
  const drawing=container.querySelector('svg');
  const width=drawing?.viewBox.baseVal.width;
  if(width){drawing.style.width=Math.ceil(width)+'px';drawing.style.maxWidth='';}
  container.dataset.renderState='ready';
 }catch{diagramFallback(container,source,'You can still answer this question.');}
}
function description(source,number){
 const wrapper=element('section',undefined,'description');wrapper.setAttribute('aria-label','Description for question '+number);
 const content=element('div',undefined,'rich-content');content.id='description-'+number;wrapper.append(content);
 try{
  const renderer=new marked.Renderer();
  renderer.html=({text})=>escapeHTML(text);
  renderer.image=({text})=>escapeHTML(text);
  const html=marked.parse(source,{gfm:true,breaks:false,renderer});
  content.innerHTML=DOMPurify.sanitize(html,{ALLOWED_TAGS:['p','br','strong','em','del','a','ul','ol','li','blockquote','h1','h2','h3','h4','h5','h6','pre','code','table','thead','tbody','tr','th','td','hr'],ALLOWED_ATTR:['href','title','class','align','start']});
  content.querySelectorAll('a').forEach(link=>{if(!/^https?:\/\//i.test(link.getAttribute('href')||'')){link.removeAttribute('href');return;}link.target='_blank';link.rel='noopener noreferrer';});
  content.querySelectorAll('pre > code.language-mermaid').forEach(code=>{
   const diagram=element('div','Rendering diagram…','diagram');diagram.dataset.renderState='pending';diagram.tabIndex=0;diagram.setAttribute('role','region');diagram.setAttribute('aria-label','Diagram for question '+number);
   const definition=code.textContent;code.parentElement.replaceWith(diagram);
   diagramQueue=diagramQueue.then(()=>renderDiagram(diagram,definition)).catch(()=>diagramFallback(diagram,definition,'You can still answer this question.'));
  });
 }catch{content.append(element('p','Description could not be rendered; original source follows.','error'),element('pre',source));}
 const hasDiagram=!!content.querySelector('.diagram'),wideContent=[...content.querySelectorAll('table,pre')];
 if(!hasDiagram&&!wideContent.length)return wrapper;
 const toolbar=element('div',undefined,'description-toolbar');
 const expand=element('button',undefined,'expand');expand.type='button';expand.setAttribute('aria-controls',content.id);
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','1.75');icon.setAttribute('stroke-linecap','round');icon.setAttribute('stroke-linejoin','round');icon.setAttribute('aria-hidden','true');
 const iconPath=document.createElementNS('http://www.w3.org/2000/svg','path');icon.append(iconPath);expand.append(icon);
 function refresh(){
  const expanded=wrapper.classList.contains('is-expanded');
  const available=expanded||hasDiagram||wideContent.some(node=>node.scrollWidth>content.clientWidth+1);
  toolbar.hidden=!available;wrapper.classList.toggle('has-expansion',available);
  content.tabIndex=available?0:-1;
  const label=expanded?'Collapse description':'Expand description';expand.setAttribute('aria-expanded',String(expanded));expand.setAttribute('aria-label',label);expand.title=label;
  iconPath.setAttribute('d',expanded?'M3 9h6V3M9 9 3 3M21 15h-6v6M15 15l6 6':'M9 3H3v6M3 3l6 6M15 21h6v-6M21 21l-6-6');
 }
 expand.addEventListener('click',()=>{wrapper.classList.toggle('is-expanded');refresh()});
 wrapper.addEventListener('keydown',event=>{if(event.key==='Escape'&&wrapper.classList.contains('is-expanded')){expand.click();expand.focus();}});
 toolbar.append(expand);wrapper.append(toolbar);
 new ResizeObserver(refresh).observe(content);refresh();
 return wrapper;
}
function complete(a){return a.choiceId==='other'?!!a.notes.trim():!!a.choiceId||!!a.notes.trim()}
function update(){
 submit.disabled=busy||!canSubmit()||!notesReady();
 if(busy)return;
 generation++;
 if(!notesReady()){warning.textContent='Preparing image…';warning.hidden=false;return;}
 message.hidden=true;warning.textContent='Saving draft…';warning.hidden=false;
 clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,400);
}
questions.forEach((q,i)=>{
 const fieldset=element('fieldset');
 fieldset.append(element('legend',(q.prompt ? q.number+'. '+q.prompt : 'Review '+q.number)+(q.required?' · Required':'')));
 const comments=commentControls(q,i);
 if(q.preview)fieldset.append(renderPreview(q.preview,i,'main',comments.add));
 if(q.context.trim())fieldset.append(state.richText?description(q.context,q.number):element('p',q.context));
 if(q.recommendation)fieldset.append(element('p','Recommended: '+q.recommendation,'recommendation'));
 const choices=element('div',undefined,'choices'+(q.options.some(o=>o.preview)?' visual-choices':''));
 const clear=q.options.length?element('button','Clear selection','quiet clear-selection'):null;
 (q.options.length?[...q.options,{id:'other',label:'Something else'}]:[]).forEach(option=>{
  const label=element('label',undefined,'choice');
  const radio=element('input');radio.type='radio';radio.name=q.id;radio.value=option.id;radio.checked=answers[i].choiceId===option.id;
  radio.addEventListener('change',()=>{answers[i].choiceId=option.id;clear.hidden=false;update()});
  label.append(radio,element('span',option.label));
  if(option.preview){const card=element('div',undefined,'choice-card');const select=()=>{if(!state.archived&&!radio.checked)radio.click()};card.addEventListener('click',select);card.append(renderPreview(option.preview,i,'option-'+option.id,comments.add,select),label);choices.append(card)}else choices.append(label);
 });
 if(clear){clear.type='button';clear.hidden=state.archived||!answers[i].choiceId;clear.addEventListener('click',()=>{const chosen=choices.querySelector('input:checked');answers[i].choiceId=null;choices.querySelectorAll('input').forEach(r=>r.checked=false);clear.hidden=true;update();chosen?.focus()});choices.append(clear)}
 const notesLabel=element('div','Notes','notes-label');
 const {notes,error}=createNotesEditor(q,i);
 if(q.options.length)notes.classList.add('compact');
 fieldset.append(choices,comments.box,notesLabel,notes,error);form.insertBefore(fieldset,actions);
});
if(state.review){const hint=element('p',state.archived?'Saved review. Feedback and prototype state are restored below.':'Share feedback on any item. Untouched items remain open.','review-hint');document.querySelector('header').append(hint)}
if(state.archived){actions.hidden=true;form.querySelectorAll('input,select,button:not(.expand):not(.view-comment)').forEach(node=>node.disabled=true);form.querySelectorAll('[contenteditable]').forEach(node=>node.contentEditable='false')}
submit.disabled=!canSubmit()||!notesReady();
form.addEventListener('submit',submitForm);
cancel.disabled=false;cancel.addEventListener('click',cancelForm);
if(fungiReady.delivery?.mode==='manual')document.querySelector('.review-hint').textContent+=' After submitting, tell your agent “done”.';
if(draft){warning.textContent='Saved draft restored';warning.hidden=false;}

}
start().catch(error=>{const message=document.getElementById('message');message.textContent=error.message;message.hidden=false;document.getElementById('submit').disabled=true;});
