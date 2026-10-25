/* Вікторія DinLova: предметне опрацювання уроків, інтерактивні досліди та самооцінювання. */
(function(){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=i=>window.DEEP_ART&&window.DEEP_ART[i];
let store=null,storeFn=null;
function bind(data,save){store=data;storeFn=save;store.deepChecks=store.deepChecks||{};store.deepJournal=store.deepJournal||{}}
function look(i){
 const d=get(i);if(!d)return '';
 let html='<div class="deep-intro"><span class="v3-eyebrow">Майстер-клас · навчальна мета</span><h2 class="deep-intro-title">'+esc(d.goal)+'</h2><div class="deep-metadata"><span>'+esc(d.time)+'</span><span>'+esc(d.level)+'</span><span>3 пояснення + практика</span></div><p>У цьому уроці важливо не просто знати визначення, а спостерігати, пробувати та пояснювати рішення власними словами.</p></div>';
 html+='<div class="v3-block"><span class="v3-eyebrow">Поглиблена теорія</span><h3>Зрозумій, як це працює</h3><div class="deep-essay">'+d.ideas.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>';
 html+='<h3>Мистецький словник</h3><div class="deep-terms">'+d.terms.map(([term,description])=>'<div class="deep-term"><b>'+esc(term)+'</b><span>'+esc(description)+'</span></div>').join('')+'</div>';
 html+='<p class="deep-summary-note">Прочитай один термін уголос і поясни його іншими словами. Якщо можеш придумати власний приклад — ти його зрозуміла.</p></div>';
 return html;
}
function explore(i){
 const d=get(i);if(!d)return '';
 let html='<div class="deep-case"><span class="v3-eyebrow">Зустріч із мистецтвом · розбір прикладу</span><h3>'+esc(d.caseTitle)+'</h3><p>'+esc(d.caseText)+'</p>';
 if(d.caseUrl)html+='<a target="_blank" rel="noopener noreferrer" href="'+esc(d.caseUrl)+'">Подивитися оригінал у музеї / архіві ↗</a><p class="deep-skip">Для зовнішнього музею потрібен інтернет. Усі пояснення та завдання уроку працюють офлайн.</p>';
 html+='</div>';
 html+=demo(i);
 html+='<div class="deep-summary-note"><strong>Запиши спостереження:</strong> Що саме змінилося в зображенні? Чому ти так думаєш? Порівняй зі своїм першим враженням.</div>';
 return html;
}
function demo(i){
 const label='Зміни один параметр і спостерігай за результатом.';
 if(i===1)return '<div class="deep-comparison"><h4>Живий дослід: перспектива</h4><p>Пересувай лінію горизонту. Подивись, як змінюється напрямок і відчуття простору.</p><div class="deep-control"><label for="deepRange">Висота горизонту</label><input id="deepRange" type="range" min="35" max="115" value="75" oninput="DEEP_UI.updateDemo(1,this.value)"></div><div class="deep-demo" id="deepDemo">'+perspectiveSVG(75)+'</div></div>';
 if(i===6)return '<div class="deep-comparison"><h4>Живий дослід: джерело світла</h4><p>Пересувай лампу подумки зліва направо. Де тепер світла частина предмета, а де падаюча тінь?</p><div class="deep-control"><label for="deepRange">Напрям світла</label><input id="deepRange" type="range" min="20" max="340" value="80" oninput="DEEP_UI.updateDemo(6,this.value)"></div><div class="deep-demo" id="deepDemo">'+lightSVG(80)+'</div></div>';
 if(i===4||i===17||i===18)return '<div class="deep-comparison"><h4>Живий дослід: композиційний акцент</h4><p>Змінюй розмір головного кола, не змінюючи інші фігури. Що помітно першим?</p><div class="deep-control"><label for="deepRange">Розмір акценту</label><input id="deepRange" type="range" min="22" max="100" value="68" oninput="DEEP_UI.updateDemo(4,this.value)"></div><div class="deep-demo" id="deepDemo">'+emphasisSVG(68)+'</div></div>';
 if(i===11||i===12||i===14)return '<div class="deep-comparison"><h4>Живий дослід: межі кадру</h4><p>Зміни рамку кадру. Що з історії залишається, а що зникає за її краями?</p><div class="deep-control"><label for="deepRange">Ширина кадру</label><input id="deepRange" type="range" min="75" max="290" value="250" oninput="DEEP_UI.updateDemo(11,this.value)"></div><div class="deep-demo" id="deepDemo">'+cropSVG(250)+'</div></div>';
 if(i===19)return '<div class="deep-comparison"><h4>Живий дослід: ієрархія заголовка</h4><p>Міняй розмір назви. Який рядок ти читаєш першим?</p><div class="deep-control"><label for="deepRange">Розмір заголовка</label><input id="deepRange" type="range" min="14" max="49" value="39" oninput="DEEP_UI.updateDemo(19,this.value)"></div><div class="deep-demo" id="deepDemo">'+typeSVG(39)+'</div></div>';
 if(i===5||i===20)return '';
 return '<div class="deep-comparison"><h4>Дослід: дві версії</h4><p>'+label+' Обери один із прикладів і поясни, як його можна покращити.</p><div class="deep-compare-options"><button type="button" class="deep-option" id="deepPickA" aria-pressed="true" onclick="DEEP_UI.choose('+i+',0)">Приклад А: перший задум</button><button type="button" class="deep-option" id="deepPickB" aria-pressed="false" onclick="DEEP_UI.choose('+i+',1)">Приклад Б: інший підхід</button></div><div class="deep-demo" style="height:auto;padding:12px" id="deepDemo">'+window.artExample(i,0)+'</div><p id="deepDemoLabel" class="deep-feedback">Подумай, що змінюється у другій версії. Яку ти обрала б для власної мети?</p></div>';
}
function perspectiveSVG(v){
 const y=Number(v)+35;return '<svg viewBox="0 0 380 230" role="img" aria-label="Лінійна перспектива з рухомим горизонтом"><rect width="380" height="'+y+'" fill="#d8e7f1"/><rect y="'+y+'" width="380" height="'+(230-y)+'" fill="#dae1ca"/><path d="M0 230L192 '+y+'L380 230Z" fill="#cfb6a7"/><path d="M24 230L192 '+y+'L354 230" stroke="#fff6dc" stroke-width="3" fill="none"/><line x1="0" y1="'+y+'" x2="380" y2="'+y+'" stroke="#54778a" stroke-dasharray="7 5" stroke-width="2"/><circle cx="192" cy="'+y+'" r="6" fill="#b85e62"/><text x="201" y="'+(y-10)+'" fill="#4b4d64" font-size="12">Точка сходження</text><text x="15" y="'+(y-8)+'" fill="#43596c" font-size="12">Горизонт</text><path d="M55 213v-35m-14 -12l14 -28l14 28Z" fill="#559b77" stroke="#6d7359" stroke-width="5"/><path d="M308 207v-30m-13 -9l13 -24l13 24Z" fill="#559b77" stroke="#6d7359" stroke-width="5"/></svg>';
}
function lightSVG(v){
 const x=Number(v),shadow=190+(190-x)*.35;return '<svg viewBox="0 0 380 230" role="img" aria-label="Світло й тінь при пересуванні лампи"><defs><radialGradient id="lightball" cx="'+Math.round(x/380*100)+'%" cy="20%" r="90%"><stop offset="0" stop-color="#ffe7ae"/><stop offset=".55" stop-color="#dc9e72"/><stop offset="1" stop-color="#765376"/></radialGradient></defs><rect width="380" height="230" fill="#f7efdf"/><line x1="0" y1="188" x2="380" y2="188" stroke="#bcaeae" stroke-width="5"/><ellipse cx="'+shadow+'" cy="193" rx="95" ry="13" fill="#a69ca2" opacity=".52"/><circle cx="190" cy="124" r="64" fill="url(#lightball)"/><circle cx="'+x+'" cy="39" r="16" fill="#ffca60"/><path d="M'+x+' 58L190 70" stroke="#f0c781" stroke-width="3" stroke-dasharray="7 5"/><text x="12" y="216" font-size="12" fill="#715f62">Падаюча тінь змінює напрям</text></svg>';
}
function emphasisSVG(v){
 const r=Number(v);return '<svg viewBox="0 0 380 230" role="img" aria-label="Зміна головного композиційного акценту"><rect width="380" height="230" fill="#f1e5d6"/><circle cx="128" cy="113" r="'+r+'" fill="#b86f60"/><circle cx="280" cy="68" r="23" fill="#547d7d"/><circle cx="301" cy="157" r="19" fill="#6f6796"/><rect x="267" y="100" width="32" height="28" fill="#e3b25b"/><text x="14" y="218" font-size="12" fill="#635764">Що привертає погляд першим?</text></svg>';
}
function cropSVG(v){
 const width=Number(v),x=(380-width)/2;return '<svg viewBox="0 0 380 230" role="img" aria-label="Зміна рамки фотографії"><rect width="380" height="230" fill="#e8eef2"/><circle cx="316" cy="62" r="31" fill="#eec77b"/><path d="M0 168L70 70L162 169Z" fill="#91ad9c"/><path d="M138 181L270 80L380 181Z" fill="#638c8e"/><path d="M0 172h380v58H0Z" fill="#a7c5ae"/><path d="M88 178v-44" stroke="#6b553f" stroke-width="8"/><circle cx="87" cy="112" r="35" fill="#55886b"/><rect x="'+x+'" y="21" width="'+width+'" height="185" rx="3" fill="none" stroke="#c44c51" stroke-width="6"/><path d="M'+x+' 21V206M'+(x+width)+' 21V206" stroke="#f4e0da" stroke-width="1"/><text x="15" y="218" font-size="12" fill="#384f5c">Червона рамка: межі майбутнього кадру</text></svg>';
}
function typeSVG(v){
 const size=Number(v);return '<svg viewBox="0 0 380 230" role="img" aria-label="Зміна ієрархії тексту"><rect width="380" height="230" fill="#efe3d4"/><text x="24" y="100" font-size="'+size+'" font-family="sans-serif" font-weight="bold" fill="#4e3f56">МОЯ ВИСТАВКА</text><path d="M24 122h310" stroke="#ab8d8c" stroke-width="2"/><text x="27" y="164" font-size="17" font-family="sans-serif" fill="#866d6c">СУБОТА · 12:00</text><text x="27" y="191" font-size="14" font-family="sans-serif" fill="#866d6c">АРТ-МАЙСТЕРНЯ</text></svg>';
}
function updateDemo(kind,value){
 const el=document.getElementById('deepDemo');if(!el)return;
 const v=Number(value);
 el.innerHTML=kind===1?perspectiveSVG(v):kind===6?lightSVG(v):kind===4?emphasisSVG(v):kind===11?cropSVG(v):typeSVG(v);
}
function choose(i,k){
 const area=document.getElementById('deepDemo');if(area)area.innerHTML=window.artExample(i,k);
 for(const [index,id] of ['deepPickA','deepPickB'].entries()){const b=document.getElementById(id);if(b)b.setAttribute('aria-pressed',String(index===k))}
 const note=document.getElementById('deepDemoLabel');if(note)note.textContent=k===0?'Приклад А: знайди головний прийом і назви, чого ще бракує.':'Приклад Б: порівняй із А та поясни, яка версія краща для твоєї ідеї.';
}
function make(i){
 const d=get(i);if(!d)return '';
 return '<div class="v3-block"><span class="v3-eyebrow">Дослідницька практика · '+esc(d.time)+'</span><h3>Зроби дослід перед фінальною роботою</h3><p>Твій дослід має дати відповідь на конкретне запитання. Створи щонайменше два варіанти, порівняй їх і лише після цього обирай рішення для творчої роботи.</p><ol class="deep-steps">'+d.try.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol><p class="deep-summary-note">Дві творчі роботи нижче — основний практичний блок уроку. Експеримент вище допоможе зробити їх усвідомлено, а не просто скопіювати приклади.</p></div><div class="deep-task-advanced"><h4>Складніший рівень · Мій творчий виклик</h4><p>'+esc(d.stretch)+'</p></div>';
}
function review(i,data,save){
 const d=get(i);if(!d)return '';
 bind(data,save);
 const checked=store.deepChecks[i]||[false,false,false];
 const done=checked.filter(Boolean).length;
 return '<div class="v3-block"><span class="v3-eyebrow">Рефлексія · без порівняння з іншими</span><h3>Як оцінити свою роботу?</h3><p>Оціни не те, «наскільки красивий малюнок», а чи вдалося застосувати навички та пояснити результат. Вибери пункти, які можеш підтвердити своїм малюнком або дослідом.</p><div class="deep-check-list">'+d.checks.map((c,j)=>'<label class="deep-check '+(checked[j]?'checked':'')+'"><input type="checkbox" '+(checked[j]?'checked':'')+' onchange="DEEP_UI.check('+i+','+j+',this.checked)"><span>'+esc(c)+'</span></label>').join('')+'</div><div class="deep-progress"><i id="deepProgressBar" style="width:'+Math.round(done/3*100)+'%"></i></div><div class="deep-feedback" id="deepProgressText">'+done+' із 3 умінь відзначено. Це не оцінка таланту — це підказка, над чим попрацювати.</div></div>'+
 '<div class="v3-block"><span class="v3-eyebrow">Мій творчий щоденник</span><h3>Що змінилося між двома спробами?</h3><p>Запиши коротко, яке рішення спочатку не спрацювало, що ти змінила і чому результат став ближчим до задуму.</p><textarea id="deepJournal" rows="4" maxlength="1600" style="width:100%" placeholder="Спочатку я… Потім спробувала… Помітила, що…">'+esc(store.deepJournal[i]||'')+'</textarea><button class="deep-save" onclick="DEEP_UI.saveJournal('+i+')">Зберегти висновок</button><p class="status" id="deepJournalStatus"></p></div>';
}
function check(i,j,isChecked){
 if(!store||!storeFn)return;const arr=store.deepChecks[i]||[false,false,false];arr[j]=!!isChecked;store.deepChecks[i]=arr;storeFn();
 const done=arr.filter(Boolean).length;const b=document.getElementById('deepProgressBar');if(b)b.style.width=Math.round(done/3*100)+'%';
 const t=document.getElementById('deepProgressText');if(t)t.textContent=done+' із 3 умінь відзначено. '+(done===3?'Чудово: ти пояснила свої художні рішення.':'Можна повернутися до роботи та щось покращити.');
}
function saveJournal(i){if(!store||!storeFn)return;const e=document.getElementById('deepJournal');if(!e)return;store.deepJournal[i]=String(e.value).trim().slice(0,1600);storeFn();const s=document.getElementById('deepJournalStatus');if(s)s.textContent='Запис збережено в твоєму творчому щоденнику.'}
window.DEEP_UI={look,explore,make,review,updateDemo,choose,check,saveJournal,bind};
})();