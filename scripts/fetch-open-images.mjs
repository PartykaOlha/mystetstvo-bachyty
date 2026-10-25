import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {setTimeout as pause} from 'node:timers/promises';
/** All files below have individually reviewed Wikimedia Commons pages declaring them public domain.
 * Capture and reuse of two-dimensional public-domain works follows Commons PD-Art policies.
 */
const files=[
 {key:'wave',file:'The Great Wave at Kanagawa.jpg',title:'Велика хвиля біля Канаґави',artist:'Кацусіка Хокусай',type:'painting',museum:'Musée Guimet'},
 {key:'bedroom',file:'Vincent van Gogh - The Bedroom - Google Art Project.jpg',title:'Спальня',artist:'Вінсент ван Гог',type:'painting',museum:'Art Institute of Chicago'},
 {key:'grande-jatte',file:'Georges Seurat, Study for "La Grande Jatte", 1884-1885, NGA 52225.jpg',title:'Ескіз до «Гранд-Жатт»',artist:'Жорж Сера',type:'painting',museum:'National Gallery of Art'},
 {key:'paris-rain',file:'Caillebotte Rue de Paris.jpg',title:'Паризька вулиця. Дощовий день',artist:'Ґюстав Кайботт',type:'painting',museum:'Art Institute of Chicago'},
 {key:'flatiron',file:'Stieglitz Flat iron 1903.jpg',title:'Флетайрон, Нью-Йорк',artist:'Альфред Стіґліц',type:'photograph',museum:'Wikimedia Commons'},
 {key:'steerage',file:'The Steerage 1907 Stieglitz.jpg',title:'Третій клас',artist:'Альфред Стіґліц',type:'photograph',museum:'Wikimedia Commons'},
 {key:'migrant',file:'Migrant Mother 1936 3.jpg',title:'Мати-мігрантка',artist:'Доротея Ланж',type:'photograph',museum:'Library of Congress'},
 {key:'migrant-series',file:'Migrant Mother 1936 2.jpg',title:'Кадр із серії «Мати-мігрантка»',artist:'Доротея Ланж',type:'photograph',museum:'Library of Congress'},
 {key:'stieglitz-detail',file:'Alfred Stieglitz - The Steerage - Google Art Project.jpg',title:'«Третій клас»: музейний відбиток',artist:'Альфред Стіґліц',type:'photograph',museum:'Google Art Project / museum archive'}
];
function direct(file,width){
 const normalized=file.replace(/ /g,'_'),hash=createHash('md5').update(normalized).digest('hex');
 const name=encodeURIComponent(normalized);
 const root='https://upload.wikimedia.org/wikipedia/commons/';
 return width?root+'thumb/'+hash[0]+'/'+hash.slice(0,2)+'/'+name+'/'+width+'px-'+name:root+hash[0]+'/'+hash.slice(0,2)+'/'+name;
}
async function take(url){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),23000);
 try{
  const r=await fetch(url,{signal:controller.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; DinLovaEducationalApp/5.0)','Accept':'image/jpeg,image/*;q=0.9,*/*;q=0.1'}});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const buffer=Buffer.from(await r.arrayBuffer());
  if(buffer.length<6500||buffer[0]!==255||buffer[1]!==216)throw Error('Invalid JPEG');
  return buffer;
 }finally{clearTimeout(timeout)}
}
await mkdir('www/media/open-art',{recursive:true});
const works=[];
for(const x of files){
 const options=[direct(x.file,600),direct(x.file,480),direct(x.file),'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(x.file)+'?width=600'];
 let body=null,reason='';
 for(const url of options){
  try{body=await take(url);break}catch(e){reason=String(e);await pause(450)}
 }
 if(!body){console.warn('MISSING',x.key,reason);continue}
 const optimized=await sharp(body,{limitInputPixels:80000000}).rotate().resize(960,960,{fit:'inside',withoutEnlargement:true}).jpeg({quality:81,mozjpeg:true}).toBuffer();
 if(optimized.length>6500&&optimized.length<body.length)body=optimized;
 await writeFile('www/media/open-art/'+x.key+'.jpg',body);
 const source='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(x.file.replaceAll(' ','_'));
 works.push({key:x.key,file:'media/open-art/'+x.key+'.jpg',title:x.title,artist:x.artist,type:x.type,source,museum:x.museum,license:'Public Domain / CC0',bytes:body.length});
 console.log('SUCCESS',x.key,body.length,'bytes');await pause(1200);
}
if(works.filter(x=>x.type==='painting').length<3||works.filter(x=>x.type==='photograph').length<2)throw Error('Failed to embed minimum 3 open artworks and 2 real photographs.');
await writeFile('www/open-art-data.js','window.OPEN_ART_DATA='+JSON.stringify(works)+';\n');
console.log('Verified offline public-domain works:',works.length,'Photos:',works.filter(x=>x.type==='photograph').length);
