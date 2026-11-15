import assert from 'node:assert/strict';import {captureScene,sceneChanged} from "../../scene-change.mjs";
const elements=[{id:'shape',type:'image'}],files={img:{dataURL:'data:image/png;base64,AAAA',created:1,mimeType:'image/png'}};
const before=captureScene(elements,files);assert.equal(sceneChanged(before,captureScene(elements,files)),false);
assert.equal(sceneChanged(before,captureScene(elements,{img:{...files.img,dataURL:'data:image/png;base64,BBBB'}})),true,'same-sized replacement is detected');
assert.equal(sceneChanged(before,captureScene(elements,{})),true);assert.equal(sceneChanged(before,captureScene([{id:'other',type:'image'}],files)),true);
console.log('PASS drawing and same-length embedded image change detection');
