/* Source/HTTP preflight only. This cannot prove WebGL rendering or UI behavior. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist'),base=process.env.TEST_BASE_URL||'http://127.0.0.1:5197',results=[];
async function check(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
(async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 await check('Unique HTML IDs',()=>{const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);});
 await check('All six readable destinations present',()=>{for(const key of ['about','campus','life','work','lab','contact'])assert(html.includes('id="page-'+key+'"'));});
 await check('No remote runtime dependencies',()=>{assert(!/<script[^>]+src="https?:/i.test(html));assert(!/@import\s+url\(['"]?https?:/i.test(fs.readFileSync(path.join(root,'town.css'),'utf8')));});
 await check('Local entry is the planet edition',()=>{assert.equal(html,fs.readFileSync(path.join(root,'town.html'),'utf8'));assert(html.includes('town.js'));});
 await check('Original edition preserved',()=>{const classic=fs.readFileSync(path.join(root,'classic.html'),'utf8');assert(classic.includes('app.js'));assert(classic.includes('STAY'));});
 const moduleFiles=new Set();
 await check('Entire local ES module graph resolves without bare/CDN imports',()=>{const queue=['town.js','voyage.js'];while(queue.length){const f=queue.shift();if(moduleFiles.has(f))continue;moduleFiles.add(f);const js=fs.readFileSync(path.join(root,f),'utf8');for(const m of js.matchAll(/^(?:import|export)\s+(?:[^'";]*?\s+from\s*)?['"]([^'"]+)['"]/gm)){assert(m[1].startsWith('.'),'Nonlocal module '+m[1]);const target=path.resolve(root,path.dirname(f),m[1]);assert(target.startsWith(root+path.sep));assert(fs.existsSync(target),'Missing '+target);queue.push(path.relative(root,target));}}assert(moduleFiles.size>=21);});
 await check('Licenses included',()=>{for(const f of ['vendor/THREE-LICENSE.txt','fonts/OFL.txt'])assert(fs.statSync(path.join(root,f)).size>100);});
 await check('Only owner-approved mail contacts, no telephone',()=>{assert(!/\b1[3-9]\d{9}\b/.test(html));assert(!/tel:/.test(html));const addresses=[...html.matchAll(/href="mailto:([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(addresses,['ndshuge@gmail.com','653856332@qq.com']);});
 const urls=[...new Set(['/','/town.html','/classic.html','/town.css','/voyage.css','/town-ui.js','/town.js','/content.js','/vendor/three.module.js','/vendor/three.core.js','/fonts/outfit.woff2','/assets/academy.png','/assets/arcade.png','/assets/classnote.png','/assets/galaxy.png','/assets/board.png',...[...moduleFiles].map(f=>'/'+f.split(path.sep).join('/'))])];
 for(const url of urls)await check('HTTP '+url,async()=>{const response=await fetch(base+url);assert.equal(response.status,200);const bytes=await response.arrayBuffer();assert(bytes.byteLength>0);if(url.endsWith('.js'))assert(response.headers.get('content-type').includes('javascript'));});
 await check('Directory traversal blocked',async()=>{assert.equal((await fetch(base+'/%2e%2e%5cpackage.json')).status,403);});
 await check('Missing assets return 404',async()=>{assert.equal((await fetch(base+'/missing-shuge-file.png')).status,404);});
 const report={scope:'Static source and local HTTP preflight; no browser, screenshot, WebGL or interaction acceptance',date:new Date().toISOString(),passed:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass).length,results};
 const out=path.resolve(__dirname,'../evidence/odyssey-preflight.json');fs.writeFileSync(out,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));process.exitCode=report.failed?1:0;
})();
