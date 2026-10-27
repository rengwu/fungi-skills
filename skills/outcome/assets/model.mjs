export const SCHEMA='outcome/v1';
export const NOTES_ID='outcome-notes';
const imageTypes={'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp'};
const check=(condition,message)=>{if(!condition)throw new Error(message)};

export function normalizeInput(input){
 check(input?.schema===SCHEMA,'Unrecognized outcome schema.');
 check(typeof input.id==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(input.id),'Provide a valid outcome id.');
 check(typeof input.title==='string'&&input.title.trim()&&input.title.length<=200,'Provide a title within 200 characters.');
 check(typeof input.markdown==='string'&&input.markdown.trim()&&input.markdown.length<=900000,'Provide outcome Markdown within 900,000 characters.');
 check(input.questions===undefined||(Array.isArray(input.questions)&&input.questions.length===0),'Outcome presents a report and Notes. Use a separate session for questions.');
 check(input.projectName===undefined||typeof input.projectName==='string','Invalid project name.');
 return {id:input.id,title:input.title,markdown:input.markdown,projectName:input.projectName??''};
}

export function snapshot(spec,notes,images,limits,submitted=false){
 check(typeof notes==='string'&&notes.length<=12000,'Keep Notes within 12,000 characters.');
 check(!submitted||notes.trim(),'Add some feedback before submitting.');
 const references=[],attachments=[],seen=new Set();
 for(const match of notes.matchAll(/\[Image #(\d+)\]/g)){
  const id=Number(match[1]),blob=images.get(id);
  if(!blob||seen.has(id))continue;
  check(Number.isSafeInteger(id)&&id>0&&id<=1000000,'Invalid image reference.');
  check(Object.hasOwn(imageTypes,blob.type),'Paste a PNG, JPEG, GIF or WebP image.');
  check(blob.size<=Math.min(5*1024*1024,limits.artifactBytes),'An image exceeds the file limit.');
  seen.add(id);
  const key='image-'+id;
  references.push({id,offset:match.index,artifact:key,mimeType:blob.type});
  attachments.push({key,name:key+'.'+imageTypes[blob.type],blob});
 }
 check(attachments.length<=20,'Use at most 20 images.');
 check(attachments.reduce((sum,a)=>sum+a.blob.size,0)<=Math.min(20*1024*1024,limits.totalArtifactBytes),'Images exceed the session limit.');
 const data={schema:SCHEMA,outcomeId:spec.id,title:spec.title,answers:[{
  questionId:NOTES_ID,choiceId:null,choice:null,notes,status:notes.trim()?'feedback':'untouched',images:references
 }]};
 check(new TextEncoder().encode(JSON.stringify(data)).length+4096<=limits.jsonBytes,'Feedback is too large for Fungi.');
 return {data,attachments};
}

export function restoreDraft(draft,attachments,spec,limits){
 if(draft==null)return {notes:'',images:new Map()};
 check(draft.schema===SCHEMA&&draft.outcomeId===spec.id&&draft.title===spec.title&&Array.isArray(draft.answers)&&draft.answers.length===1&&draft.answers[0]?.questionId===NOTES_ID,'Saved draft belongs to a different outcome or format. Preserve the session for recovery.');
 const answer=draft.answers[0],images=new Map(),files=new Map(attachments.map(a=>[a.key,a.blob]));
 check(typeof answer.notes==='string'&&Array.isArray(answer.images??[]),'Invalid saved Notes.');
 for(const ref of answer.images??[]){
  check(Number.isSafeInteger(ref.id)&&ref.id>0&&!images.has(ref.id)&&Number.isSafeInteger(ref.offset)&&ref.offset>=0&&answer.notes.slice(ref.offset,ref.offset+`[Image #${ref.id}]`.length)===`[Image #${ref.id}]`,'Invalid saved image reference.');
  const blob=files.get(ref.artifact);check(blob,'A saved image is missing. Preserve the session for recovery.');
  check(blob.type===ref.mimeType,'A saved image has a different media type.');
  images.set(ref.id,blob);
 }
 snapshot(spec,answer.notes,images,limits);
 return {notes:answer.notes,images};
}
