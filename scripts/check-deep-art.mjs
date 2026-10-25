import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script,createContext} from "node:vm";
const read=path=>readFileSync(path,"utf8");
const w={};const vm=createContext({window:w});
for(const file of ["www/deep-lessons-a.js","www/deep-lessons-b.js","www/deep-lessons-c.js"]){
 new Script(read(file),{filename:file}).runInContext(vm);
}
new Script(read("www/deep-lessons-ui.js"),{filename:"deep-lessons-ui.js"});
const lessons=w.DEEP_ART;
assert.equal(lessons.length,28,"Expected all 28 lessons");
assert.equal(Object.keys(lessons).length,28);
for(let i=0;i<lessons.length;i++){
 const d=lessons[i];
 assert.ok(d,"Lesson "+i+" is missing");
 assert.ok(d.goal.length>=45,"Substantive goal for "+i);
 assert.equal(d.ideas.length,3,"Three theory subsections "+i);
 assert.ok(d.ideas.every(x=>x.length>=165),"Theoretical explanation too short "+i);
 assert.ok(d.ideas.join(" ").length>=600,"Theory not substantial "+i);
 assert.ok(d.caseTitle.length>=18&&d.caseText.length>=170,"Case study not substantial "+i);
 assert.equal(d.terms.length,3);
 assert.ok(d.terms.every(([term,definition])=>term.length>=3&&definition.length>=18),"Incomplete terminology "+i);
 assert.equal(d.try.length,3,"Guided research sequence "+i);
 assert.equal(d.checks.length,3);
 assert.ok(d.try.every(x=>x.length>=35),"Research step too short "+i);
 assert.ok(d.checks.every(x=>x.length>=18),"Assessment criterion too vague "+i);
 assert.ok(d.stretch.length>=65,"Advanced challenge missing "+i);
 assert.ok(d.time&&d.level,"Duration and difficulty missing "+i);
 if(d.caseUrl)assert.match(d.caseUrl,/^https:\/\/(www\.)?[\w.-]+\/.+/);
}
const html=read("www/index.html");
for(const file of ["deep-lessons-a.js","deep-lessons-b.js","deep-lessons-c.js","deep-lessons-ui.js","deep-lessons.css"]){
 assert.ok(html.includes(file),"Missing course asset "+file);
}
const atelier=read("www/atelier-v3.js");
for(const method of ["window.DEEP_UI.look(i)","window.DEEP_UI.explore(i)","window.DEEP_UI.make(i)","window.DEEP_UI.review(i,data,saveFn)"]){
 assert.ok(atelier.includes(method),"Missing lesson stage "+method);
}
const app=read("www/enhanced.js");assert.ok(app.includes("lessonSources,colorLab,save)"));
console.log("Deep art curriculum verified: 28 structured lessons, 84 substantial theory sections, 28 case studies, 84 research steps, 84 skill criteria.");
