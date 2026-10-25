/* Вікторія DinLova • нова візуальна мистецька школа */
(function(){
'use strict';
const modules=[
['Історія мистецтва','Мистецтво крізь час','АРТІСТОРІЯ','#ddcfb2'],
['Візуальна грамотність','Мова кольору й форми','СПОСТЕРІГАЙ','#d7e4d6'],
['Фотографія','Історії через об’єктив','ФОТОМИСТЕЦТВО','#e6cad4'],
['iPhone та Android','Майстерня фотографії','ФОТОЛАБОРАТОРІЯ','#d1e4ea'],
['Основи дизайну','Світ дизайну','ДИЗАЙН-СТУДІЯ','#eed4b6'],
['Малювання стилусом','Малюй як художник','S PEN МАЙСТЕРНЯ','#d9d0ea'],
['Творча практика','Створи власний світ','ТВОРЧЕ ПОРТФОЛІО','#d0e3d4']
];
const thought=[
'Що зі старовинного зображення можна впевнено дізнатися, а про що лише здогадатися?',
'Як висота горизонту змінює враження від дороги, яка йде вдалину?',
'Чи здогадається молодша дитина, що робить твоя іконка, якщо прибрати підпис?',
'Як зміниться композиція, якщо поміняти місцями велике коло і малий трикутник?',
'Який елемент ти побачиш першим? Як це змінити, не малюючи нових предметів?',
'Постав однаковий колір на світлому й темному фонах: чи сприймається він однаково?',
'Який бік кулі стане темнішим, якщо перенести джерело світла на інший бік?',
'Який візерунок здається рухливішим: однакові елементи чи ті, що збільшуються?',
'Що станеться з проєкцією, якщо перемістити предмет відносно отвору?',
'Чи зрозуміє глядач історію, якщо поміняти перший і останній кадри місцями?',
'Коли фото надто яскраве, яку інформацію в світлих ділянках можна втратити?',
'Що зміниться у відчутті предмета, якщо подивитися на нього знизу?',
'Яке розташування головного героя краще передає твій задум: центр чи третини?',
'Як освітлення зліва замість спереду змінить натюрморт?',
'Які важливі деталі зникнуть, якщо обрізати фото надто сильно?',
'Як порядок фото змінює розповідь твоєї невеликої виставки?',
'Яка з форм на твоїй афіші створює потрібний настрій?',
'Чи можливо врівноважити велику форму кількома меншими?',
'Що буде, якщо прибрати половину дрібних деталей із листівки?',
'Який рядок глядач прочитає першим і чи саме так ти задумала?',
'Як зміниться читабельність тексту, якщо колір фону буде темнішим?',
'Яка риса у твоїх роботах повторюється й стає частиною стилю?',
'Який штрих краще передає рух, а який підходить для дрібних деталей?',
'Які лінії роблять камінь схожим на камінь, а хутро — на хутро?',
'Які три зміни можуть зробити чорновий ескіз виразнішим?',
'Як зробити намальовану фантастичну деталь природною частиною фото?',
'Як передати нову емоцію, змінюючи тільки брови й рот?',
'Який кадр у твоєму коміксі можна прибрати, не втративши зміст?'
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function designArt(k){
 const b=modules[k][3],svg=['<svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="230" fill="'+b+'"/>'];
 if(k===0) svg.push('<circle cx="305" cy="65" r="57" fill="#bf896a"/><path d="M0 203Q90 111 186 172T400 157V230H0Z" fill="#b89e78"/><path d="M57 160Q58 104 118 109L146 86L173 98L189 129L160 139L158 187H141L129 149H93L78 186H57Z" fill="#6f5b52"/><path d="M142 95L129 56M142 95L156 62M142 95L176 70" stroke="#6f5b52" stroke-width="9"/>');
 if(k===1) svg.push('<circle cx="307" cy="64" r="70" fill="#edbf75"/><path d="M-15 217L103 79L224 226Z" fill="#91b5a6"/><path d="M165 237L286 20L414 234Z" fill="#588c88"/><path d="M54 39Q75 80 109 37M68 39Q105 85 128 34" fill="none" stroke="#ca7e63" stroke-width="13"/>');
 if(k===2) svg.push('<rect x="56" y="29" width="290" height="176" rx="25" fill="#975f7d"/><rect x="94" y="71" width="211" height="111" rx="9" fill="#f9eadb"/><circle cx="200" cy="126" r="50" fill="#7ca7a8"/><circle cx="200" cy="126" r="28" fill="#e8c99f"/><circle cx="200" cy="126" r="12" fill="#915f76"/><path d="M111 45h55" stroke="#f9e8df" stroke-width="11"/>');
 if(k===3) svg.push('<rect x="104" y="-14" width="194" height="258" rx="25" fill="#3e6e85"/><rect x="119" y="25" width="164" height="173" fill="#e9e7d4"/><circle cx="218" cy="78" r="28" fill="#ebbc76"/><path d="M120 169L167 114L192 145L238 94L281 159V198H120Z" fill="#73a097"/><circle cx="198" cy="215" r="8" fill="#f0e8dc"/>');
 if(k===4) svg.push('<rect x="38" y="32" width="153" height="155" fill="#b7745a"/><circle cx="269" cy="78" r="63" fill="#ecc27d"/><path d="M244 207L311 46L388 207Z" fill="#5a8282"/><path d="M65 222L161 67L253 223Z" fill="#edab91"/><path d="M30 18h172" stroke="#534a60" stroke-width="9"/>');
 if(k===5) svg.push('<path d="M0 185Q90 51 202 173T400 148V230H0Z" fill="#82749f"/><path d="M38 59q62 -39 124 0t122 -6" fill="none" stroke="#d27b86" stroke-width="26" stroke-linecap="round"/><path d="M104 159L218 32L260 72L141 203Z" fill="#f1d3ac"/><path d="M104 159l37 44 -66 20Z" fill="#52485e"/><circle cx="333" cy="65" r="29" fill="#efbc74"/>');
 if(k===6) svg.push('<rect x="36" y="37" width="107" height="157" rx="5" fill="#fff2e4" transform="rotate(-6 36 37)"/><rect x="148" y="15" width="114" height="179" rx="5" fill="#f0bf9f" transform="rotate(5 148 15)"/><rect x="280" y="38" width="92" height="152" rx="5" fill="#f8ebeb" transform="rotate(-5 280 38)"/><circle cx="97" cy="105" r="22" fill="#8475a0"/><path d="M165 130q34 -63 74 0" fill="none" stroke="#5d9691" stroke-width="23"/><path d="M307 97l23 -40 27 42" fill="none" stroke="#b77d6e" stroke-width="17"/>');
 return svg.join('')+'</svg>';
}
function heroArt(){
 return '<svg viewBox="0 0 570 465" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="570" height="465" fill="#98717e"/><path d="M61 -47L396 -47L335 520L58 520Z" fill="#f1d0a8" transform="rotate(-11 61 -47)"/><path d="M131 182Q146 69 239 62Q327 65 344 175Q356 282 236 359Q107 277 131 182Z" fill="#cf8d84"/><path d="M166 168Q179 89 251 90Q309 97 312 170Q305 233 255 271Q196 249 166 168Z" fill="#e3b7af"/><circle cx="220" cy="172" r="14" fill="#39465d"/><circle cx="284" cy="172" r="14" fill="#39465d"/><path d="M226 260Q259 282 290 254" fill="none" stroke="#504254" stroke-width="7"/><path d="M115 413Q210 341 341 415" fill="none" stroke="#43736e" stroke-width="70"/><path d="M273 -53L535 282L370 359L210 43Z" fill="#4e7974" opacity=".74"/><circle cx="455" cy="100" r="88" fill="#eabd74"/><path d="M400 324Q481 194 599 307L590 482H362Z" fill="#f4d2b3"/><path d="M391 306q75 -52 161 7M386 350q85 -58 155 11" stroke="#ac6b64" stroke-width="9" fill="none"/><circle cx="64" cy="81" r="11" fill="#f8e6cb"/></svg>';
}
function moduleIds(content,k){let out=[];content.forEach((l,i)=>{if(l[0]===modules[k][0])out.push(i)});return out}
function home(content,data){
 window.ATELIER.content=content;window.ATELIER.progress=data;
 const completed=Object.keys(data.done||{}).filter(i=>Number(i)<content.length).length;
 let html='<section class="v3-hero"><div class="v3-hero-copy"><span class="v3-eyebrow">МАЙСТЕР-КЛАСИ 4.0 · 8–10 років</span><h1 class="v3-display">Навчися<br>бачити красу.</h1><p>Мистецтво, дизайн і фотографія. Досліджуй роботи, експериментуй із кольором і створи власне портфоліо.</p><button class="v3-white-button" onclick="ATELIER.start()">Продовжити навчання →</button><div class="v3-hero-badges"><span>28 майстер-класів</span><span>56 вправ</span><span>S Pen</span></div></div><div class="v3-hero-visual">'+heroArt()+'</div></section>';
 html+='<div class="v3-stats"><div class="v3-stat"><strong>'+completed+' <small style="font-size:14px;color:#978883">/ '+content.length+'</small></strong><span>Пройдено уроків</span></div><div class="v3-stat"><strong>'+Object.keys(data.taskDone||{}).length+'</strong><span>Творчих вправ</span></div><div class="v3-stat"><strong>'+(data.works||[]).length+'</strong><span>Робіт у галереї</span></div></div>';
 html+='<div class="v3-section-heading"><div><span class="v3-eyebrow">Обери свій шлях</span><h2>Майстерні мистецтва</h2><p>Від перших зображень до власних дизайнерських проєктів</p></div><button class="v3-more-link" onclick="artNavigate(\'library\')">Бібліотека →</button></div><div class="v3-modules">';
 modules.forEach((m,k)=>{const group=moduleIds(content,k),n=group.filter(i=>data.done[i]).length;
 html+='<button class="v3-module" onclick="ATELIER.openUnit('+k+')"><div class="v3-module-art">'+designArt(k)+'</div><div class="v3-module-meta"><span class="v3-eyebrow">'+m[2]+' · '+group.length+' уроків</span><strong>'+m[1]+'</strong><span class="muted">'+n+' із '+group.length+' завершено</span><div class="v3-module-bottom"><div class="v3-mini-progress"><i style="width:'+Math.round(100*n/group.length)+'%"></i></div><span class="v3-module-arrow">↗</span></div></div></button>'});
 html+='</div><section class="v3-journey"><div><span class="v3-eyebrow">Твоя творча подорож</span><h3>Дивись. Думай. Створюй. Покращуй.</h3><p>У мистецтві немає лише одного правильного малюнка. Важливі уважне спостереження, власні ідеї та сміливість експериментувати.</p></div><button class="soft-button" onclick="openStudio(-1,0)">Вільне малювання ↗</button></section>';
 return html;
}
function start(){const c=ATELIER.content,d=ATELIER.progress,k=c.findIndex((x,i)=>!d.done[i]);if(k>=0)window.lesson(k);else openUnit(0)}
function openUnit(k){
 const m=modules[k],c=ATELIER.content,d=ATELIER.progress;if(!m)return;
 history.pushState({page:'lessons',lessonId:-1,taskId:0},'','#module-'+k);
 const group=moduleIds(c,k);let html='<div class="page-top"><button class="v3-back" onclick="artNavigate(\'lessons\')">← Всі майстерні</button><span class="v3-eyebrow">'+m[2]+'</span></div>';
 html+='<div class="v3-unit-header"><div><span class="v3-eyebrow">Навчальний модуль '+(k+1)+' / 7</span><h2>'+m[1]+'</h2><p>'+group.length+' уроків · '+group.length*2+' творчих завдань</p></div><div class="v3-unit-icon">'+designArt(k)+'</div></div><div class="v3-lesson-list">';
 group.forEach(i=>{html+='<button class="v3-lesson-row '+(d.done[i]?'done':'')+'" onclick="lesson('+i+')"><span class="v3-lesson-num">'+(d.done[i]?'✓':String(i+1).padStart(2,'0'))+'</span><span><strong>'+esc(c[i][1])+'</strong><small>Дослідження · практика · перевірка</small></span><span class="v3-module-arrow">→</span></button>'});
 html+='</div><div class="v3-challenge"><b>Мистецьке завдання</b><p>У кожному уроці створи свій варіант роботи й поясни, чому обрала саме ці кольори, форми та композицію.</p></div>';
 document.getElementById('app').innerHTML=html;window.scrollTo({top:0,behavior:'instant'});
}
function show(part){
 for(const p of document.querySelectorAll('.v3-panel'))p.classList.toggle('active',p.dataset.section===part);
 for(const b of document.querySelectorAll('.v3-step'))b.classList.toggle('active',b.dataset.section===part);
 const nav=document.getElementById('atelier-tabs');if(nav)nav.scrollIntoView({behavior:'smooth',block:'start'});
}
function lesson(i,content,data,guide,quizHtml,taskCard,lessonSources,colorLab,saveFn){
 const l=content[i],group=Math.max(0,modules.findIndex(m=>m[0]===l[0]));
 const m=modules[group],intro=thought[i]||'Що ти помічаєш у цьому зображенні?',num=String(i+1).padStart(2,'0');
 let html='<div class="page-top"><button class="v3-back" onclick="ATELIER.openUnit('+group+')">← '+esc(m[1])+'</button><span class="v3-eyebrow">Урок '+num+' / '+content.length+'</span></div>';
 html+='<div class="v3-lesson-banner"><div class="v3-lesson-banner-copy"><span class="v3-eyebrow">'+esc(l[0])+'</span><h1 class="v3-display">'+esc(l[1])+'</h1><p>Помічай · експериментуй · пояснюй власні рішення</p></div><div class="v3-lesson-banner-art">'+designArt(group)+'</div></div>';
 html+='<div class="v3-steps-nav" id="atelier-tabs"><button class="v3-step active" data-section="look" onclick="ATELIER.show(\'look\')">01 · Теорія</button><button class="v3-step" data-section="explore" onclick="ATELIER.show(\'explore\')">02 · Аналіз</button><button class="v3-step" data-section="make" onclick="ATELIER.show(\'make\')">03 · Практика</button><button class="v3-step" data-section="review" onclick="ATELIER.show(\'review\')">04 · Підсумок</button></div>';
 html+='<section class="v3-panel active" data-section="look"><div class="v3-block"><span class="v3-eyebrow">01 · Спостерігай</span><h3>Зрозумій головну ідею</h3><p>'+esc(l[2])+'</p>';
 guide.theory.forEach(t=>{html+='<p class="v3-insight">'+esc(t)+'</p>'});
 html+='<div class="v3-observe"><strong>Подивися уважно</strong><p>'+esc(intro)+'</p></div></div><div class="v3-block"><span class="v3-eyebrow">Словник художника</span><h3>Що варто запам’ятати?</h3><p>'+esc(guide.remember)+'</p><button class="btn" onclick="ATELIER.show(\'explore\')">Розглянути приклади →</button></div>';
 html+=window.DEEP_UI.look(i);
 html+='</section>';
 html+='<section class="v3-panel" data-section="explore"><div class="v3-block"><span class="v3-eyebrow">02 · Досліджуй</span><h3>Порівняй два рішення</h3><p>Приклади не потрібно копіювати. Спробуй помітити, як форма, колір і простір змінюють відчуття від роботи.</p><div class="v3-gallery-grid"><div class="v3-diagram-card">'+window.artExample(i,0)+'<h4>Приклад А</h4><p>Що тут найпомітніше?</p></div><div class="v3-diagram-card">'+window.artExample(i,1)+'<h4>Приклад Б</h4><p>Що змінилося в другій роботі?</p></div></div><div class="v3-challenge"><b>Дослідницьке запитання</b><p>'+esc(intro)+'</p></div>';
 if(i===5||i===20)html+=colorLab();
 html+=window.DEEP_UI.explore(i);
 html+='<button class="btn" onclick="ATELIER.show(\'make\')">Перейти до творчості →</button></div></section>';
 html+='<section class="v3-panel" data-section="make"><div class="v3-section-heading"><div><span class="v3-eyebrow">03 · Творча майстерня</span><h2>Дві творчі роботи</h2><p>Крок за кроком — і місце для твоєї уяви</p></div></div>';
 html+=window.DEEP_UI.make(i);
 html+='<div class="v3-practice">'+taskCard(i,0)+taskCard(i,1)+'</div><div class="v3-callout"><b>Порада:</b> Почни з великих форм, перевір композицію, а потім додавай деталі. Ескіз можна змінювати.</div><button class="btn" onclick="ATELIER.show(\'review\')">До запитань →</button></section>';
 html+='<section class="v3-panel" data-section="review">';
 html+=window.DEEP_UI.review(i,data,saveFn);
 html+='<div class="v3-block"><span class="v3-eyebrow">04 · Розуміння й рефлексія</span><h3>Що ти зрозуміла?</h3><p>Обери відповіді на три питання. Помилки — частина навчання: після кожної спроби прочитай пояснення.</p><div id="quizHolder">'+quizHtml(i)+'</div></div><div class="v3-block"><span class="v3-eyebrow">Мій погляд</span><h3>Розкажи про свій вибір</h3><label for="lessonReflection">'+esc(window.ART_REFLECTION_PROMPTS[i])+'</label><textarea id="lessonReflection" rows="3" maxlength="2000" style="width:100%" placeholder="Що помітила? Що змінила б?">'+esc(data.reflections?.[i]||'')+'</textarea><p class="status" id="reflectionStatus"></p><button class="btn" onclick="artSaveReflection('+i+')">Зберегти думку</button></div><div class="v3-block">'+lessonSources(i)+'</div><div class="v3-block"><p>До уроку можна повертатися і покращувати власні роботи.</p><button class="btn" onclick="complete('+i+')">Завершити урок</button><button class="action alt" onclick="ATELIER.show(\'make\')">Ще помалювати</button></div></section>';
 return html;
}
function gallery(data,escapeFn){
 let h='<div class="v3-section-heading"><div><span class="v3-eyebrow">Моє портфоліо</span><h2>Галерея ідей</h2><p>'+data.works.length+' робіт · кожна — частина творчого шляху</p></div><button class="soft-button" onclick="openStudio(-1,0)">+ Нова робота</button></div>';
 if(!data.works.length)return h+'<div class="v3-block"><h3>Твій альбом починається тут</h3><p>Обери урок або відкрий майстерню, щоб створити першу роботу.</p><button class="btn" onclick="openStudio(-1,0)">Малювати →</button></div>';
 h+='<div class="v3-portfolio">';
 data.works.forEach((w,i)=>{h+='<div class="card"><img src="'+w.image+'" alt="Творча робота"><h4>'+escapeFn(w.name)+'</h4><p class="muted">'+escapeFn(w.date)+'</p><button class="action alt" onclick="downloadWork('+i+')">Завантажити JPG</button></div>'});
 return h+'</div>';
}
window.ATELIER={home,openUnit,start,show,lesson,gallery,modules,designArt};
})();