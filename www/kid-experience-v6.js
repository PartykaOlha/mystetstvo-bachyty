/* Вікторія DinLova 6 — адаптація мистецтвознавства для 3 класу */
(function(){
'use strict';
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eras=window.KID_EPOCHS||[],basics=window.KID_EPOCH_BASICS||{};
const plainData=window.KID_PLAIN||[],stories=window.KID_STORIES||[];
const narrative=window.KID_STORY_FOR_LESSON||[],correspondence=window.KID_EPOCH_FOR_LESSON||[];
let state=null,save=null;
function bind(d,saveFn){state=d;save=saveFn;state.eraQuiz=state.eraQuiz||{}}
function plain(i,k){
 const p=plainData[i]?.[k];
 if(!p)return '';
 return '<div class="kid-explanation"><div class="kid-explanation-label">ПОЯСНЕННЯ ПРОСТИМИ СЛОВАМИ</div><p>'+escape(p)+'</p></div>';
}
function story(i){
 const item=stories[narrative[i]];
 if(!item)return '';
 return '<section class="kid-story"><div class="kid-story-head"><span class="kid-story-icon">★</span><div><span class="kid-eyebrow">ЦІКАВА ІСТОРІЯ ПРО МИСТЕЦТВО</span><h3>'+escape(item.title)+'</h3><p>'+escape(item.who)+'</p></div></div><p class="kid-story-body">'+escape(item.text)+'</p><div class="kid-story-question"><b>Мистецький детектив</b><span>'+escape(item.question)+'</span></div><a target="_blank" rel="noopener noreferrer" href="'+escape(item.source)+'">Звідки ми це знаємо? Перевір джерело ↗</a></section>';
}
function lessonEra(i){
 const k=correspondence[i],e=eras.find(x=>x.key===k);
 if(!e)return '';
 return '<div class="kid-era-mini"><span class="kid-eyebrow">МАШИНА ЧАСУ</span><h3>Яка це доба?</h3><p><b>'+escape(e.name)+'</b> — '+escape(e.when)+'.</p><p>'+escape(e.simple)+'</p><button type="button" onclick="artNavigate(\'epochs\')">Відкрити часову стрічку мистецтва →</button><small>У цьому уроці наведено приклад періоду, пов’язаного з темою, а не єдину добу, у якій використовували прийом.</small></div>';
}
function home(){
 return '<section class="kid-home-entry"><span class="kid-eyebrow">НОВИЙ РОЗДІЛ ДЛЯ ТРЕТЬОКЛАСНИЦІ</span><div class="kid-home-layout"><div><h2>Подорож у часі: від печер до фотографії</h2><p>Що таке історична доба? Хто малював перші картини? Чому Ван Гог зобразив спальню тричі? Відкрий 15 коротких історичних зупинок та перевір себе.</p><button type="button" onclick="artNavigate(\'epochs\')">Мандрувати епохами →</button></div><div class="kid-home-mark" aria-hidden="true"><span>🏛️</span><span>🎨</span><span>📷</span></div></div></section>';
}
function epochCard(e,k){
 return '<details class="kid-era-card" id="epoch-'+escape(e.key)+'" style="--era-accent:'+e.color+'"><summary><span class="kid-era-no">'+String(k+1).padStart(2,'0')+'</span><span class="kid-era-icon">'+e.icon+'</span><span class="kid-era-name"><b>'+escape(e.name)+'</b><small>'+escape(e.when)+'</small></span><span class="kid-era-more">+</span></summary><div class="kid-era-open"><div><b>Пояснення для третього класу</b><p>'+escape(e.simple)+'</p></div><div><b>Уяви собі…</b><p>'+escape(e.special)+'</p></div><div><b>На що подивитися в мистецтві?</b><p>'+escape(e.look)+'</p></div><div class="kid-era-task"><b>Маленька творча місія</b><p>'+escape(e.mission)+'</p></div><a href="'+escape(e.source)+'" target="_blank" rel="noopener noreferrer">Музейне або освітнє джерело ↗</a></div></details>';
}
const quiz=[
{q:'Що означає «доба» в історії мистецтва?',opts:['Рівно один урок','Великий відрізок часу','Назву кольору'],correct:1,why:'Історична доба може тривати десятки чи сотні років.'},
{q:'Скільки років у столітті?',opts:['100','10','1000'],correct:0,why:'Одне століття дорівнює ста рокам.'},
{q:'Що майстри малювали ще до появи паперових альбомів?',opts:['Смартфони','Тварин і знаки на камені','Сучасні рекламні плакати'],correct:1,why:'У давнину використовували стіни печер і камені.'},
{q:'Яка доба особливо досліджувала перспективу та будову людини?',opts:['Відродження','Доба Едо','Первісне мистецтво'],correct:0,why:'Митці Відродження вивчали природу й способи зображати простір.'},
{q:'Де працював японський митець Хокусай?',opts:['У Давньому Римі','У Японії періоду Едо','У паризькій школі Баугауз'],correct:1,why:'«Велика хвиля» належить японському мистецтву періоду Едо.'},
{q:'Хто любив малювати швидкі враження від сонячного світла?',opts:['Імпресіоністи','Майстри кам’яного віку','Будівельники пірамід'],correct:0,why:'Імпресіоністи досліджували, як швидко змінюються колір і світло.'},
{q:'Де розвивалося українське мистецтво, зокрема мозаїки Софії Київської?',opts:['Лише у Франції','У Русі-Україні','У майбутньому'],correct:1,why:'Мозаїки і фрески були частиною культури Русі-України.'},
{q:'Чи могли дві різні художні доби існувати одночасно?',opts:['Так, у різних країнах і навіть в одній','Ні, ніколи','Тільки з появою фото'],correct:0,why:'Період Едо в Японії частково збігався з бароко в Європі.'}
];
function quizCard(i){
 const q=quiz[i],ans=state?.eraQuiz?.[i];
 return '<article class="kid-quiz-item"><span class="kid-quiz-num">Запитання '+(i+1)+'/8</span><h4>'+escape(q.q)+'</h4><div class="kid-quiz-options">'+q.opts.map((op,k)=>'<button type="button" data-quiz="'+i+'" data-answer="'+k+'" aria-pressed="'+(ans===k?'true':'false')+'" onclick="KID_ART.answer('+i+','+k+')">'+escape(op)+'</button>').join('')+'</div><p id="kid-quiz-status-'+i+'" class="kid-quiz-feedback" role="status">'+(Number.isInteger(ans)?(ans===q.correct?'Правильно! ':'Подумай ще. ')+escape(q.why):'Спробуй знайти відповідь у часовій стрічці.')+'</p></article>';
}
function timeline(){
 return '<div class="kid-timeline-page"><div class="page-top"><button type="button" class="v3-back" onclick="artNavigate(\'lessons\')">← До уроків</button><span class="kid-eyebrow">ДИТЯЧА ЕНЦИКЛОПЕДІЯ</span></div><div class="kid-timeline-hero"><span>15 зупинок у минулому</span><h1>Часова стрічка мистецтва</h1><p>Подивімося, як змінювалися художні ідеї в різних куточках світу. Натискай на назву кожної доби — відкриється її історія.</p></div><section class="kid-basics"><h2>'+escape(basics.term)+'</h2><p>'+escape(basics.simple)+'</p><div class="kid-basic-example"><b>Уяви собі</b><p>'+escape(basics.example)+'</p></div><div class="kid-basic-row"><div><b>Що таке століття?</b><p>'+escape(basics.century)+'</p></div><div><b>Що таке «до нашої ери»?</b><p>'+escape(basics.before)+'</p></div></div><div class="kid-basic-warning"><b>Важлива підказка!</b><p>'+escape(basics.important)+'</p></div></section><section class="kid-timeline-list"><div class="kid-section-heading"><span>ВІД ДАВНИНИ ДО НАШИХ ДНІВ</span><h2>Відкрий мистецькі епохи</h2><p>Дати приблизні. Серед зупинок є й українське мистецтво.</p></div>'+eras.map(epochCard).join('')+'</section><section class="kid-quiz"><span class="kid-eyebrow">ПЕРЕВІР СВОЮ ПОДОРОЖ</span><h2>Історичний арт-квест</h2><p>Відповідай у своєму темпі. Помилки допомагають запам’ятати нове.</p>'+quiz.map((_,i)=>quizCard(i)).join('')+'</section></div>';
}
function answer(i,k){
 if(!state||!save)return;
 state.eraQuiz[i]=k;
 save();
 const q=quiz[i];const p=document.getElementById('kid-quiz-status-'+i);
 if(p)p.textContent=(k===q.correct?'Правильно! ':'Можна спробувати ще. ')+q.why;
 for(const b of document.querySelectorAll('[data-quiz="'+i+'"]'))b.setAttribute('aria-pressed',String(Number(b.dataset.answer)===k));
}
window.KID_ART={plain,story,lessonEra,home,timeline,answer,bind,eras,stories,quiz};
})();