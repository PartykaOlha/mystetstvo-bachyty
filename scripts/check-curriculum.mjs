import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script,createContext} from "node:vm";
const read=f=>readFileSync(f,"utf8");
const sandbox={window:{}};createContext(sandbox);
for(const p of ["www/quiz-bank-a.js","www/quiz-bank-b.js","www/art-references.js"]){
 new Script(read(p),{filename:p}).runInContext(sandbox);
}
const w=sandbox.window, bank=w.ART_QUIZ_BANK;
assert.equal(bank.length,28,"3 questions for every lesson");
assert.equal(w.ART_REFLECTION_PROMPTS.length,28);
assert.equal(w.ART_LESSON_REFERENCES.length,28);
assert.ok(w.ART_REFERENCES.length>=10);
const ids=new Set(w.ART_REFERENCES.map(x=>x.id));
for(const r of w.ART_REFERENCES){
 assert.match(r.url,/^https:\/\/(www\.)?[\w.-]+\//);
 assert.ok(r.title.length>6&&r.author.length>4&&r.why.length>10);
}
for(let i=0;i<28;i++){
 const questions=bank[i];
 assert.equal(questions.length,3,"Lesson "+(i+1)+" has exactly 3 questions");
 const seen=new Set();
 for(const [k,q] of questions.entries()){
   assert.equal(q.length,4,"Question tuple");
   assert.ok(q[0].length>=28&&q[3].length>=30,"Specific question with explanation "+i+":"+k);
   assert.ok(!seen.has(q[0]),"No duplicated questions");
   seen.add(q[0]);
   assert.equal(q[1].length,4,"Four plausible choices");
   assert.equal(new Set(q[1]).size,4,"Choices not repeated");
   assert.ok(q[1].every(o=>typeof o==="string" && o.length>=14));
   assert.ok(Number.isInteger(q[2])&&q[2]>=0&&q[2]<4,"Correct keyed choice");
 }
 assert.ok(w.ART_LESSON_REFERENCES[i].length>=2,"Sources per lesson");
 for(const id of w.ART_LESSON_REFERENCES[i])assert.ok(ids.has(id),"Unknown source "+id);
 assert.ok(w.ART_REFLECTION_PROMPTS[i].length>40);
}
const html=read("www/index.html");
for(const path of ["quiz-bank-a.js","quiz-bank-b.js","art-references.js","curriculum.css"]){
 assert.ok(html.includes(path),path+" is missing from app");
}
const js=read("www/enhanced.js");
new Script(js,{filename:"enhanced.js"});
for(const name of ["artSelectQuiz","artSaveReflection","artColorChange","drawLibrary"])
 assert.ok(js.includes(name),name+" implementation is missing");
console.log("Advanced curriculum validated: 84 applied questions, 28 reflection prompts, "+w.ART_REFERENCES.length+" vetted sources.");
