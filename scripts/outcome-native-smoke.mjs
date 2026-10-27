// Bounded synthetic native checks; never answers a human session.
import {mkdtemp,cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const binary=path.resolve(process.argv[2]??path.join(os.homedir(),'.fungi/bin/fungi'));
const directory=await mkdtemp(path.join(os.tmpdir(),'fungi-outcome-smoke-'));
const assets=path.join(directory,'assets');
await cp(new URL('../skills/outcome/assets/',import.meta.url),assets,{recursive:true});
const html=await readFile(path.join(assets,'outcome.html'),'utf8');
await writeFile(path.join(assets,'outcome.html'),html.replace('</body>','<script type="module" src="fixture.mjs"></script></body>'));
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9kAAAAASUVORK5CYII=';
await writeFile(path.join(assets,'fixture.mjs'),String.raw`
const until=async condition=>{
 const end=Date.now()+12000;
 while(Date.now()<end){if(condition())return;await new Promise(r=>setTimeout(r,25));}
 throw new Error('Fixture timed out: '+document.getElementById('message').textContent);
};
const check=(condition,message)=>{if(!condition)throw new Error(message)};
const write=(node,text)=>{node.focus();node.value=text;node.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:text}));};
try{
 const ready=await fungi.ready();
 if(['invalid','questions'].includes(ready.input.testCase)){
  await until(()=>!document.getElementById('message').hidden);
  check(document.getElementById('submit').disabled,'Invalid input can submit');
  await fungi.submit({fixture:ready.input.testCase,message:document.getElementById('message').textContent});
 }else{
  await until(()=>document.getElementById('outcome-report'));
  await until(()=>document.querySelector('.diagram')?.dataset.renderState==='ready');
  const report=document.getElementById('outcome-report');
  await until(()=>getComputedStyle(document.body).backgroundColor==='rgb(24, 24, 27)');
  check(report.querySelector('table'),'Markdown table missing');
  check(!report.querySelector('script'),'Raw HTML executed');
  check(report.textContent.includes('not implemented'),'Caveat missing');
  await until(()=>report.querySelector('img')?.naturalWidth===1);
  const notes=document.getElementById('notes');
  check(notes,'Always-present Notes missing');
  {
   check(!document.getElementById('next-heading'),'Report alone asks a question');
   if(!ready.draft){
    check(document.getElementById('submit').disabled,'Blank report permits acknowledgment');
    await new Promise(r=>setTimeout(r,500));
    write(notes,'Native optional note ');
    notes.setSelectionRange(notes.value.length,notes.value.length);
    const bytes=Uint8Array.from(atob(ready.input.fixturePng.split(',')[1]),c=>c.charCodeAt(0));
    const transfer=new DataTransfer();transfer.items.add(new File([bytes],'fixture.png',{type:'image/png'}));
    notes.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));
    await until(()=>document.querySelector('.image-chip'));
    await until(()=>document.getElementById('draft-message').textContent==='Draft saved');
    check(document.getElementById('cancel').textContent==='Close','Report close label missing');
    document.getElementById('cancel').click();
   }else{
    check(notes.value.includes('Native optional note')&&document.querySelector('.image-chip'),'Notes draft not restored');
    await until(()=>!document.getElementById('submit').disabled);
    document.getElementById('submit').click();
   }
  }
 }
}catch(error){await fungi.submit({fixtureError:error.message});}
`);
const env={...process.env,FUNGI_STATE_DIR:path.join(directory,'sessions')};
delete env.CODEX_THREAD_ID;
const run=async args=>JSON.parse((await promisify(execFile)(binary,args,{env,timeout:25000,maxBuffer:4*1024*1024})).stdout);
const base={schema:'outcome/v1',id:'native-report',projectName:'Disposable native check',title:'Synthetic outcome — not project decisions',
 markdown:'Recorded, **not implemented**.\n\n| Choice | Result |\n| --- | --- |\n| Layout | Wider |\n\n```mermaid\nflowchart LR\n A --> B\n```\n\n![Fixture pixel]('+png+')\n\n<script>throw new Error("must not execute")</script>',fixturePng:png};
const open=async input=>{
 const file=path.join(directory,input.testCase+'.json');await writeFile(file,JSON.stringify(input));
 return run(['open',path.join(assets,'outcome.html'),'--input',file,'--delivery','wait']);
};
const evidence={binary,directory,version:await run(['version']),doctor:await run(['doctor'])};
try{
 evidence.reportClosed=await open({...base,testCase:'report'});
 assert.equal(evidence.reportClosed.outcome,'cancelled',JSON.stringify(evidence.reportClosed));
 evidence.reportSubmitted=await run(['reopen',evidence.reportClosed.session,'--delivery','wait']);
 const report=evidence.reportSubmitted;
 assert.equal(report.data.schema,'outcome/v1',JSON.stringify(report));assert.equal(report.data.outcomeId,base.id);
 assert.match(report.data.answers[0].notes,/Native optional note.*\[Image #1\]/);
 assert.equal(report.artifacts.length,1);
 const image=report.artifacts[0];assert.equal(image.key,'image-1');
 assert.equal(createHash('sha256').update(await readFile(image.path)).digest('hex'),image.sha256);
 evidence.questions=await open({...base,testCase:'questions',questions:[{prompt:'Old combined input'}]});
 assert.equal(evidence.questions.data.fixture,'questions');assert.match(evidence.questions.data.message,/separate session/);
 evidence.invalid=await open({...base,schema:'outcome/v999',testCase:'invalid'});
 assert.equal(evidence.invalid.data.fixture,'invalid');assert.match(evidence.invalid.data.message,/schema/);
 evidence.result='Passed';
}catch(error){evidence.result='Failed';evidence.error=error.message;process.exitCode=1;}
await writeFile(path.join(directory,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
if(process.argv[3]){await mkdir(path.dirname(path.resolve(process.argv[3])),{recursive:true});await writeFile(process.argv[3],JSON.stringify(evidence,null,2)+'\n');}
console.log(JSON.stringify({result:evidence.result,evidence:path.join(directory,'evidence.json'),error:evidence.error}));
