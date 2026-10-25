import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script, createContext } from "node:vm";

const read = path => readFileSync(path, "utf8");
const jsFiles = ["www/guides.js","www/illustrations.js","www/enhanced.js"];
for (const f of jsFiles) new Script(read(f), {filename:f});
const sandbox = {window:{}};
createContext(sandbox);
new Script(read(jsFiles[0]),{filename:jsFiles[0]}).runInContext(sandbox);
new Script(read(jsFiles[1]),{filename:jsFiles[1]}).runInContext(sandbox);
const w=sandbox.window, guides=[...w.ART_GUIDES,...w.ART_EXTRA_GUIDES];
assert.equal(w.ART_GUIDES.length,22,"All existing lessons need guidance");
assert.equal(w.ART_EXTRA_LESSONS.length,6,"Expected six extra lessons");
assert.equal(w.ART_EXTRA_GUIDES.length,6,"Extra lessons need guidance");
for(const [i,g] of guides.entries()){
  assert.equal(g.theory.length,2,"Two theory paragraphs in lesson "+i);
  assert.ok(g.steps.length>=3 && g.secondSteps.length>=3,"Steps for lesson "+i);
  assert.ok(g.remember && g.second,"Key idea and bonus task "+i);
  for(let variant=0;variant<2;variant++){
    const svg=w.artExample(i,variant);
    assert.ok(svg.includes("<svg") && svg.includes("</svg>"),"SVG missing in lesson "+i);
    assert.ok(!/undefined|NaN/.test(svg),"Invalid illustration for "+i+"/"+variant);
  }
}
const html=read("www/index.html");
for(const f of ["enhanced.css",...jsFiles.map(p=>p.replace("www/",""))]){
 assert.ok(html.includes(f),f+" not loaded");
}
console.log("Content and syntax checks passed: 28 lessons, 56 activities, 56 offline illustrations.");
