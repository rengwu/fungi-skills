// Visual/retry checks with an injected public page bridge, not native delivery.
// Supply an already-installed puppeteer-core module; this does not install packages.
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const [modulePath,chromePath,outputPath]=process.argv.slice(2);
if(!modulePath||!chromePath||!outputPath)throw new Error('Usage: node scripts/outcome-browser-smoke.mjs PUPPETEER_MODULE CHROME OUTPUT_DIR');
const {default:puppeteer}=await import(pathToFileURL(path.resolve(modulePath)).href);
const output=path.resolve(outputPath);await mkdir(output,{recursive:true});
const root=fileURLToPath(new URL('../skills/outcome/assets/',import.meta.url));
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root))throw new Error('Outside fixture');
  const bytes=await readFile(file);
  res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const input={schema:'outcome/v1',id:'composer-width-demo',projectName:'Design study',title:'The composer has more room',
 markdown:'Three design decisions are recorded. **App implementation has not started.**\n\n## Accepted\n\n| Decision | Result |\n| --- | --- |\n| D51 · Edge margin | 8 dp on Home and in lessons |\n| D52 · Submit | Keeps its own column, despite my recommendation |\n| D53 · Field label | Placeholder only |\n\nA line grows from **287 to 311 dp** — about 48 characters instead of 44. Lesson text keeps its 20 dp margin.\n\n## Checked and still open\n\nThe wiki rebuilt and its link check passed. Typography and confidence-slider snapping remain unresolved.\n\n```mermaid\nflowchart LR\n A[Feedback] --> B[Recorded decisions] --> C[Next spike]\n```'};
const evidence={scope:'Headless Chromium rendering and retry UI; mocked page bridge, no native delivery',input,results:{}};
let browser;
try{
 browser=await puppeteer.launch({executablePath:chromePath,headless:true,args:['--disable-background-networking','--disable-component-update','--disable-sync']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);
 page.on('request',request=>{
  const url=request.url();
  if(url.startsWith('http://127.0.0.1:')||url.startsWith('data:')||url.startsWith('about:'))request.continue();else request.abort();
 });
 await page.evaluateOnNewDocument(input=>{
  window.fixture={input,saves:0,submits:0,failSave:true,failSubmit:true};
  window.fungi=Object.freeze({
   ready:async()=>({input,draft:null,attachments:[],limits:{jsonBytes:1048576,artifactBytes:20971520,totalArtifactBytes:104857600},delivery:{mode:'manual'}}),
   saveDraft:async(data)=>{fixture.saves++;if(fixture.failSave){fixture.failSave=false;throw new Error('Synthetic save failure')}fixture.draft=data;},
   submit:async(data)=>{fixture.submits++;if(fixture.failSubmit){fixture.failSubmit=false;throw new Error('Synthetic submit failure')}await new Promise(r=>setTimeout(r,100));fixture.result=data;},
   cancel:async()=>{fixture.cancelled=true;}
  });
 },input);
 await page.setViewport({width:1000,height:900,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:'+server.address().port+'/outcome.html');
 await page.waitForSelector('.diagram[data-render-state="ready"]');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor),'rgb(24, 24, 27)');
 assert.equal(await page.$eval('#submit',el=>el.disabled),true);
 await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true});
 evidence.results.desktop='Report, table, diagram and optional Notes rendered without an interview';
 await page.setViewport({width:420,height:900,deviceScaleFactor:1});
 await page.screenshot({path:path.join(output,'narrow.png'),fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 evidence.results.narrow='420 px viewport has no document horizontal overflow';
 const notes='#notes';
 await page.$eval(notes,el=>{el.value='Keep this feedback';el.dispatchEvent(new InputEvent('input',{bubbles:true}));});
 await page.waitForFunction(()=>document.getElementById('message').textContent==='Synthetic save failure');
 assert.equal(await page.$eval(notes,el=>el.value),'Keep this feedback');
 await page.$eval(notes,el=>{el.value+=' after retry';el.dispatchEvent(new InputEvent('input',{bubbles:true}));});
 await page.waitForFunction(()=>document.getElementById('draft-message').textContent==='Draft saved');
 await page.click('#submit');
 await page.waitForFunction(()=>document.getElementById('message').textContent==='Synthetic submit failure');
 assert.equal(await page.$eval('#feedback',el=>el.inert),false);
 assert.equal(await page.$eval(notes,el=>el.value),'Keep this feedback after retry');
 await page.evaluate(()=>{document.getElementById('submit').click();document.getElementById('submit').click();});
 await page.waitForFunction(()=>!!fixture.result);
 const result=await page.evaluate(()=>({submits:fixture.submits,data:fixture.result}));
 assert.equal(result.submits,2);assert.equal(result.data.schema,'outcome/v1');
 assert.equal(result.data.answers.length,1);
 assert.equal(result.data.answers.at(-1).notes,'Keep this feedback after retry');
 evidence.results.retry='Save and submit errors preserve edits; retry succeeds; duplicate click does not resubmit';
 evidence.resultData=result;evidence.pageErrors=errors;assert.deepEqual(errors,[]);
 evidence.result='Passed';
}catch(error){evidence.result='Failed';evidence.error=error.stack;process.exitCode=1;}
finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
await writeFile(path.join(output,'browser.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({result:evidence.result,evidence:path.join(output,'browser.json'),error:evidence.error}));
