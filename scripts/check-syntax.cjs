const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../dist');const files=fs.readdirSync(root).filter(n=>n.endsWith('.js'));
for(const file of files)cp.execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});
console.log('JavaScript syntax passed: '+files.length+' owned modules');
