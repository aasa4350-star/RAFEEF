#!/usr/bin/env node
/* بصمةُ البناء: تُحسَب من محتوى الصفحاتِ والبنوكِ بعد حجبِ رقمِ البناءِ
   نفسِه — فلا تدور البصمةُ على ذاتِها.    node tools/gen-build.js  */
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const ROOT=path.join(__dirname,'..');
function files(){
  const html=fs.readdirSync(ROOT).filter(f=>/\.html$/.test(f)).sort();
  const js=fs.readdirSync(ROOT).filter(f=>/\.js$/.test(f) && f!=='version.json').sort();
  return html.concat(js);
}
function sig(){
  const h=crypto.createHash('sha1');
  for(const f of files()){
    const s=fs.readFileSync(path.join(ROOT,f),'utf8')
      .replace(/build-check\.js\?v=[0-9a-f]+/g,'build-check.js?v=_');
    h.update(f+'\0'+s+'\0');
  }
  return h.digest('hex').slice(0,10);
}
module.exports={ sig, files };
if(require.main===module){
  const v=sig();
  let n=0;
  for(const f of fs.readdirSync(ROOT).filter(x=>/\.html$/.test(x))){
    const p=path.join(ROOT,f); let s=fs.readFileSync(p,'utf8');
    if(!/build-check\.js\?v=/.test(s)) continue;
    const t=s.replace(/build-check\.js\?v=[0-9a-f]+/g,'build-check.js?v='+v);
    if(t!==s){ fs.writeFileSync(p,t); n++; }
  }
  fs.writeFileSync(path.join(ROOT,'version.json'), JSON.stringify({ v:v })+'\n');
  console.log('بصمةُ البناء: '+v+'  ·  صفحاتٌ حُدِّثت: '+n);
}
