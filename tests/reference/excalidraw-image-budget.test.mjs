import assert from 'node:assert/strict';
import {imageDimensions,checkDrawingImages} from "../../image-budget.mjs";
function png(w,h){const b=new Uint8Array(45),v=new DataView(b.buffer);b.set([137,80,78,71,13,10,26,10]);b.set([73,72,68,82],12);v.setUint32(16,w);v.setUint32(20,h);v.setUint32(8,13);b.set([73,68,65,84],37);return b;}
const data=b=>'data:image/png;base64,'+Buffer.from(b).toString('base64');
assert.equal(imageDimensions(png(8000,5000),'image/png').pixels,40_000_000);
assert.throws(()=>imageDimensions(png(8001,5000),'image/png'),/40 megapixel/);
assert.throws(()=>imageDimensions(png(65000,65000),'image/png'),/40 megapixel/);
const jpeg=Uint8Array.from([255,216,255,192,0,7,8,0x13,0x88,0x1f,0x40]);assert.equal(imageDimensions(jpeg,'image/jpeg').pixels,40_000_000);
const webp=new Uint8Array(30);webp.set(Buffer.from('RIFF'),0);webp.set(Buffer.from('WEBPVP8X'),8);webp[16]=10;webp[24]=0x3f;webp[25]=0x1f;webp[27]=0x87;webp[28]=0x13;assert.equal(imageDimensions(webp,'image/webp').pixels,40_000_000);
const files={},elements=[];for(let i=0;i<3;i++){files[i]={dataURL:data(png(8000,5000))};elements.push({type:'image',fileId:String(i)});}assert.throws(()=>checkDrawingImages(elements,files),/80 megapixel/);
for(let i=0;i<257;i++){files[i]={dataURL:data(png(1,1))};elements[i]={type:'image',fileId:String(i)};}assert.throws(()=>checkDrawingImages(elements,files),/256 different/);
assert.deepEqual(checkDrawingImages([{type:'image',fileId:'0'},{type:'image',fileId:'0'}],files),{count:1,pixels:1});
const gif='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';assert.equal(checkDrawingImages([{type:'image',fileId:'g'}],{g:{dataURL:gif}}).count,1);
const animated=png(20,20);animated.set([97,99,84,76],37);assert.throws(()=>imageDimensions(animated,'image/png'),/Animated PNG/);
webp[20]=2;assert.throws(()=>imageDimensions(webp,'image/webp'),/Animated WebP/);
console.log('PASS image budgets, raster header formats, distinct images and unsupported formats');
