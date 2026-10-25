import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';

/** Art Institute of Chicago: CC0 open-access artwork images only. This script is run in CI
 * before Capacitor synchronizes www into its offline Android assets.
 * https://api.artic.edu/docs/#copyright and https://www.artic.edu/open-access
 */
const items=[
 {key:'wave',id:24645,title:'Велика хвиля біля Канаґави',artist:'Кацусіка Хокусай',type:'painting'},
 {key:'bedroom',id:28560,title:'Спальня',artist:'Вінсент ван Гог',type:'painting'},
 {key:'grande-jatte',id:27992,title:'Недільний день на острові Гранд-Жатт',artist:'Жорж Сера',type:'painting'},
 {key:'paris-rain',id:20684,title:'Паризька вулиця. Дощовий день',artist:'Ґюстав Кайботт',type:'painting'},
 {key:'water-lilies',query:'Water Lilies',artistCheck:'Claude Monet',title:'Водяні лілії',artist:'Клод Моне',type:'painting'},
 {key:'child-bath',query:"The Child's Bath",artistCheck:'Mary Cassatt',title:'Купання дитини',artist:'Мері Кассат',type:'painting'},
 {key:'flatiron',query:'The Flatiron',artistCheck:'Alfred Stieglitz',title:'Флетайрон, Нью-Йорк',artist:'Альфред Стіґліц',type:'photograph'},
 {key:'steerage',query:'The Steerage',artistCheck:'Alfred Stieglitz',title:'Третій клас',artist:'Альфред Стіґліц',type:'photograph'},
 {key:'hand-man',query:'The Hand of Man',artistCheck:'Alfred Stieglitz',title:'Рука людини',artist:'Альфред Стіґліц',type:'photograph'},
 {key:'sunlight',query:'Sunlight',artistCheck:'Clarence H. White',title:'Сонячне світло',artist:'Кларенс Г. Вайт',type:'photograph'},
 {key:'venice',query:'A Venetian Canal',artistCheck:'Alfred Stieglitz',title:'Венеційський канал',artist:'Альфред Стіґліц',type:'photograph'}
];
const API='https://api.artic.edu/api/v1/artworks';
async function fetchRetry(url,tries=3){
 let last;
 for(let i=0;i<tries;i++){
  try {const r=await fetch(url,{headers:{Accept:'application/json,image/jpeg;q=0.9,*/*;q=0.5','User-Agent':'DinLova-OpenEducation/1.0 (github.com/PartykaOlha/mystetstvo-bachyty)'},signal:AbortSignal.timeout(25000)});
   if(!r.ok)throw new Error('HTTP '+r.status);
   return r;
  }catch(e){last=e;await pause(700*(i+1))}
 }
 throw last;
}
async function metadata(x){
 if(x.id)return (await (await fetchRetry(API+'/'+x.id)).json()).data;
 const q=new URL(API+'/search');q.searchParams.set('q',x.query);
 q.searchParams.set('fields','id,title,artist_display,is_public_domain,image_id');
 q.searchParams.set('limit','20');
 const j=await (await fetchRetry(q)).json();
 const candidates=(j.data||[]).filter(a=>a.image_id&&a.is_public_domain===true&&String(a.artist_display||'').toLowerCase().includes(x.artistCheck.toLowerCase()));
 return candidates.find(a=>a.title.toLowerCase()===x.query.toLowerCase())||candidates.find(a=>a.title.toLowerCase().includes(x.query.toLowerCase()))||candidates[0]||null;
}
await mkdir('www/media/open-art',{recursive:true});
const delivered=[];
for(const x of items){
 try{
  const info=await metadata(x);
  if(!info||info.is_public_domain!==true||!info.image_id)throw Error('not verified as public-domain or missing image');
  const url='https://www.artic.edu/iiif/2/'+info.image_id+'/full/600,/0/default.jpg';
  const response=await fetchRetry(url);
  const bin=Buffer.from(await response.arrayBuffer());
  if(bin.length<6000||bin[0]!==0xFF||bin[1]!==0xD8)throw Error('invalid JPEG bytes');
  await writeFile(join('www/media/open-art',x.key+'.jpg'),bin);
  delivered.push({key:x.key,file:'media/open-art/'+x.key+'.jpg',id:info.id,title:x.title,originalTitle:info.title,artist:x.artist,type:x.type,source:'https://www.artic.edu/artworks/'+info.id,license:'Public Domain / CC0',bytes:bin.length});
  console.log('OPEN ART:',x.key,info.id,bin.length,'bytes');
 }catch(err){
  console.warn('UNAVAILABLE:',x.key,String(err));
 }
 await pause(1100);
}
if(delivered.filter(x=>x.type==='painting').length<4)throw Error('Not enough verified public-domain paintings for offline lessons.');
if(delivered.filter(x=>x.type==='photograph').length<2)throw Error('Not enough verified public-domain photographic works. Refusing an art app without photos.');
await writeFile('www/open-art-data.js','window.OPEN_ART_DATA='+JSON.stringify(delivered)+';\n');
console.log('Offline museum artworks:',delivered.length,'including photographs',delivered.filter(x=>x.type==='photograph').length);
