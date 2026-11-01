import assert from 'node:assert/strict';import {captureScene,sceneChanged} from '../apps/system/excalidraw/scene-change.mjs';
const settings={gridSize:20,gridStep:5,gridModeEnabled:false,viewBackgroundColor:'#ffffff',scrollX:0,zoom:{value:1}};
const before=captureScene([],{},settings);
for(const [name,value] of [['gridSize',30],['gridStep',10],['gridModeEnabled',true],['viewBackgroundColor','#fffce8']])assert.equal(sceneChanged(before,captureScene([],{}, {...settings,[name]:value})),true,name+' must mark a saved scene as changed');
assert.equal(sceneChanged(before,captureScene([],{}, {...settings,scrollX:40,zoom:{value:2}})),false,'viewport movement is not a document edit');
console.log('PASS saved canvas settings mark the scene dirty; zoom and pan do not');
