// Keep exact embedded-image data references rather than serializing base64 on
// every pointer movement. Strings are immutable; equality compares contents.
export function captureScene(elements,files,appState={}){
 // These are the app-state properties the pinned Excalidraw serializer exports.
 // Viewport position and zoom are deliberately excluded from dirty tracking.
 const settings=JSON.stringify([appState.gridSize,appState.gridStep,appState.gridModeEnabled,appState.viewBackgroundColor]);
 return {elements:JSON.stringify(elements),settings,files:new Map(Object.entries(files||{}).map(([id,file])=>[id,[file?.dataURL,file?.created,file?.mimeType]]))};
}
export function sceneChanged(before,after){
 return after.elements!==before.elements||after.settings!==before.settings||after.files.size!==before.files.size||[...after.files].some(([id,values])=>{const old=before.files.get(id);return !old||values.some((value,i)=>value!==old[i]);});
}
