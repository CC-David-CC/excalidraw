// Inspect dimensions without asking the browser to allocate a decoded bitmap.
// File headers are untrusted; the browser still validates full image contents.
export const MAX_IMAGE_PIXELS=40_000_000;
export const MAX_DRAWING_PIXELS=80_000_000;
export const MAX_DRAWING_IMAGES=256;
const HEADER_LIMIT=1024*1024;
const failed=()=>{throw Error('Image dimensions could not be safely checked. The current drawing is unchanged.');};
const ascii=(b,p,n)=>String.fromCharCode(...b.subarray(p,p+n));
const u16=(b,p,le=false)=>le?b[p]+b[p+1]*256:b[p]*256+b[p+1];
const u24=(b,p)=>b[p]+b[p+1]*256+b[p+2]*65536;
const u32=(b,p,le=false)=>le?(b[p]+b[p+1]*256+b[p+2]*65536+b[p+3]*16777216):(b[p]*16777216+b[p+1]*65536+b[p+2]*256+b[p+3]);
export function imageDimensions(b,mime){
 let width,height;
 if(mime==='image/png'&&b.length>=24&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v)&&ascii(b,12,4)==='IHDR'){width=u32(b,16);height=u32(b,20);}
 else if(mime==='image/jpeg'&&b[0]===255&&b[1]===216){let p=2;while(p+4<=b.length){if(b[p++]!==255)failed();while(b[p]===255)p++;const marker=b[p++];if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=215))continue;if(p+2>b.length)break;const len=u16(b,p);if(len<2||p+len>b.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){if(len<7)break;height=u16(b,p+3);width=u16(b,p+5);break;}p+=len;}}
 else if(mime==='image/webp'&&b.length>=30&&ascii(b,0,4)==='RIFF'&&ascii(b,8,4)==='WEBP'){let p=12;while(p+8<=b.length){const tag=ascii(b,p,4),len=u32(b,p+4,true),d=p+8;if(tag==='VP8X'&&len>=10&&d+10<=b.length){width=1+u24(b,d+4);height=1+u24(b,d+7);break;}if(tag==='VP8L'&&len>=5&&d+5<=b.length&&b[d]===47){width=1+b[d+1]+((b[d+2]&63)<<8);height=1+(b[d+2]>>6)+(b[d+3]<<2)+((b[d+4]&15)<<10);break;}if(tag==='VP8 '&&len>=10&&d+10<=b.length&&b[d+3]===157&&b[d+4]===1&&b[d+5]===42){width=u16(b,d+6,true)&16383;height=u16(b,d+8,true)&16383;break;}if(len>b.length-d)break;p=d+len+(len%2);}}
 if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1)failed();
 if(width*height>MAX_IMAGE_PIXELS)throw Error('An image exceeds the 40 megapixel limit. The current drawing is unchanged.');
 if(mime==='image/png'){let p=8,found=false;while(p+12<=b.length){const n=u32(b,p),tag=ascii(b,p+4,4);if(tag==='acTL')throw Error('Animated PNG images cannot be safely opened. The current drawing is unchanged.');if(tag==='IDAT'){found=true;break;}if(n>b.length-p-12)break;p+=12+n;}if(!found)failed();}
 if(mime==='image/webp'&&ascii(b,12,4)==='VP8X'&&(b[20]&2))throw Error('Animated WebP images cannot be safely opened. The current drawing is unchanged.');
 return {width,height,pixels:width*height};
}
function gifDimensions(b){
 if(b.length<13||!['GIF87a','GIF89a'].includes(ascii(b,0,6)))failed();const screen=u16(b,6,true)*u16(b,8,true);let p=13+(b[10]&128?3*(1<<((b[10]&7)+1)):0),frames=0,pixels=screen;
 const blocks=()=>{while(p<b.length){const n=b[p++];if(!n)return;if(p+n>b.length)failed();p+=n;}failed();};
 while(p<b.length){const tag=b[p++];if(tag===59){if(!frames)failed();if(pixels>MAX_IMAGE_PIXELS)throw Error('An image exceeds the 40 megapixel limit. The current drawing is unchanged.');return {pixels};}if(tag===33){if(p>=b.length)failed();p++;blocks();continue;}if(tag!==44||p+9>b.length)failed();const w=u16(b,p+4,true),h=u16(b,p+6,true),packed=b[p+8];p+=9;if(!w||!h)failed();pixels+=w*h;frames++;if(pixels>MAX_IMAGE_PIXELS)throw Error('An image exceeds the 40 megapixel limit. The current drawing is unchanged.');if(packed&128)p+=3*(1<<((packed&7)+1));if(p>=b.length)failed();p++;blocks();}failed();
}
function svgDimensions(text){
 if(text.length>1048576||/<!DOCTYPE|<!ENTITY/i.test(text)||typeof DOMParser==='undefined')failed();const doc=new DOMParser().parseFromString(text,'image/svg+xml'),root=doc.documentElement;if(root?.localName!=='svg'||doc.querySelector('parsererror, image, feImage, foreignObject'))failed();
 const view=(root.getAttribute('viewBox')||'').trim().split(/[ ,]+/).map(Number),length=(v)=>{const m=/^\s*(\d+(?:\.\d+)?)(px|in|cm|mm|pt|pc)?\s*$/i.exec(v||'');return m?Number(m[1])*({px:1,in:96,cm:96/2.54,mm:96/25.4,pt:96/72,pc:16}[(m[2]||'px').toLowerCase()]):null;};let width=length(root.getAttribute('width')),height=length(root.getAttribute('height'));if(!width||!height){if(view.length===4&&view.every(Number.isFinite)&&view[2]>0&&view[3]>0){width=width||view[2];height=height||view[3];}else if(!root.hasAttribute('width')&&!root.hasAttribute('height')){width=300;height=150;}else failed();}if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)failed();if(width*height>MAX_IMAGE_PIXELS)throw Error('An image exceeds the 40 megapixel limit. The current drawing is unchanged.');return {pixels:Math.ceil(width*height)};
}
// Keep inserted SVGs self-contained and static; they remain embedded as images.
export function svgInsertionDimensions(bytes){
 if(bytes.byteLength>1024*1024)failed();let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{failed();}const dimensions=svgDimensions(text),doc=new DOMParser().parseFromString(text,'image/svg+xml'),elements=[doc.documentElement,...doc.querySelectorAll('*')];if(elements.length>10000)failed();
 for(const el of elements){const name=el.localName.toLowerCase();if(['script','animate','animatetransform','animatemotion','animatecolor','set','discard','use'].includes(name))throw Error('This SVG uses animation, scripts, or linked elements that cannot be inserted safely.');for(const attr of el.attributes){const key=attr.localName.toLowerCase(),value=attr.value;if(key.startsWith('on')||key==='base'||(key==='href'&&!value.trim().startsWith('#')))throw Error('This SVG contains a link or script that cannot be inserted safely.');if(/url\s*\(|@import|\\/i.test(value))throw Error('This SVG uses external or linked styles that cannot be inserted safely.');if(key==='style'&&/\b(?:animation|transition)(?:\s*:|-)|@keyframes/i.test(value))throw Error('Animated SVG styles cannot be inserted safely.');}if(name==='style'&&(/url\s*\(|@import|\\/i.test(el.textContent)))throw Error('This SVG uses external or linked styles that cannot be inserted safely.');if(name==='style'&&/\b(?:animation|transition)(?:\s*:|-)|@keyframes/i.test(el.textContent))throw Error('Animated SVG styles cannot be inserted safely.');}
 return dimensions;
}
function fromDataURL(url){const comma=url.indexOf(',');if(comma<0)failed();const meta=url.slice(0,comma),mime=meta.slice(5).split(';')[0].toLowerCase(),base64=/;base64(?:;|$)/i.test(meta);if(!/^data:/i.test(meta))failed();const whole=mime==='image/gif'||mime==='image/svg+xml';if(whole&&url.length-comma>24*1024*1024)failed();let raw;try{const s=url.slice(comma+1,whole?undefined:comma+1+Math.ceil(HEADER_LIMIT/3)*4);raw=base64?atob(s.slice(0,s.length-s.length%4)):decodeURIComponent(s);}catch{failed();}if(mime==='image/svg+xml')return svgDimensions(raw);const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));return mime==='image/gif'?gifDimensions(bytes):imageDimensions(bytes,mime);}

export function checkDrawingImages(elements,files,addition=null){let count=0,pixels=0;const ids=new Set();const add=d=>{count++;pixels+=d.pixels;if(count>MAX_DRAWING_IMAGES)throw Error('A drawing can contain up to 256 different images. The current drawing is unchanged.');if(pixels>MAX_DRAWING_PIXELS)throw Error('Images together exceed the 80 megapixel drawing limit. The current drawing is unchanged.');};for(const e of elements){if(e.type!=='image'||e.isDeleted||ids.has(e.fileId))continue;ids.add(e.fileId);const file=files?.[e.fileId];if(!file||typeof file.dataURL!=='string')failed();add(fromDataURL(file.dataURL));}if(addition)add(addition);return {count,pixels};}
