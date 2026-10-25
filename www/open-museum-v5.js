/* DinLova 5 — відкриті музейні зображення, аналіз мистецтва, фото-місії */
(function(){
'use strict';
const clean=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalogue=window.OPEN_ART_DATA||[];
const byKey=k=>catalogue.find(x=>x.key===k);
const map=[
 ['wave','paris-rain'],['paris-rain','bedroom'],['grande-jatte','wave'],['wave','grande-jatte'],
 ['grande-jatte','paris-rain'],['bedroom','water-lilies'],['bedroom','paris-rain'],['grande-jatte','wave'],
 ['flatiron','steerage'],['steerage','hand-man'],['sunlight','flatiron'],['flatiron','paris-rain'],
 ['flatiron','steerage'],['sunlight','bedroom'],['steerage','paris-rain'],['venice','steerage'],
 ['wave','grande-jatte'],['bedroom','paris-rain'],['grande-jatte','wave'],['bedroom','water-lilies'],
 ['water-lilies','bedroom'],['child-bath','grande-jatte'],['wave','paris-rain'],['sunlight','hand-man'],
 ['bedroom','paris-rain'],['venice','steerage'],['child-bath','bedroom'],['steerage','wave']
];
const observations=[
 'Де головний рух? Знайди найпомітнішу форму і три менші деталі.',
 'Уяви лінії сходження: які частини будівель і вулиці ведуть око вдалину?',
 'Як художник залишив тільки найважливіші ознаки героїв?',
 'Як накладання форм та повтори створюють ритм?',
 'Де автор розташував головну групу людей і що робить фон?',
 'Які два кольори найбільш контрастні? Чи змінює колір характер кімнати?',
 'Звідки падає світло? Познач три світлі й три темні зони.',
 'Покажи повторювані дрібні плями кольору. Що виникає, коли відступити?',
 'Які лінії спрямовують погляд до архітектури? Який у фото передній план?',
 'Як фотограф зберіг у кадрі історію багатьох людей?',
 'Де на чорно-білому фото збереглися деталі в тінях?',
 'Порівняй високу й низьку точку зйомки. Що було б, якби камера стояла інакше?',
 'Який елемент потрапляє на перетин уявних ліній третин?',
 'Чи видно світловий акцент на предметі? Де найкращий фон?',
 'Спробуй закрити пальцем один край кадру. Що змінилося в історії?',
 'Чому цей кадр пасує до теми виставки? Яким мав би бути наступний?',
 'Які великі геометричні форми можна знайти у композиції?',
 'Уяви вісь рівноваги: чи однаково важкі обидві частини?',
 'Де художник залишив спокійний порожній простір?',
 'Придумай заголовок до зображення: де його краще розташувати?',
 'Які три головні відтінки ти вибрала б із цієї роботи?',
 'Які улюблені повторювані прийоми автора ти можеш помітити?',
 'Які штрихи або лінії найвиразніше передають рух?',
 'Яку фактуру можна відтворити пензлем, а яку короткими штрихами?',
 'Як міг виглядати перший композиційний ескіз перед цією картиною?',
 'Як би ти домалювала фантастичного героя, щоб він пасував до освітлення?',
 'Які риси обличчя та поза розповідають про настрій?',
 'Чи можна перетворити цю композицію на історію з чотирьох кадрів?'
];
const missions=[
 ['Знайди стародавні силуети','Сфотографуй три побутові предмети так, щоб за їхніми тінями можна було впізнати форму.','Знайди світлу стіну або простирадло.','Постав предмети між джерелом світла й фоном.','Створи кадр, на якому впізнається хоча б два силуети.'],
 ['Дорога вдалину','Знайди доріжку, коридор або ряд полиць, лінії яких спрямовані вдалину.','Стань так, щоб чітко було видно обидва краї.','Зроби кадр із горизонтом посередині.','Спробуй другий кадр нижче й вибери виразніший.'],
 ['Знаки навколо нас','Знайди три піктограми вдома або на вулиці та зроби один зрозумілий кадр.','Вибери знак без імен чи адрес.','Сфотографуй його прямо, без спотворення.','Перевір, чи можна зрозуміти значення без підпису.'],
 ['Геометрія в місті','Знайди коло, трикутник і прямокутник у реальних предметах.','Озирнися на двері, сходи, вікна, іграшки.','Знайди три форми в одному кадрі.','Зміни ракурс і зроби композицію цікавішою.'],
 ['Головний герой','Створи фото, на якому головний предмет помітно з першого погляду.','Обери один яскравий предмет.','Прибери з фону те, що відволікає.','Зроби другий кадр із іншим розташуванням героя.'],
 ['Палітра природи','Знайди три кольори поруч у природі або кімнаті.','Обери сюжет із трьома близькими чи контрастними кольорами.','Зроби фото без цифрового фільтра.','Запиши, який колір головний і який допоміжний.'],
 ['Звідки світло?','Зніми один предмет біля вікна за бокового освітлення.','Постав м’яку іграшку біля вікна.','Знайди найсвітлішу та найтемнішу ділянку.','Зроби фото та поясни напрям світла.'],
 ['Знайди візуальний ритм','Сфотографуй повторювані предмети: книги, плитку, олівці або сходи.','Знайди щонайменше п’ять повторів.','Побудуй кадр так, щоб було видно інтервали.','Перемісти один предмет і порівняй ритм.'],
 ['Світло малює','Зніми тінь від вікна або від предмета на світлій стіні.','Обери денне світло.','Знайди цікаву форму тіні.','Сфотографуй тінь крупно та разом із предметом.'],
 ['Історія із трьох фото','Розкажи історію іграшки в трьох фотографіях.','Продумай початок, зміну й завершення.','Зніми три послідовні фото.','Збережи найвиразніший кадр у портфоліо.'],
 ['Світліше чи темніше?','Зроби кадри одного предмета з різною експозицією.','Не змінюй ракурс і розташування.','Якщо камера дозволяє, змінюй яскравість після дотику до екрана.','Обери кадр зі збереженими деталями.'],
 ['Три ракурси','Зніми іграшку згори, на рівні очей і трохи знизу.','Використовуй той самий фон.','Зроби три окремі знімки.','Вибери кадр, який найкраще передає характер героя.'],
 ['Сітка 3×3','Зроби два фото: головний предмет по центру і збоку кадру.','Увімкни сітку на камері, якщо вона є.','Не змінюй масштаб.','Порівняй, де сюжет виразніший.'],
 ['Натюрморт біля вікна','Зніми композицію з трьох домашніх предметів.','Обери предмети різної висоти.','Розташуй їх біля вікна.','Зроби фото з перекриванням і простим фоном.'],
 ['Одна сцена — два кадри','Зніми загальний вигляд і крупний план одного сюжету.','Спочатку зніми сюжет із оточенням.','Потім наблизься до цікавої деталі.','Зроби висновок, що глядач втрачає при кадруванні.'],
 ['Моя фотоколекція','Створи серію із чотирьох фото на тему «Один колір».','Обери колір, який легко знайти вдома.','Зніми чотири різні предмети.','Вибери один кадр для обкладинки серії.'],
 ['Форми розповідають','Знайди незвичну форму предмета й створи з неї виразний фотоплакат.','Знайди форму з цікавим силуетом.','Зніми на контрастному тлі.','Залиш місце для майбутнього заголовка.'],
 ['Симетрія й асиметрія','Створи два кадри з одних предметів: симетричний і асиметричний.','Розташуй предмети дзеркально.','Зроби перший кадр.','Пересунь один предмет і віднови рівновагу без дзеркала.'],
 ['Магія порожнього простору','Зніми маленький предмет серед великої вільної поверхні.','Обери спокійний фон.','Постав предмет не посередині.','Знайди кадр із найбільш виразною паузою.'],
 ['Фото для обкладинки','Створи фото з вільним місцем для заголовка книжки.','Знайди сюжет для вигаданої історії.','Залиш не менше третини кадру спокійним тлом.','Уяви, де помістиш назву.'],
 ['Знайди палітру','Зроби кадр лише з трьома помітними кольорами.','Прибери зайві яскраві предмети.','Зніми палітру в природному світлі.','Запиши основний, додатковий і акцентний колір.'],
 ['Фото мого стилю','Зніми три об’єкти, що найбільше тобі подобаються за кольором або формою.','Вибери спільну ідею.','Зроби три фото.','Обери одне як обкладинку власного портфоліо.'],
 ['Сліди ліній','Знайди лінії у світі: дроти, гілки, доріжки чи орнамент.','Подивись, чи вони прямі, хвилясті або ламані.','Зніми найцікавіші лінії крупно.','Спробуй повторити їх стилусом.'],
 ['Музей фактур','Зніми три матеріали: тканину, дерево, камінь або метал.','Підійди достатньо близько.','Стеж, щоб фактура була у фокусі.','Вибери найвиразнішу текстуру для малювання.'],
 ['Фотографія як ескіз','Створи фото для майбутнього малюнка без зайвих деталей.','Обери об’єкт із простим силуетом.','Зроби два ракурси.','Обери той, із якого буде легше почати ескіз.'],
 ['Фото + малюнок','Сфотографуй дерево, квітку або іграшку для творчого колажу.','Обери власне фото.','Залиш місце, де з’явиться фантастична деталь.','Імпортуй фото в майстерню та домалюй героя.'],
 ['Емоція в предметі','Сфотографуй іграшку так, щоб ракурс і світло передали настрій.','Обери тихий або веселий настрій.','Зміни освітлення чи кут камери.','Зроби кадр і поясни, як з’явилася емоція.'],
 ['Чотирикадрова пригода','Створи мінікомікс із чотирьох фото з іграшкою.','Придумай зав’язку й проблему.','Зроби чотири фотографії різних подій.','Вибери найвиразніший кадр та домалюй підпис у майстерні.']
];
let currentData=null,saveData=null;
function bind(data,save){currentData=data;saveData=save;data.photoMissions=data.photoMissions||{};}
function photosFor(i){
 const group=map[i]||['wave'];let selected=group.map(byKey).filter(Boolean);
 if(!selected.length){const prefer=i>=8&&i<=15?'photograph':'painting';selected=catalogue.filter(x=>x.type===prefer).slice(0,2)}
 return selected;
}
function cover(k){const list=[['wave','paris-rain'],['grande-jatte','bedroom'],['flatiron','steerage'],['sunlight','venice'],['paris-rain','wave'],['bedroom','grande-jatte'],['wave','child-bath']];return (list[k]||[]).map(byKey).find(Boolean)||catalogue[k%Math.max(1,catalogue.length)]}
function image(work,cls='open-card-img'){
 return '<img src="'+clean(work.file)+'" class="'+cls+'" alt="'+clean(work.title+' — '+work.artist)+'" loading="lazy" decoding="async" onclick="ART_PHOTOS.preview('+JSON.stringify(work.key).replaceAll('"','&quot;')+')" />';
}
function analyse(i){
 const works=photosFor(i);const p=observations[i];
 if(!works.length)return '<div class="museum-empty">Музейні ілюстрації тимчасово недоступні. Навчальний зміст і вправи залишаються доступними.</div>';
 return '<div class="open-museum-section"><div class="open-heading"><span class="open-eyebrow">Справжні твори · музейна галерея</span><h3>Навчись читати зображення</h3><p>Тут не намальовані умовні картинки: це репродукції реальних творів та історичні фотографії з відкритої музейної колекції.</p></div><div class="open-gallery-grid">'+works.map(w=>'<article class="open-work"><div class="open-work-media">'+image(w)+'</div><div class="open-work-caption"><span class="open-type">'+(w.type==='photograph'?'ІСТОРИЧНА ФОТОГРАФІЯ':'ТВІР МИСТЕЦТВА')+'</span><h4>'+clean(w.title)+'</h4><p>'+clean(w.artist)+'</p><a target="_blank" rel="noopener noreferrer" href="'+clean(w.source)+'">Перевірити оригінал у музеї ↗</a><small>Art Institute of Chicago · Public Domain / CC0</small></div></article>').join('')+'</div><div class="open-questions"><h4>Подивись уважно</h4><p>'+clean(p)+'</p><p>Що видно точно, а що є твоїм припущенням? Знайди докази на самому зображенні.</p></div></div>';
}
function mission(i){
 const m=missions[i];if(!m)return '';
 const saved=currentData?.photoMissions?.[i];
 return '<section class="photo-mission"><div class="photo-mission-top"><span class="open-eyebrow">ФОТОМІСІЯ № '+String(i+1).padStart(2,'0')+'</span><span class="mission-tag">10–20 хв · власна камера</span></div><h3>'+clean(m[0])+'</h3><p class="photo-mission-lead">'+clean(m[1])+'</p><ol class="photo-mission-steps">'+m.slice(2).map(s=>'<li>'+clean(s)+'</li>').join('')+'</ol><div class="photo-mission-actions"><label class="photo-camera">📷 Зняти або вибрати фото<input type="file" accept="image/*" capture="environment" onchange="ART_PHOTOS.capture('+i+',this)" aria-label="Зняти чи додати фото"></label><button class="photo-soft-action" onclick="openStudio('+i+',0)">Намалювати за фото →</button></div><div id="missionPreview-'+i+'" class="mission-preview">'+(saved?'<img src="'+saved.image+'" alt="Власне фото до місії"><p>Фото збережено у портфоліо · '+clean(saved.date)+'</p>':'<p class="photo-prompt">Власне фото після зйомки з’явиться тут і в твоїй галереї.</p>')+'</div><p class="photo-status" id="photoStatus-'+i+'"></p></section>';
}
function home(){let featured=['wave','bedroom','flatiron','grande-jatte','steerage','paris-rain'].map(byKey).filter(Boolean);
 if(featured.length<3)featured=catalogue.slice(0,6);
 return '<section class="open-home-section"><div class="open-home-head"><div><span class="open-eyebrow">СПРАВЖНІ ШЕДЕВРИ</span><h2>Галерея натхнення</h2><p>Реальні картини та історичні фотографії. Відкрий і роздивись уважно.</p></div></div><div class="open-home-strip">'+featured.map(w=>'<button class="open-home-tile" type="button" onclick="ART_PHOTOS.preview('+JSON.stringify(w.key).replaceAll('"','&quot;')+')"><img src="'+clean(w.file)+'" alt="'+clean(w.title)+'" loading="lazy"><b>'+clean(w.title)+'</b><small>'+clean(w.artist)+'</small></button>').join('')+'</div></section>'+
 '<section class="photo-missions-home"><span class="open-eyebrow">ВИХОДЬ ДОСЛІДЖУВАТИ</span><h2>Фотоекспедиції</h2><p>Не просто слухай теорію: знайди сюжет у житті, сфотографуй і додай у своє портфоліо.</p><div class="photo-mission-teasers">'+[4,5,11,13,17,22].map(i=>'<button onclick="lesson('+i+');ATELIER.show(\'make\')"><span>МІСІЯ '+String(i+1).padStart(2,'0')+'</span><strong>'+clean(missions[i][0])+'</strong><small>Відкрити практику ↗</small></button>').join('')+'</div></section>';
}
function preview(key){
 const w=byKey(key);if(!w)return;
 const old=document.getElementById('openMuseumViewer');if(old)old.remove();
 const el=document.createElement('div');el.id='openMuseumViewer';el.className='open-viewer';
 el.innerHTML='<div class="open-viewer-inner"><button onclick="document.getElementById(\'openMuseumViewer\').remove()" class="open-viewer-close" aria-label="Закрити фото">✕ Закрити</button>'+image({...w,file:w.file},'open-viewer-img')+'<div><h3>'+clean(w.title)+'</h3><p>'+clean(w.artist)+' · Art Institute of Chicago · Public Domain</p><p>Торкнися зображення двома пальцями, щоб збільшити його стандартним жестом перегляду, або розглядай деталі на планшеті.</p></div></div>';
 el.onclick=e=>{if(e.target===el)el.remove()};document.body.appendChild(el);
}
function capture(i,input){
 const f=input.files?.[0];if(!f)return;const status=document.getElementById('photoStatus-'+i);
 if(!/^image\//.test(f.type)){if(status)status.textContent='Це не файл зображення.';return}
 if(f.size>25*1024*1024){if(status)status.textContent='Файл надто великий. Обери фото до 25 МБ.';return}
 if(status)status.textContent='Обробляю фото…';
 const reader=new FileReader();reader.onerror=()=>{if(status)status.textContent='Не вдалося прочитати фото.'};
 reader.onload=()=>{const img=new Image();img.onerror=()=>{if(status)status.textContent='Непідтримуваний формат фото.'};
 img.onload=()=>{const can=document.createElement('canvas');const k=Math.min(1,820/Math.max(img.width,img.height));can.width=Math.max(1,Math.round(img.width*k));can.height=Math.max(1,Math.round(img.height*k));can.getContext('2d').drawImage(img,0,0,can.width,can.height);
 const encoded=can.toDataURL('image/jpeg',0.62);const date=new Date().toLocaleDateString('uk-UA'),m=missions[i];
 const imageRec={image:encoded,date,title:m[0]};
 const oldMission=currentData.photoMissions[i],oldWorkIndex=currentData.works.findIndex(w=>w.kind==='photo-mission'&&Number(w.lesson)===i);
 const oldWork=oldWorkIndex>=0?currentData.works[oldWorkIndex]:null;
 currentData.photoMissions[i]=imageRec;
 const newWork={name:'Фотомісія: '+m[0],image:encoded,date,kind:'photo-mission',lesson:i};
 if(oldWorkIndex>=0)currentData.works[oldWorkIndex]=newWork;else currentData.works.unshift(newWork);
 try{saveData()}catch(err){
  if(oldMission)currentData.photoMissions[i]=oldMission;else delete currentData.photoMissions[i];
  const ix=currentData.works.indexOf(newWork);if(ix>=0){if(oldWork)currentData.works[ix]=oldWork;else currentData.works.splice(ix,1)}
  if(status)status.textContent='Не вистачає пам’яті. Видали непотрібні файли або збережи резервну копію.';
  return;
 }
 const box=document.getElementById('missionPreview-'+i);if(box)box.innerHTML='<img alt="Збережене фото" src="'+encoded+'"><p>Фото є у творчій галереї · '+date+'</p>';
 if(status)status.textContent='Фото збережено. Тепер можеш домалювати деталі стилусом.';
 };
 img.src=reader.result;
 };
 reader.readAsDataURL(f);input.value='';
}
window.ART_PHOTOS={bind,analyse,mission,home,cover,preview,capture,missions,works:catalogue};
})();