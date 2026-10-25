/* Оновлений інтерфейс, навігація й майстерня S Pen. */
(() => {
"use strict";
if (!window.ART_GUIDES || !window.artExample || !window.ART_EXTRA_LESSONS) {
  document.getElementById("app").innerHTML = '<div class="card">Помилка завантаження навчальних матеріалів. Перезапустіть програму.</div>';
  return;
}
content.push(...window.ART_EXTRA_LESSONS);
const guides = [...window.ART_GUIDES, ...window.ART_EXTRA_GUIDES];
data.taskDone = data.taskDone || {};
data.quizResults = data.quizResults || {};
data.reflections = data.reflections || {};
const main = document.getElementById("app"), nav = document.querySelector(".nav");
const icons = {
  lessons:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5.5C6 3.7 9.3 4.3 12 6c2.7-1.7 6-2.3 9-.5v13c-3-1.8-6.3-1.2-9 .5-2.7-1.7-6-2.3-9-.5zM12 6v13"/></svg>',
  studio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m14 5 5 5M4 20l5-1 11-11a2.1 2.1 0 0 0-3-3L6 16z"/></svg>',
  gallery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m21 16-5-5L5 21"/></svg>',
  parent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M4 11v-4M20 11v-4"/></svg>'
};
const navLabels={lessons:"Уроки",studio:"Малювання",gallery:"Галерея",parent:"Батькам"};
nav.innerHTML=Object.keys(navLabels).map(k=>'<button id="nav-'+k+'" type="button" onclick="artNavigate(\''+k+'\')">'+icons[k]+'<span>'+navLabels[k]+'</span></button>').join("");
let page="lessons", lessonId=-1, taskId=0, zoom=1, brush="pencil", inkColor="#6250a0", brushSize=6, penOnly=false, usePressure=true;
let paintCanvas, bgCanvas, paintCtx, bgCtx, active=null, actions=[], redoActions=[], backgroundData=null, lastPenAt=0, panStart=null;
const W=900,H=650;
const quality=d=>Math.round(d*10)/10;
const lessonGroup=i=>guides[i]||guides[0];
const taskInfo=(i,k)=>({title:k===0?content[i][3]:lessonGroup(i).second,steps:k===0?lessonGroup(i).steps:lessonGroup(i).secondSteps});
function route(name,i=lessonId,k=taskId,add=true){
 if(page==="studio")saveDraft();
 page=name;lessonId=Number.isInteger(i)?i:-1;taskId=k||0;
 if(add)history.pushState({page,lessonId,taskId},"","#"+page+(lessonId>=0?"-"+lessonId+"-"+taskId:""));
 drawPage();
}
window.artNavigate = function(name){
 if(name==="studio" && lessonId<0) return route("studio",-1,0);
 if(name==="studio") return route("studio",lessonId,taskId);
 route(name,-1,0);
};
window.lesson=function(i){route("lesson",Number(i),0)};
window.openStudio=function(i,k=0){route("studio",Number(i),Number(k))};
window.artBack=function(){
 if(page==="studio" && lessonId>=0) return route("lesson",lessonId,taskId);
 if(page==="lesson")return route("lessons",-1,0);
 history.back();
};
window.addEventListener("popstate", e=>{
 if(page==="studio")saveDraft();
 const s=e.state||{page:"lessons",lessonId:-1,taskId:0};
 page=s.page||"lessons";lessonId=Number.isInteger(s.lessonId)?s.lessonId:-1;taskId=s.taskId||0;
 drawPage();
});
window.addEventListener("keydown",e=>{
 if(page!=="studio" || ["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?artRedo():artUndo()}
 else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();artRedo()}
 else if(e.key==="Escape"){e.preventDefault();artBack()}
});
function scrollTop(){window.scrollTo({top:0,behavior:"instant"})}
function drawPage(){
 nav.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
 const selected=(page==="lesson"||page==="library")?"lessons":page;
 document.getElementById("nav-"+selected)?.classList.add("active");
 if(page==="lessons")drawLessons();
 else if(page==="library")drawLibrary();
 else if(page==="lesson")drawLesson();
 else if(page==="studio")drawStudio();
 else if(page==="gallery")drawGallery();
 else if(page==="parent")drawParent();
 else drawLessons();
 scrollTop();
}
function drawLessons(){
 let count=Object.keys(data.done).filter(i=>Number(i)<content.length).length;
 main.innerHTML='<div class="card"><h2>Навчальна програма «Вікторія DinLova»</h2><p>Вивчай мистецтво, дизайн і фотографію. У кожному уроці — теорія, два творчі завдання, наочні приклади та тест.</p><div class="muted">Завершено '+count+' з '+content.length+' уроків • '+Object.keys(data.taskDone).length+' творчих вправ</div><progress max="'+content.length+'" value="'+count+'"></progress><p><button class="soft-button" onclick="artNavigate(\'library\')">Бібліотека та світові освітні практики</button></p></div>';
 let group="", html="";
 content.forEach((l,i)=>{
   if(group!==l[0]){if(html)html+="</div>";group=l[0];html+='<h2 class="section-title">'+esc(group)+'</h2><div class="lesson-list">'}
   html+='<button class="lesson '+(data.done[i]?"lesson-done":"")+'" onclick="lesson('+i+')"><b>'+(data.done[i]?"✓ ":"")+(i+1)+'. '+esc(l[1])+'</b><span class="lesson-meta">2 практики • 3 запитання • '+(data.quizResults[i]?.score!==undefined?"Результат "+data.quizResults[i].score+"/3 • ":"")+(data.grades[i]?"Оцінка "+data.grades[i]+"/12":"Рівень 8–10 років")+'</span></button>';
 });
 main.innerHTML+=html+"</div>";
}
function taskCard(i,k){
 const g=taskInfo(i,k);
 return '<article class="task-card"><span class="stage-tag">Завдання '+(k+1)+(data.taskDone[i+"-"+k]?" • виконано":"")+'</span><h4>'+esc(g.title)+'</h4>'+window.artExample(i,k)+'<b>Покрокова інструкція</b><ol>'+g.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol><button class="btn" onclick="openStudio('+i+','+k+')">Малювати / виконувати</button></article>';
}

function scoreFor(i){
 const q=window.ART_QUIZ_BANK[i]||[];
 const r=data.quizResults[i];
 if(!r)return null;
 return (r.answers||[]).reduce((a,v,k)=>a+(Number.isInteger(v)&&q[k]&&v===q[k][2]?1:0),0);
}
function quizHtml(i){
 const qs=window.ART_QUIZ_BANK[i]||[];
 const r=data.quizResults[i]||{answers:[]};
 const a=r.answers||[];
 const finished=qs.length>0&&qs.every((q,k)=>Number.isInteger(a[k]));
 return '<div class="card"><h3>Перевір розуміння — 3 запитання</h3><p class="muted">Потрібно не просто згадати слово, а застосувати знання. Після вибору відповіді відкривається пояснення; помилки — частина навчання.</p>'+
 qs.map((q,k)=>{
  const chosen=a[k], answered=Number.isInteger(chosen);
  return '<div class="quiz-question"><div class="quiz-num">Питання '+(k+1)+' з '+qs.length+'</div><h4>'+esc(q[0])+'</h4><div class="quiz-options">'+q[1].map((option,j)=>'<button type="button" '+(answered?'disabled':'')+' class="quiz-option '+(answered?(j===q[2]?'correct-option':j===chosen?'incorrect-option':''):'')+'" onclick="artSelectQuiz('+i+','+k+','+j+')">'+esc(option)+'</button>').join("")+'</div>'+
 (answered?'<div class="quiz-feedback '+(chosen===q[2]?"is-correct":"is-incorrect")+'"><b>'+(chosen===q[2]?"Правильно.":"Розберімо відповідь.")+'</b> '+esc(q[3])+'</div>':'')+'</div>';
 }).join("")+
 '<p class="quiz-result">'+(finished?"Результат: "+scoreFor(i)+" з "+qs.length+". "+(scoreFor(i)===3?"Усі завдання виконано!":"За бажанням перечитай пояснення та спробуй ще раз."):(a.filter(Number.isInteger).length+" з "+qs.length+" відповідей"))+'</p>'+
 '<button class="action alt" type="button" onclick="artRetryQuiz('+i+')">Спробувати тест ще раз</button></div>';
}
window.artSelectQuiz=function(i,k,j){
 const q=window.ART_QUIZ_BANK[i];if(!q||!q[k]||j<0||j>=4)return;
 const state=data.quizResults[i]||{answers:Array(q.length).fill(null),best:0,attempts:1};
 if(Number.isInteger(state.answers[k]))return;
 state.answers[k]=j;state.score=state.answers.reduce((a,v,n)=>a+(Number.isInteger(v)&&v===q[n][2]?1:0),0);
 state.best=Math.max(state.best||0,state.score);
 data.quizResults[i]=state;save();
 const holder=document.getElementById("quizHolder");if(holder)holder.innerHTML=quizHtml(i);
};
window.artRetryQuiz=function(i){
 if(!confirm("Повторити всі три запитання цього уроку? Найкращий попередній результат залишиться."))return;
 const old=data.quizResults[i]||{best:0,attempts:0};
 data.quizResults[i]={answers:Array(3).fill(null),best:Math.max(old.best||0,old.score||0),attempts:(old.attempts||1)+1};
 save();const holder=document.getElementById("quizHolder");if(holder)holder.innerHTML=quizHtml(i);
};
window.artSaveReflection=function(i){
 const note=document.getElementById("lessonReflection");
 if(!note)return;
 data.reflections[i]=note.value.trim().slice(0,2000);
 save();const status=document.getElementById("reflectionStatus");if(status)status.textContent="Міркування збережено.";
};
const refsFor=i=>(window.ART_LESSON_REFERENCES[i]||[]).map(id=>window.ART_REFERENCES.find(r=>r.id===id)).filter(Boolean);
function lessonSources(i){
 return '<details class="reading-resources"><summary>Джерела для теми та додаткове читання</summary><p class="muted">Оригінальні методичні матеріали та перевірені книги. Для відкриття посилань потрібен інтернет. Це авторський курс, не сертифікований Cambridge чи IB.</p>'+
 refsFor(i).map(r=>'<div class="reading-item"><b>'+esc(r.title)+'</b><span class="muted">'+esc(r.author)+' • '+esc(r.audience)+'</span><p>'+esc(r.why)+'</p><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">Офіційне джерело</a></div>').join("")+
 '<p><button class="soft-button" onclick="artNavigate(\'library\')">Уся бібліотека</button></p></details>';
}
function colorLab(){
 return '<div class="card"><h3>Інтерактивна лабораторія кольору</h3><p>Два однакові квадрати можуть виглядати по-різному на різному тлі. Зміни колір квадрата й обидва фони, але залиш квадрати однаковими. Що помітиш?</p><div class="color-controls"><label>Колір обох квадратів <input id="swatchInk" type="color" value="#9f85aa" oninput="artColorChange()"></label><label>Лівий фон <input id="swatchBackA" type="color" value="#313348" oninput="artColorChange()"></label><label>Правий фон <input id="swatchBackB" type="color" value="#f0e0c8" oninput="artColorChange()"></label></div><div class="color-experiment"><div id="colorLabLeft" style="background:#313348"><span class="color-same" style="background:#9f85aa"></span></div><div id="colorLabRight" style="background:#f0e0c8"><span class="color-same" style="background:#9f85aa"></span></div></div><p class="muted">Підказка: сприйняття кольору залежить від навколишніх відтінків. Це навчальний дослід за мотивами колірних експериментів Йозефа Альберса. Зразки відображає екран, тому результат може дещо відрізнятися на інших дисплеях.</p></div>';
}
window.artColorChange=function(){
 const ink=document.getElementById("swatchInk")?.value, a=document.getElementById("swatchBackA")?.value,b=document.getElementById("swatchBackB")?.value;
 if(!ink||!a||!b)return;
 document.querySelectorAll(".color-same").forEach(el=>el.style.background=ink);
 document.getElementById("colorLabLeft").style.background=a;
 document.getElementById("colorLabRight").style.background=b;
};
function drawLibrary(){
 main.innerHTML='<div class="page-top"><button class="soft-button" onclick="artBack()">← До уроків</button><h2>Бібліотека</h2></div>'+
 '<div class="card"><h3>Як побудовано навчання</h3><p>Авторський курс використовує дослідницький цикл: уважно подивитися, висловити гіпотезу, створити власний результат, отримати пояснення, оцінити й поліпшити роботу. Орієнтири — Cambridge Primary Art & Design, IB PYP, музейна педагогіка Getty/NGA, Harvard Project Zero та National Visual Arts Standards.</p><p><b>Важливо:</b> жодна зі згаданих установ не сертифікувала й не схвалювала цей застосунок. Посилання ведуть на офіційні сторінки, а зміст уроків та тестів — авторський.</p></div>'+
 window.ART_REFERENCES.map(r=>'<div class="card"><span class="stage-tag">'+esc(r.type)+'</span> <span class="stage-tag">'+esc(r.audience)+'</span><h3>'+esc(r.title)+'</h3><p>'+esc(r.author)+'</p><p>'+esc(r.why)+'</p>'+(r.note?'<p class="muted">'+esc(r.note)+'</p>':'')+'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">Відкрити джерело</a></div>').join("")+
 '<button class="soft-button" onclick="artNavigate(\'lessons\')">Назад до навчання</button>';
}
function drawLesson(){
 const i=lessonId;
 if(i<0||i>=content.length)return route("lessons",-1,0,false);
 const l=content[i],g=lessonGroup(i);
 main.innerHTML='<div class="page-top"><button class="soft-button" onclick="artBack()">← Усі уроки</button><span class="pill">'+esc(l[0])+'</span></div>'+
 '<div class="card"><h2>'+(i+1)+'. '+esc(l[1])+'</h2><h3>Спостерігаємо і розуміємо</h3><p>'+esc(l[2])+'</p><div class="theory">'+g.theory.map(x=>'<p>'+esc(x)+'</p>').join("")+'</div><p class="key-idea"><b>Запам’ятай:</b> '+esc(g.remember)+'</p><p class="muted"><b>Завдання для уважного погляду:</b> розглянь приклад нижче. Що ти помічаєш? Чому думаєш саме так? Яке запитання виникло?</p></div>'+
 ((i===5||i===20)?colorLab():"")+
 '<h3 class="section-title">Творча практика: 2 завдання</h3><p class="muted">Приклади — підказки, а не зразки, які треба точно копіювати. Можна вигадати власні форми й кольори.</p>'+
 '<div class="task-grid">'+taskCard(i,0)+taskCard(i,1)+'</div>'+
 '<div id="quizHolder">'+quizHtml(i)+'</div>'+
 '<div class="card"><h3>Мій погляд на роботу</h3><label for="lessonReflection">'+esc(window.ART_REFLECTION_PROMPTS[i])+'</label><textarea id="lessonReflection" rows="3" maxlength="2000" style="width:100%" placeholder="Можна написати коротко або обговорити з дорослими.">'+esc(data.reflections[i]||"")+'</textarea><button class="btn" onclick="artSaveReflection('+i+')">Зберегти мої думки</button><p class="status" id="reflectionStatus"></p></div>'+
 '<div class="card">'+lessonSources(i)+'</div>'+
 '<div class="card"><button class="btn" onclick="complete('+i+')">Завершити урок</button><button class="action alt" onclick="artBack()">До всіх уроків</button></div>';
}

function drawGallery(){
 main.innerHTML='<div class="page-top"><h2>Галерея робіт</h2><button class="soft-button" onclick="artNavigate(\'lessons\')">До уроків</button></div>'+
 (data.works.length?'<div class="gallery-grid">'+data.works.map((w,i)=>'<div class="card"><h3>'+esc(w.name)+'</h3><img class="work" alt="Збережена творча робота" src="'+w.image+'"><p class="muted">'+esc(w.date)+'</p><button class="action alt" onclick="downloadWork('+i+')">Зберегти JPG</button></div>').join("")+'</div>':'<div class="card">Наразі тут порожньо. Створи перший малюнок і натисни «У галерею».</div>');
}
function drawParent(){
 let n=Object.keys(data.done).length,t=Object.values(data.tests),avg=t.length?t.reduce((a,b)=>a+b,0)/t.length*100:0;
 main.innerHTML='<div class="page-top"><h2>Батьківський кабінет</h2><button class="soft-button" onclick="artNavigate(\'lessons\')">До уроків</button></div>'+
 '<div class="two"><div class="card"><h3>Уроки</h3><b>'+n+' / '+content.length+'</b></div><div class="card"><h3>Тести</h3><b>'+Math.round(avg)+'% правильних</b></div><div class="card"><h3>Роботи</h3><b>'+data.works.length+'</b></div></div>'+
 '<div class="card"><h3>Творчі завдання</h3><b>'+Object.keys(data.taskDone).length+' із '+(content.length*2)+'</b><p class="muted">Завдання позначається виконаним після збереження роботи в галерею.</p></div>'+
 '<div class="card"><h3>Оцінки уроків</h3>'+content.map((l,i)=>'<div style="padding:8px 0;border-bottom:1px solid #eee">'+(i+1)+'. '+esc(l[1])+' <select aria-label="Оцінка уроку '+(i+1)+'" onchange="grade('+i+',this.value)"><option value="">Без оцінки</option>'+Array.from({length:12},(_,n)=>'<option value="'+(n+1)+'" '+(data.grades[i]==n+1?'selected':'')+'>'+(n+1)+'/12</option>').join("")+'</select></div>').join("")+'</div>'+
 '<div class="card"><h3>Нотатки батьків</h3><textarea id="notes" rows="5" style="width:100%">'+esc(data.notes||"")+'</textarea><button class="btn" onclick="data.notes=document.getElementById(\'notes\').value;save();alert(\'Нотатку збережено\')">Зберегти</button></div>'+
 '<div class="card"><h3>Резервна копія</h3><p>Прогрес і збережені малюнки залишаються на цьому пристрої. Для перенесення експортуй файл JSON.</p><button class="btn" onclick="backup()">Експортувати</button><label>Відновити копію</label><input type="file" accept=".json,application/json" onchange="restore(event)"></div>';
}
const palette=["#222333","#6550a2","#dd5c72","#e5a441","#489a77","#428ec1","#b36b43","#eff0f1","#ffffff"];
const tools=[["pencil","Олівець"],["pen","Ручка"],["marker","Маркер"],["eraser","Гумка"],["pan","Рука"]];
const draftKey=()=> "mystetstvo-draft-v2:"+(lessonId<0?"free":lessonId+"-"+taskId);
function drawStudio(){
 const l=lessonId>=0?content[lessonId]:null;
 const task=l?taskInfo(lessonId,taskId):null;
 main.innerHTML='<div class="studio-head page-top"><button class="soft-button" onclick="artExitStudio()">← '+(l?'До уроку':'До уроків')+'</button><button class="btn" onclick="artStoreWork()">Зберегти в галерею</button></div>'+
 '<div class="studio-layout"><section class="card studio-canvas-card"><h2>Майстерня S Pen</h2><p class="muted">'+(l?esc(l[1])+' • Вправа '+(taskId+1):'Вільне малювання')+'</p>'+
 '<label for="workname">Назва роботи</label><input id="workname" style="width:100%" value="'+esc(task?task.title:"Моя робота")+'">'+
 '<div id="toolset" class="studio-tools">'+tools.map(([id,name])=>'<button type="button" id="tool-'+id+'" class="toolbtn" onclick="artTool(\''+id+'\')">'+name+'</button>').join("")+'</div>'+
 '<div class="toolgroup"><div class="palette" id="colors"></div><div class="studio-controls"><label for="width">Товщина <input id="width" type="range" min="1" max="35" value="'+brushSize+'" oninput="artWidth(this.value)"> <b id="widthValue">'+brushSize+'</b></label><label><input id="pressure" type="checkbox" onchange="artPressure(this.checked)" '+(usePressure?"checked":"")+'> Натиск S Pen</label><label><input id="penonly" type="checkbox" onchange="artPenOnly(this.checked)" '+(penOnly?"checked":"")+'> Лише стилус</label></div></div>'+
 '<div class="button-row"><button class="action alt" id="undoBtn" onclick="artUndo()">↶ Скасувати</button><button class="action alt" id="redoBtn" onclick="artRedo()">↷ Повторити</button><button class="action outline" onclick="artClear()">Очистити</button></div>'+
 '<div class="button-row"><button class="action alt" onclick="artZoom(-1)">− Масштаб</button><button class="action alt" id="zoomValue" onclick="artZoom(0)">100% ↺</button><button class="action alt" onclick="artZoom(1)">+ Масштаб</button><label class="upload-photo">Фото як фон<input type="file" accept="image/*" aria-label="Вибрати фото для фону" onchange="artAddPhoto(event)"></label></div>'+
 '<div id="paintViewport"><div id="paintLayers"><canvas id="paperBg" width="900" height="650" aria-hidden="true"></canvas><canvas id="paint" width="900" height="650" aria-label="Полотно для малювання стилусом" tabindex="0"></canvas></div></div>'+
 '<p class="paint-caption">Намальовані лінії можна стерти, повернути назад або повторити. Інструмент «Рука» пересуває збільшене полотно. Чернетка зберігається на пристрої після кожного штриха.</p>'+
 '<p class="status" role="status" id="paintStatus"></p>'+
 '<div class="button-row"><button class="btn" onclick="artStoreWork()">У галерею</button><button class="action alt" onclick="artExitStudio()">Вийти з малювання</button></div></section>'+
 '<aside class="card studio-guide"><details class="guide-details" open><summary>Підказка до завдання ▾</summary>'+(task?'<div class="guide-header">Завдання '+(taskId+1)+': '+esc(task.title)+'</div>'+window.artExample(lessonId,taskId)+'<b>Роби по черзі:</b><ol>'+task.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>':'<p>Обери тему самостійно або повернися до уроків, щоб отримати приклад і кроки.</p>')+'</details></aside></div>';
 initPaint();
}
window.artExitStudio=()=>lessonId>=0?route("lesson",lessonId,taskId):route("lessons",-1,0);
window.artTool=t=>{brush=t;updateTools()};
window.artWidth=v=>{brushSize=Number(v);document.getElementById("widthValue").textContent=v};
window.artPressure=v=>{usePressure=v};
window.artPenOnly=v=>{penOnly=v;message(v?"Тепер дотик пальцем не малює.":"Можна малювати пальцем або стилусом.")};
window.artZoom=step=>{
 zoom=step===0?1:Math.min(3,Math.max(1,quality(zoom+step*.25)));
 const layers=document.getElementById("paintLayers");
 layers.style.width=(zoom*100)+"%";
 document.getElementById("zoomValue").textContent=Math.round(zoom*100)+"% ↺";
};
function updateTools(){
 tools.forEach(([id])=>document.getElementById("tool-"+id)?.classList.toggle("active",brush===id));
 document.querySelectorAll("#colors .swatch").forEach(el=>el.classList.toggle("active",el.dataset.color===inkColor));
 const u=document.getElementById("undoBtn"),r=document.getElementById("redoBtn");
 if(u)u.disabled=!actions.length;if(r)r.disabled=!redoActions.length;
}
window.artColor=c=>{inkColor=c;if(brush==="eraser"||brush==="pan")brush="pencil";updateTools()};
function message(t){const el=document.getElementById("paintStatus");if(el)el.textContent=t}
function initPaint(){
 paintCanvas=document.getElementById("paint");bgCanvas=document.getElementById("paperBg");
 paintCtx=paintCanvas.getContext("2d");bgCtx=bgCanvas.getContext("2d");
 actions=[];redoActions=[];backgroundData=null;zoom=1;active=null;panStart=null;
 document.getElementById("colors").innerHTML=palette.map(c=>'<button class="swatch" data-color="'+c+'" style="background:'+c+'" onclick="artColor(\''+c+'\')" type="button" aria-label="Колір '+c+'"></button>').join("");
 const raw=localStorage.getItem(draftKey());
 if(raw){try{let d=JSON.parse(raw);actions=Array.isArray(d.actions)?d.actions:[];redoActions=[];backgroundData=typeof d.background==="string"?d.background:null;redrawInk();if(backgroundData)loadBg(backgroundData);message("Відновлено попередню чернетку.")}catch(e){message("Чернетку не вдалося відновити.")}}
 updateTools();
 paintCanvas.addEventListener("pointerdown",pointerDown);
 paintCanvas.addEventListener("pointermove",pointerMove);
 paintCanvas.addEventListener("pointerup",pointerUp);
 paintCanvas.addEventListener("pointercancel",pointerCancel);
 paintCanvas.addEventListener("lostpointercapture",pointerUp);
 paintCanvas.addEventListener("contextmenu",e=>e.preventDefault());
}
function point(e){
 const r=paintCanvas.getBoundingClientRect();
 return {x:quality(Math.max(0,Math.min(W,(e.clientX-r.left)/r.width*W))),y:quality(Math.max(0,Math.min(H,(e.clientY-r.top)/r.height*H))),p:quality(e.pointerType==="pen"&&e.pressure>0?e.pressure:0.5)};
}
function pointerDown(e){
 if(!e.isPrimary)return;
 if(e.pointerType==="pen")lastPenAt=Date.now();
 if(e.pointerType==="touch"&&(penOnly||Date.now()-lastPenAt<1500))return;
 e.preventDefault();
 if(brush==="pan"){panStart={id:e.pointerId,x:e.clientX,y:e.clientY,left:document.getElementById("paintViewport").scrollLeft,top:document.getElementById("paintViewport").scrollTop};paintCanvas.setPointerCapture(e.pointerId);return}
 let t=((e.button===5)||(e.buttons&32))?"eraser":brush;
 active={id:e.pointerId,action:{kind:"stroke",tool:t,color:inkColor,width:brushSize,pressure:usePressure,points:[point(e)]}};
 paintCanvas.setPointerCapture(e.pointerId);
 renderStroke(active.action,true);
}
function pointerMove(e){
 if(panStart&&e.pointerId===panStart.id){e.preventDefault();const vp=document.getElementById("paintViewport");vp.scrollLeft=panStart.left-(e.clientX-panStart.x);vp.scrollTop=panStart.top-(e.clientY-panStart.y);return}
 if(!active||e.pointerId!==active.id)return;
 e.preventDefault();
 const events=e.getCoalescedEvents?e.getCoalescedEvents():[e];
 for(const event of events){const p=point(event);const a=active.action,old=a.points[a.points.length-1];if(Math.hypot(p.x-old.x,p.y-old.y)<.5)continue;a.points.push(p);renderStroke(a,false)}
}
function pointerUp(e){
 if(panStart&&e.pointerId===panStart.id){panStart=null;return}
 if(!active||active.id!==e.pointerId)return;
 const a=active.action;
 const p=point(e),last=a.points[a.points.length-1];
 if(Math.hypot(p.x-last.x,p.y-last.y)>0.5){a.points.push(p);renderStroke(a,false)}
 actions.push(a);
 if(actions.length>350)actions=actions.slice(-350);
 redoActions=[];active=null;saveDraft();updateTools();
}
function pointerCancel(e){if(active&&active.id===e.pointerId){active=null;redrawInk()}panStart=null}
function lineWidth(a,p){const pressure=a.pressure?Math.max(.35,Math.min(1.75,p*1.65)):1;return a.width*(a.tool==="marker"?2.5: a.tool==="eraser"?3:a.tool==="pencil"?.75:1)*pressure}
function drawDot(a,p){
 if(a.tool==="pan")return;
 paintCtx.save();paintCtx.globalCompositeOperation=a.tool==="eraser"?"destination-out":"source-over";
 paintCtx.globalAlpha=a.tool==="marker"?.25:1;
 paintCtx.fillStyle=a.color;
 paintCtx.beginPath();paintCtx.arc(p.x,p.y,Math.max(.5,lineWidth(a,p.p)/2),0,Math.PI*2);paintCtx.fill();paintCtx.restore();
}
function drawSegment(a,p,q){
 paintCtx.save();
 paintCtx.globalCompositeOperation=a.tool==="eraser"?"destination-out":"source-over";
 paintCtx.globalAlpha=a.tool==="marker"?.27: a.tool==="pencil"?.8:1;
 paintCtx.lineCap="round";paintCtx.lineJoin="round";paintCtx.strokeStyle=a.color;
 paintCtx.lineWidth=Math.max(.7,(lineWidth(a,p.p)+lineWidth(a,q.p))/2);
 paintCtx.beginPath();paintCtx.moveTo(p.x,p.y);paintCtx.lineTo(q.x,q.y);paintCtx.stroke();paintCtx.restore();
}
function renderStroke(a,isStart){
 if(isStart){drawDot(a,a.points[0]);return}
 const pts=a.points;if(pts.length>1)drawSegment(a,pts[pts.length-2],pts[pts.length-1]);
}
function redrawInk(){
 if(!paintCtx)return;
 paintCtx.clearRect(0,0,W,H);
 const cut=actions.findLastIndex(x=>x.kind==="clear");
 actions.slice(cut+1).forEach(a=>{
 if(a.kind!=="stroke"||!a.points?.length)return;
 drawDot(a,a.points[0]);
 for(let j=1;j<a.points.length;j++)drawSegment(a,a.points[j-1],a.points[j]);
 });
}
window.artUndo=()=>{if(!actions.length)return;redoActions.push(actions.pop());redrawInk();saveDraft();updateTools()};
window.artRedo=()=>{if(!redoActions.length)return;actions.push(redoActions.pop());redrawInk();saveDraft();updateTools()};
window.artClear=()=>{if(confirm("Очистити всі штрихи? Фонове фото залишиться.")){actions.push({kind:"clear"});redoActions=[];redrawInk();saveDraft();updateTools()}};
function saveDraft(){
 if(!paintCanvas)return;
 try{localStorage.setItem(draftKey(),JSON.stringify({actions,background:backgroundData}));message("Чернетку збережено.")}catch(e){message("Недостатньо пам’яті для чернетки — збережіть роботу в галерею та зробіть резервну копію.")}
}
function loadBg(url){
 const im=new Image();
 im.onload=()=>{if(!bgCtx)return;bgCtx.clearRect(0,0,W,H);bgCtx.fillStyle="#fff";bgCtx.fillRect(0,0,W,H);const z=Math.min(W/im.width,H/im.height),w=im.width*z,h=im.height*z;bgCtx.drawImage(im,(W-w)/2,(H-h)/2,w,h)};
 im.src=url;
}
window.artAddPhoto=function(e){
 const f=e.target.files?.[0];if(!f)return;
 if(!f.type.startsWith("image/")){message("Вибери файл зображення.");return}
 const reader=new FileReader();
 reader.onload=()=>{const im=new Image();im.onload=()=>{
   const c=document.createElement("canvas");const z=Math.min(1,1200/Math.max(im.width,im.height));c.width=Math.round(im.width*z);c.height=Math.round(im.height*z);
   c.getContext("2d").drawImage(im,0,0,c.width,c.height);backgroundData=c.toDataURL("image/jpeg",.72);loadBg(backgroundData);saveDraft();message("Фото додано. Малюй поверх нього, а гумка стиратиме лише лінії.")
 };im.src=reader.result};
 reader.readAsDataURL(f);
};
window.artStoreWork=function(){
 if(!paintCanvas)return;
 const composed=document.createElement("canvas");composed.width=W;composed.height=H;const c=composed.getContext("2d");
 c.fillStyle="#fff";c.fillRect(0,0,W,H);c.drawImage(bgCanvas,0,0);c.drawImage(paintCanvas,0,0);
 const name=document.getElementById("workname").value.trim()||"Моя робота";
 const work={name,image:composed.toDataURL("image/jpeg",.78),date:new Date().toLocaleDateString("uk-UA"),lessonId,taskId};
 data.works.unshift(work);
 if(lessonId>=0)data.taskDone[lessonId+"-"+taskId]=new Date().toISOString();
 try{localStorage.setItem(K,JSON.stringify(data))}catch(e){data.works.shift();if(lessonId>=0)delete data.taskDone[lessonId+"-"+taskId];message("Недостатньо місця. Експортуйте резервну копію та звільніть пам'ять.");return}
 message("Роботу додано до галереї.");route("gallery",-1,0);
};
history.replaceState({page:"lessons",lessonId:-1,taskId:0},"",location.href);
window.tab=function(name){window.artNavigate(name)};
drawPage();
})();