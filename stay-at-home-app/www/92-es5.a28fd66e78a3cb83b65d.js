function _defineProperties(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,n,t){return n&&_defineProperties(e.prototype,n),t&&_defineProperties(e,t),e}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[92],{opTa:function(e,n,t){"use strict";t.r(n);var r=t("8Y7J"),o=function e(){_classCallCheck(this,e)},i=t("pMnS"),a=t("MKJQ"),s=t("sZkV"),c=t("mrSG"),u=t("/fki"),l=t("3pPM"),f=t("a3Cf"),b=function(e){function n(){var n=null!==e&&e.apply(this,arguments)||this;return n.ORIENTATIONS={PORTRAIT_PRIMARY:"portrait-primary",PORTRAIT_SECONDARY:"portrait-secondary",LANDSCAPE_PRIMARY:"landscape-primary",LANDSCAPE_SECONDARY:"landscape-secondary",PORTRAIT:"portrait",LANDSCAPE:"landscape",ANY:"any"},n}return Object(c.c)(n,e),n.prototype.onChange=function(){return Object(f.cordova)(this,"onChange",{eventObservable:!0,event:"orientationchange",element:"window"},arguments)},n.prototype.lock=function(e){return Object(f.cordova)(this,"lock",{otherPromise:!0},arguments)},n.prototype.unlock=function(){return Object(f.cordova)(this,"unlock",{sync:!0},arguments)},Object.defineProperty(n.prototype,"type",{get:function(){return Object(f.cordovaPropertyGet)(this,"type")},set:function(e){Object(f.cordovaPropertySet)(this,"type",e)},enumerable:!0,configurable:!0}),n.pluginName="ScreenOrientation",n.plugin="cordova-plugin-screen-orientation",n.pluginRef="screen.orientation",n.repo="https://github.com/apache/cordova-plugin-screen-orientation",n.platforms=["Android","iOS","Windows"],n}(f.IonicNativePlugin),d=t("gcOT"),p=t("MLCJ"),h=d.b.StatusBar,v=function(){function e(n,t,r,o){_classCallCheck(this,e),this.forestWatcher=n,this.screenOrientation=t,this.tabsSvc=r,this.loadingCtrl=o}return _createClass(e,[{key:"iframeLoaded",value:function(){console.log("iframeLoaded"),document.querySelector("#iFrame"),console.log(window[0])}},{key:"ngAfterViewInit",value:function(){}},{key:"ngOnInit",value:function(){var e=this;console.log("Setting events"),window.addEventListener("onVRLoaded",(function(n){return c.a(e,void 0,void 0,regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Getting onVRLoaded"),e.next=3,this.forestWatcher.getCount();case 3:return t=e.sent,this.fRenderer=new l.a(n.document,n.aframe,n.three),this.fRenderer.showInformationPane(),this.fRenderer.setCurrentView("gView"),e.t0=this.fRenderer,e.next=10,this.forestWatcher.getCurrentLevel();case 10:e.t1=e.sent,e.t0.setLevel.call(e.t0,e.t1),this.fRenderer.setTreeCount(t,!1);case 13:case"end":return e.stop()}}),e,this)})))}),!1),window.addEventListener("onVRChangeView",(function(n){return c.a(e,void 0,void 0,regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("Getting onVRChangeView"),null!=this.fRenderer&&this.fRenderer.setCurrentView(n.view);case 1:case"end":return e.stop()}}),e,this)})))}),!1),this.forestWatcher.grow.subscribe((function(n){return c.a(e,void 0,void 0,regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Listener Events.GROWING"),e.next=3,this.forestWatcher.getCount();case 3:n=e.sent,this.fRenderer.setTreeCount(n,!0);case 5:case"end":return e.stop()}}),e,this)})))})),this.forestWatcher.level.subscribe((function(n){console.log("New Level!!!"),e.fRenderer.setLevel(n)})),this.screenOrientation.onChange().subscribe((function(){e.screenOrientation.type!=e.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY&&e.screenOrientation.type!=e.screenOrientation.ORIENTATIONS.PORTRAIT||(h.show(),e.tabsSvc.showTabs()),e.screenOrientation.type!=e.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY&&e.screenOrientation.type!=e.screenOrientation.ORIENTATIONS.LANDSCAPE||(h.hide(),e.tabsSvc.hideTabs())}))}}]),e}(),g=r.pb({encapsulation:2,styles:[["ion-content ion-toolbar{--background:translucent}iframe{position:absolute;width:100%;height:100%;border:none}"]],data:{}});function R(e){return r.Jb(0,[(e()(),r.rb(0,0,null,null,2,"ion-content",[],null,null,null,a.J,a.j)),r.qb(1,49152,null,0,s.t,[r.h,r.k,r.x],null,null),(e()(),r.rb(2,0,null,0,0,"iframe",[["id","iFrame"],["src","/assets/aframe.html"]],null,[[null,"load"]],(function(e,n,t){var r=!0;return"load"===n&&(r=!1!==e.component.iframeLoaded()&&r),r}),null,null))],null,null)}var O=r.nb("app-cities",v,(function(e){return r.Jb(0,[(e()(),r.rb(0,0,null,null,1,"app-cities",[],null,null,null,R,g)),r.qb(1,4308992,null,0,v,[u.a,b,p.a,s.Cb],null,null)],(function(e,n){e(n,1,0)}),null)}),{},{},[]),w=t("SVse"),m=t("s7LF"),C=t("iInd");t.d(n,"CitiesPageModuleNgFactory",(function(){return A}));var A=r.ob(o,[],(function(e){return r.Ab([r.Bb(512,r.j,r.Z,[[8,[i.a,O]],[3,r.j],r.v]),r.Bb(4608,w.k,w.j,[r.s,[2,w.t]]),r.Bb(4608,s.b,s.b,[r.x,r.g]),r.Bb(4608,s.Db,s.Db,[s.b,r.j,r.p]),r.Bb(4608,s.Gb,s.Gb,[s.b,r.j,r.p]),r.Bb(4608,m.l,m.l,[]),r.Bb(4608,b,b,[]),r.Bb(1073742336,w.b,w.b,[]),r.Bb(1073742336,s.Ab,s.Ab,[]),r.Bb(1073742336,m.k,m.k,[]),r.Bb(1073742336,m.e,m.e,[]),r.Bb(1073742336,C.o,C.o,[[2,C.t],[2,C.n]]),r.Bb(1073742336,o,o,[]),r.Bb(1024,C.l,(function(){return[[{path:"",component:v}]]}),[])])}))}}]);