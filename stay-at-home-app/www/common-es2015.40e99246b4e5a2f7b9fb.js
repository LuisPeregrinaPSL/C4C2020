(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"/fki":function(t,e,n){"use strict";var i=n("mrSG"),o=n("8Y7J"),s=n("vCEr"),r=n("JJg2"),a=n("PkfG"),l=n("mlpq"),c=n("gcOT"),u=n("HC5s"),h=n("2qmX"),d=n("IzT6"),f=n("n6ga");class m{constructor(t,e,n){this.coords=t,this.time=e,this.treeDiff=n||0}}var g=n("sZkV");n.d(e,"a",(function(){return v}));let v=(()=>{class t{constructor(t,e,n,s,l){this.gpsSvc=t,this.appStorageSvc=e,this.alertCtrl=n,this.audio=s,this.restApi=l,this.timeToGrowANewTree=r.a.TIME_TO_GROW_TREE,this.status=a.a.GROWING,this.grow=new o.m,this.shrink=new o.m,this.level=new o.m,t.beacon.subscribe(t=>i.a(this,void 0,void 0,(function*(){this.appStorageSvc.getConfiguration().then(e=>{if(u.a.convertToMeters(e.home.latitude,e.home.longitude,t.latitude,t.longitude)>r.a.DISTANCE_TO_HOUSE_THRESHOLD)this.status=a.a.SHRINKING,h.a.earliestGrowingDate=null,this.deductTree(),this.appStorageSvc.addHistory(new m(t,new Date,-1)),this.restApi.postLocation(t),this.shrink.emit(e.trees);else{let e=new Date;h.a.earliestGrowingDate?(this.status=a.a.GROWING,this.calculate(e,t)):h.a.earliestGrowingDate=e}})}))),["new-tree","first-start","lose-tree","new-level"].forEach(t=>s.preloadSimple(t,"../public/assets/sounds/"+t+".mp3").then(t=>{console.log("Preloaded audio.")},t=>{console.error("Couldn't preload audio.")}))}calculate(t,e){return i.a(this,void 0,void 0,(function*(){let n=h.a.calculateNewTrees(t);if(n>0){let t=yield this.appStorageSvc.getConfiguration();if(t.geolocationEnabled&&t.home){t.trees+=n,this.audio.play("new-tree"),this.grow.emit(n);let e=h.a.getPlayerLevel(t);e>t.level&&(t.level=e,this.notifyUser("Congratulations","You have increased your forest level to "+e+"!"),this.level.emit(e)),yield this.appStorageSvc.setConfiguration(t)}e&&this.appStorageSvc.addHistory(new m(e,new Date,n))}return n}))}deductTree(){this.appStorageSvc.getConfiguration().then(t=>{t.trees>0&&(t.trees--,this.appStorageSvc.setConfiguration(t),this.notifyUser("Return home!","You have one tree less now."))})}notifyUser(t,e){h.a.isInForeground()?this.showAlert(t,e):this.showLocalNotification(t,e)}showLocalNotification(t,e){c.a.schedule({notifications:[{title:t,body:e,id:2,sound:null,attachments:null,actionTypeId:"",extra:null}]})}showToast(t,e){return i.a(this,void 0,void 0,(function*(){yield c.c.show({text:t+": "+e})}))}showAlert(t,e){return i.a(this,void 0,void 0,(function*(){h.a.isActive=!1,this.alertCtrl.create({header:t,message:e,buttons:["OK"]}).then(t=>{t.present().then(e=>{t.onDidDismiss().then(t=>{console.log("Dismissed, user is active again."),h.a.isActive=!0})})})}))}getCount(){return i.a(this,void 0,void 0,(function*(){return(yield this.appStorageSvc.getConfiguration()).trees}))}getCurrentLevel(){return i.a(this,void 0,void 0,(function*(){let t=yield this.appStorageSvc.getConfiguration();return h.a.getPlayerLevel(t)}))}}return t.ngInjectableDef=o.Nb({factory:function(){return new t(o.Ob(s.a),o.Ob(l.a),o.Ob(g.a),o.Ob(d.a),o.Ob(f.a))},token:t,providedIn:"root"}),t})()},"3pPM":function(t,e,n){"use strict";var i=function(t){return t[t.xMin=-20]="xMin",t[t.xMax=20]="xMax",t[t.yMin=.31]="yMin",t[t.yMax=.31]="yMax",t[t.zMin=-2]="zMin",t[t.zMax=-15.5]="zMax",t}({});let o=[];o.common={name:"Common",label:"Common",gltfModel:"tree2",id:"treeCommon",src:"/assets/gltf/tree4.glb",posY:0,minY:0,scaleX:1,scaleY:1,scaleZ:-1},o.pine={name:"Pine",label:"Pine",gltfModel:"pine",id:"treePine",src:"/assets/gltf/pine.glb",posY:.31,minY:0,scaleX:2,scaleY:2,scaleZ:-2},o.palm={name:"Palm",label:"Palm",gltfModel:"palm",id:"treePalm",src:"/assets/gltf/palm.glb",posY:.31,minY:0,scaleX:.25,scaleY:.5,scaleZ:-.25},o.bubinga={name:"Bubinga",label:"Bubinga",gltfModel:"bubinga",id:"treeBubinga",src:"/assets/gltf/bubinga.glb",posY:.31,minY:0,scaleX:1,scaleY:1,scaleZ:-1},o.forest={name:"Forest",label:"Forest",gltfModel:"forest",id:"treeForest",src:"/assets/gltf/forest.glb",posY:.31,minY:0,scaleX:3.15,scaleY:3.27,scaleZ:-2.66};let s=[];function r(t){return console.log("getTreeModelByLevel"),console.log(s.length),t<0&&(t=0),null==s[t]&&(t=s.length-1),o[s[t]]}s[0]="common",s[1]="pine",s[2]="palm",s[3]="bubinga";var a=n("2qmX"),l=n("HC5s");n.d(e,"a",(function(){return c}));class c{constructor(t,e,n){this.treeCount=0,this.treeLimit=40,this.backCount=0,this.frontCount=0,this.level=1,this.__document=t,this.__aframe=e,this.__three=n,this.scene=this.__document.querySelector("a-scene"),console.log(this.scene),this.txt=this.scene.querySelector("#treeNumber"),this.env=this.scene.querySelector("#env"),this.infoBlock=this.__document.querySelector("#info_block"),this.countInfo=this.infoBlock.querySelector("#tree_count"),this.setEvents(),this.setLevel(0)}setEvents(){this.__aframe.registerComponent("show-three-info",{schema:{},init:function(){var t=this.data,e=this.el,n=e.parentNode.parentNode.querySelector("#info_block").querySelector("#content");e.addEventListener("mouseenter",(function(){n.innerHTML=t.text})),e.addEventListener("mouseleave",(function(){n.innerHTML="<br>"})),e.addEventListener("click",(function(t){n.innerHTML="You click on a tree!!!"}))}})}setInitialAmount(){return console.log("treeCount: ",this.treeCount),this.backCount=Math.floor(this.treeCount/this.treeLimit)*this.treeLimit,console.log("backCount: ",this.backCount),this.env.setAttribute("environment","dressingAmount:"+this.backCount),this.treeCount-this.backCount}showInformationPane(){this.infoBlock.style.visibility="visible"}setCurrentView(t){var e,n;switch(console.log("Changing view",t),t){case"gView":case"aView":case"eView":e=this.scene.querySelector("#"+t);break;default:return}null!=this.currentView&&(this.currentView.setAttribute("active","false"),"eView"==this.currentView.getAttribute("id")&&(n=this.currentView.querySelector("#cursor"),this.currentView.removeChild(n))),e.setAttribute("active","true"),"eView"==t&&((n=this.__document.createElement("a-cursor")).setAttribute("id","cursor"),e.appendChild(n)),this.currentView=e}setLevel(t){console.log("Setting level to ",t),this.level=t,0==this.frontCount?(this.frontCount=a.a.getTreesByLevel(this.level),console.log("Setting frontCount to",this.frontCount)):(this.resetLandscape(),this.convertLastLevelIntoForest()),this.level>0&&this.convertLastLevelIntoForest(),this.model=r(this.level)}setLastLevel(t,e){console.log("Setting last level to",t),this.level=t,0==this.frontCount&&(this.frontCount=a.a.getTreesByLevel(this.level),console.log("Setting frontCount to",this.frontCount)),this.model=r(this.level),this.resetLandscape(),this.setTreeCount(e,!1)}setTreeCount(t,e){console.log("Seeting tree count",t);var n=this.treeCount;console.log("Previous count",n),this.treeCount=t;var i=this.treeCount-n;console.log("first diff: ",i),this.treeCount>0&&0==n&&(i=this.setInitialAmount(),console.log("setInitialAmount: ",i)),console.log("diff: ",i),i>0&&(this.treeCount-this.backCount>this.treeLimit&&(this.resetLandscape(),i=this.treeCount-this.backCount,console.log("new diff",i)),this.addNewTrees(i,e),this.countInfo.innerHTML="You have "+this.treeCount+" trees")}addNewTrees(t,e){if(console.log("Adding "+t+" new trees..."),this.frontCount+=t,t>0)for(var n=0;n<t;n++)this.addTree(e)}addTree(t){console.log("Adding new tree...");var e=l.a.getRandomFloat(i.xMin,i.xMax),n=this.model.posY,o=l.a.getRandomFloat(i.zMin,i.zMax),s=this.__document.createElement("a-entity");s.setAttribute("id",this.model.id),s.setAttribute("position",e+" "+n+" "+o),t?(s.setAttribute("scale",this.model.scaleX+" "+this.model.minY+" "+this.model.scaleZ),s.setAttribute("animation","property: object3D.scale.y; to: "+this.model.scaleY+"; dir: alternate; dur: 2000; loop: false")):s.setAttribute("scale",this.model.scaleX+" "+this.model.scaleY+" "+this.model.scaleZ),s.setAttribute("rotation","0 0 0"),s.setAttribute("gltf-model","#"+this.model.gltfModel),s.setAttribute("animation-mixer",""),s.setAttribute("show-three-info","text: I am a "+this.model.name);var r=this.__document.createElement("a-animation");r.setAttribute("begin","click"),r.setAttribute("attribute","rotation"),r.setAttribute("to","0 360 0"),r.setAttribute("easing","linear"),r.setAttribute("dur","2000"),r.setAttribute("fill","backwards"),this.scene.appendChild(s)}resetLandscape(){if(console.log("frontCount",this.frontCount),this.frontCount>0){var t;for(this.backCount+=this.frontCount,this.countInfo.innerHTML="You have reached the count limit, reseting landscape....";t=this.scene.querySelector("a-entity#"+this.model.id);)console.log("removing..."),console.log(t),this.scene.removeChild(t);this.frontCount=0,this.env.setAttribute("environment","dressingAmount:"+this.backCount)}}convertLastLevelIntoForest(){var t=o.forest,e=this.level/1.3,n=-27.074*e,i=t.posY,s=-51.216*e,r=this.__document.createElement("a-entity");r.setAttribute("id",t.id),r.setAttribute("position",n+" "+i+" "+s),r.setAttribute("scale",t.scaleX*e+" "+t.minY+" "+t.scaleZ*e),r.setAttribute("animation","property: object3D.scale.y; to: "+t.scaleY*e+"; dir: alternate; dur: 2000; loop: false"),r.setAttribute("rotation","0 0 0"),r.setAttribute("gltf-model","#"+t.gltfModel),r.setAttribute("animation-mixer",""),r.setAttribute("show-three-info","text: I am a "+t.name),this.scene.appendChild(r)}}},"6i10":function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));const i={bubbles:{dur:1e3,circles:9,fn:(t,e,n)=>{const i=`${t*e/n-t}ms`,o=2*Math.PI*e/n;return{r:5,style:{top:`${9*Math.sin(o)}px`,left:`${9*Math.cos(o)}px`,"animation-delay":i}}}},circles:{dur:1e3,circles:8,fn:(t,e,n)=>{const i=e/n,o=`${t*i-t}ms`,s=2*Math.PI*i;return{r:5,style:{top:`${9*Math.sin(s)}px`,left:`${9*Math.cos(s)}px`,"animation-delay":o}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(t,e)=>({r:6,style:{left:`${9-9*e}px`,"animation-delay":-110*e+"ms"}})},lines:{dur:1e3,lines:12,fn:(t,e,n)=>({y1:17,y2:29,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":`${t*e/n-t}ms`}})},"lines-small":{dur:1e3,lines:12,fn:(t,e,n)=>({y1:12,y2:20,style:{transform:`rotate(${30*e+(e<6?180:-180)}deg)`,"animation-delay":`${t*e/n-t}ms`}})}}},HC5s:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));class i{static getRandomInt(t,e){return e||(e=t,t=0),Math.floor(Math.random()*(e-t+1)+t)}static getRandomFloat(t,e){return e||(e=t,t=0),(Math.random()*(e-t)+t).toFixed(5)}static convertToMeters(t,e,n,i){var o=n*Math.PI/180-t*Math.PI/180,s=i*Math.PI/180-e*Math.PI/180,r=Math.sin(o/2)*Math.sin(o/2)+Math.cos(t*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(s/2)*Math.sin(s/2);return 2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r))*6378.137*1e3}}},KwJk:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return i})),n.d(e,"d",(function(){return a}));const i=(t,e)=>null!==e.closest(t),o=t=>"string"==typeof t&&t.length>0?{"ion-color":!0,[`ion-color-${t}`]:!0}:void 0,s=t=>{const e={};return(t=>void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter(t=>null!=t).map(t=>t.trim()).filter(t=>""!==t):[])(t).forEach(t=>e[t]=!0),e},r=/^[a-z][a-z0-9+\-.]*:/,a=async(t,e,n)=>{if(null!=t&&"#"!==t[0]&&!r.test(t)){const i=document.querySelector("ion-router");if(i)return null!=e&&e.preventDefault(),i.push(t,n)}return!1}},NqGI:function(t,e,n){"use strict";n.d(e,"a",(function(){return i})),n.d(e,"b",(function(){return o}));const i=async(t,e,n,i,o)=>{if(t)return t.attachViewToDom(e,n,o,i);if("string"!=typeof n&&!(n instanceof HTMLElement))throw new Error("framework delegate is missing");const s="string"==typeof n?e.ownerDocument&&e.ownerDocument.createElement(n):n;return i&&i.forEach(t=>s.classList.add(t)),o&&Object.assign(s,o),e.appendChild(s),s.componentOnReady&&await s.componentOnReady(),s},o=(t,e)=>{if(e){if(t)return t.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}},PkfG:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var i=function(t){return t[t.GROWING=0]="GROWING",t[t.SHRINKING=1]="SHRINKING",t}({})},Uwmq:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));const i=t=>{try{if("string"!=typeof t||""===t)return t;const e=document.createDocumentFragment(),n=document.createElement("div");e.appendChild(n),n.innerHTML=t,a.forEach(t=>{const n=e.querySelectorAll(t);for(let i=n.length-1;i>=0;i--){const t=n[i];t.parentNode?t.parentNode.removeChild(t):e.removeChild(t);const r=s(t);for(let e=0;e<r.length;e++)o(r[e])}});const i=s(e);for(let t=0;t<i.length;t++)o(i[t]);const r=document.createElement("div");r.appendChild(e);const l=r.querySelector("div");return null!==l?l.innerHTML:r.innerHTML}catch(e){return console.error(e),""}},o=t=>{if(t.nodeType&&1!==t.nodeType)return;for(let n=t.attributes.length-1;n>=0;n--){const e=t.attributes.item(n),i=e.name;if(!r.includes(i.toLowerCase())){t.removeAttribute(i);continue}const o=e.value;null!=o&&o.toLowerCase().includes("javascript:")&&t.removeAttribute(i)}const e=s(t);for(let n=0;n<e.length;n++)o(e[n])},s=t=>null!=t.children?t.children:t.childNodes,r=["class","id","href","src","name","slot"],a=["script","style","iframe","meta","link","object","embed"]},abcn:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));class i{constructor(){this.level=0,this.geolocationEnabled=!1,this.deviceId="Default device id",this.trees=0,this.home=null}}},fzvj:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return r})),n.d(e,"d",(function(){return i}));const i=()=>{const t=window.TapticEngine;t&&t.selection()},o=()=>{const t=window.TapticEngine;t&&t.gestureSelectionStart()},s=()=>{const t=window.TapticEngine;t&&t.gestureSelectionChanged()},r=()=>{const t=window.TapticEngine;t&&t.gestureSelectionEnd()}},n6ga:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var i=n("l207"),o=n("8Y7J"),s=n("IheW");let r=(()=>{class t{constructor(t){this.http=t}get(t){return this.http.get(i.a.SERVER+"/"+t)}uploadImage(t,e){var n=this.formData("image",e);return this.http.post(i.a.SERVER+i.a.SERVER_IMAGE_URL+"?id="+t,n)}postLocation(t){return this.http.post(i.a.ELASTIC_SERVER_POST_URL,t)}blobFromDataURI(t){for(var e=atob(t.replace(/[^,]+,/,"")),n=[],i=0,o=e.length;i<o;i++)n.push(e.charCodeAt(i));return new Blob([new Uint8Array(n)],{type:"image/jpeg"})}formData(t,e){var n=new FormData;return n.append(t,this.blobFromDataURI(e)),n}}return t.ngInjectableDef=o.Nb({factory:function(){return new t(o.Ob(s.c))},token:t,providedIn:"root"}),t})()}}]);