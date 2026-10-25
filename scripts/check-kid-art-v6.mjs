import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
const read=p=>readFileSync(p,'utf8');
const win={};win.window=win;win.document={getElementById:()=>null,querySelectorAll:()=>[]};
const ctx=createContext(win);
for(const f of ['kid-epochs-v6.js','kid-plain-stories-v6.js','kid-experience-v6.js'])new Script(read('www/'+f),{filename:f}).runInContext(ctx);
assert.equal(win.KID_EPOCHS.length,15,'15 art-history stops');
assert.equal(win.KID_PLAIN.length,28,'28 individual lesson adaptations');
assert.equal(win.KID_STORY_FOR_LESSON.length,28);
assert.equal(win.KID_EPOCH_FOR_LESSON.length,28);
assert.ok(win.KID_STORIES.length>=12,'Artist stories have breadth');
const keys=new Set(win.KID_EPOCHS.map(x=>x.key));
assert.equal(keys.size,15);
for(const era of win.KID_EPOCHS){
 assert.ok(era.name.length>=6&&era.when.length>=12);
 assert.ok(era.simple.length>=125&&era.special.length>=110);
 assert.ok(era.look.length>=48&&era.mission.length>=43);
 assert.ok(era.source.startsWith('https://'),'Sourced period '+era.name);
}
const keys28=win.KID_EPOCH_FOR_LESSON;for(const k of keys28)assert.ok(keys.has(k),'Invalid era ref '+k);
for(let i=0;i<28;i++){
 const texts=win.KID_PLAIN[i];assert.equal(texts.length,3,'3 plain paragraphs per lesson '+i);
 assert.ok(texts.every(s=>s.length>=55),'Simplified explanations should be substantive '+i);
 assert.ok(win.KID_STORIES[win.KID_STORY_FOR_LESSON[i]],'Artist story for '+i);
 for(let p=0;p<3;p++){
  const html=win.KID_ART.plain(i,p);
  assert.ok(html.includes('ПОЯСНЕННЯ ПРОСТИМИ СЛОВАМИ')&&html.includes(texts[p]));
 }
 assert.ok(win.KID_ART.story(i).includes('ЦІКАВА ІСТОРІЯ'));
 assert.ok(win.KID_ART.lessonEra(i).includes('МАШИНА ЧАСУ'));
}
for(const story of win.KID_STORIES){
 assert.ok(story.text.length>=160&&story.question.length>25,'Verified readable story '+story.title);
 assert.ok(story.source.startsWith('https://'),'Story source '+story.title);
}
const store={};let saved=0;win.KID_ART.bind(store,()=>{saved++});
let page=win.KID_ART.timeline();
assert.ok(page.includes('Що означає «доба»?')&&page.includes('століття')&&page.includes('до нашої ери'));
assert.ok(page.includes('Українське бароко')&&page.includes('Мистецтво Русі-України')&&page.includes('Період Едо'));
assert.equal((page.match(/class="kid-era-card"/g)||[]).length,15,'All era cards rendered');
assert.equal((page.match(/class="kid-quiz-item"/g)||[]).length,8,'Interactive mini-quiz');
assert.ok(win.KID_ART.home().includes('Мандрувати епохами'));
win.KID_ART.answer(0,1);assert.equal(store.eraQuiz[0],1);assert.equal(saved,1);
const index=read('www/index.html');
for(const f of ['kid-epochs-v6.js','kid-plain-stories-v6.js','kid-experience-v6.js','kid-art-v6.css'])assert.ok(index.includes(f));
const ui=read('www/deep-lessons-ui.js');
assert.ok(ui.includes('window.KID_ART.plain(i,k)')&&ui.includes('window.KID_ART.story(i)'));
const atelier=read('www/atelier-v3.js'),app=read('www/enhanced.js');
assert.ok(atelier.includes('window.KID_ART.home()'));assert.ok(app.includes('epochs:"Епохи"')&&app.includes('window.KID_ART.timeline()'));
const conf=JSON.parse(read('capacitor.config.json'));assert.ok(conf.appId.endsWith('.kidart'));
console.log('V6 OK: 15 complete eras, 28 lesson adaptions/84 simple explanations, '+win.KID_STORIES.length+' sourced stories, 8 historical quiz questions, full navigation.');
