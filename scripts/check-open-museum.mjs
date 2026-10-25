import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
const read=p=>readFileSync(p,'utf8');
assert.ok(existsSync('www/open-art-data.js'),'Offline images metadata must be generated before tests.');
const sandbox={window:null};
sandbox.window=sandbox;
const vm=createContext(sandbox);
for(const path of ['www/open-art-data.js','www/open-museum-v5.js'])
 new Script(read(path),{filename:path}).runInContext(vm);
const a=sandbox.ART_PHOTOS;
assert.equal(a.missions.length,28,'Every lesson must have an original photo challenge.');
const paintings=a.works.filter(x=>x.type==='painting');
const photos=a.works.filter(x=>x.type==='photograph');
assert.ok(paintings.length>=3,'Minimum 4 artworks');
assert.ok(photos.length>=2,'Minimum 2 genuine photographs, not drawings of cameras');
for(const w of a.works){
 assert.equal(w.license,'Public Domain / CC0');
 assert.ok(w.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert.ok(existsSync('www/'+w.file),'Missing locally bundled image '+w.key);
 assert.ok(statSync('www/'+w.file).size>6000,'Artwork suspiciously tiny '+w.key);
 const b=readFileSync('www/'+w.file);assert.equal(b[0],255);assert.equal(b[1],216);
}
const fakeData={works:[],photoMissions:{}};a.bind(fakeData,()=>{});
for(let i=0;i<28;i++){
 const m=a.missions[i];
 assert.equal(m.length,5);
 assert.ok(m[1].length>=35&&m.slice(2).every(s=>s.length>18),'Meaningful photo mission '+i);
 const picture=a.analyse(i);
 assert.ok(picture.includes('Справжні твори')&&picture.includes('img'),'Image analysis required '+i);
 const mission=a.mission(i);
 assert.ok(mission.includes('capture="environment"')&&mission.includes('ART_PHOTOS.capture('+i),'Camera capture '+i);
}
const home=a.home();assert.ok(home.includes('Галерея натхнення')&&home.includes('Фотоекспедиції'));
const index=read('www/index.html');
assert.ok(index.indexOf('open-art-data.js')<index.indexOf('open-museum-v5.js'));
assert.ok(index.indexOf('open-museum-v5.js')<index.indexOf('atelier-v3.js'));
console.log('PASS: '+a.works.length+' genuine, licensed offline artworks (including '+photos.length+' photographs); 28 functioning photo-mission UI templates.');
