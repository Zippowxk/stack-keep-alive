function e(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,a,o=[],i=!0,u=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(e){u=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(u)throw a}}return o}(e,t)||o(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function a(e){return function(e){if(Array.isArray(e))return i(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||o(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}import{callWithAsyncErrorHandling as u,queuePostFlushCb as c,nextTick as s,getCurrentInstance as l,watch as f,onMounted as v,onUpdated as p,onBeforeUnmount as h,warn as d,isVNode as y,cloneVNode as _,setTransitionHooks as E}from"vue";import{isArray as m,isString as A,extend as C,isObject as g,toNumber as S}from"@vue/shared";import{useRouter as T}from"vue-router";import{Comment as k,Fragment as N,h as R,warn as L}from"@vue/runtime-core";import{toRaw as P}from"@vue/reactivity";var O;!function(e){e[e.ELEMENT=1]="ELEMENT",e[e.FUNCTIONAL_COMPONENT=2]="FUNCTIONAL_COMPONENT",e[e.STATEFUL_COMPONENT=4]="STATEFUL_COMPONENT",e[e.TEXT_CHILDREN=8]="TEXT_CHILDREN",e[e.ARRAY_CHILDREN=16]="ARRAY_CHILDREN",e[e.SLOTS_CHILDREN=32]="SLOTS_CHILDREN",e[e.TELEPORT=64]="TELEPORT",e[e.SUSPENSE=128]="SUSPENSE",e[e.COMPONENT_SHOULD_KEEP_ALIVE=256]="COMPONENT_SHOULD_KEEP_ALIVE",e[e.COMPONENT_KEPT_ALIVE=512]="COMPONENT_KEPT_ALIVE",e[e.COMPONENT=6]="COMPONENT"}(O||(O={}));var b,I=O,F=function(e){return null!=e},M={__placeholder:!0},D=function(e){return e.currentRoute._value.path},H=function(){var e=B();return F(e)?e.id:void 0},B=function(){return history.state},w=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return"keep-alive-vnode-key-".concat(Number(e),"-").concat(n||D(t))},U=function(e){return e.type.__isKeepAlive};function K(e,t){return!(t.shapeFlag&I.COMPONENT)&&(e.type===t.type&&e.key===t.key)}!function(e){e[e.SETUP_FUNCTION=0]="SETUP_FUNCTION",e[e.RENDER_FUNCTION=1]="RENDER_FUNCTION",e[e.WATCH_GETTER=2]="WATCH_GETTER",e[e.WATCH_CALLBACK=3]="WATCH_CALLBACK",e[e.WATCH_CLEANUP=4]="WATCH_CLEANUP",e[e.NATIVE_EVENT_HANDLER=5]="NATIVE_EVENT_HANDLER",e[e.COMPONENT_EVENT_HANDLER=6]="COMPONENT_EVENT_HANDLER",e[e.VNODE_HOOK=7]="VNODE_HOOK",e[e.DIRECTIVE_HOOK=8]="DIRECTIVE_HOOK",e[e.TRANSITION_HOOK=9]="TRANSITION_HOOK",e[e.APP_ERROR_HANDLER=10]="APP_ERROR_HANDLER",e[e.APP_WARN_HANDLER=11]="APP_WARN_HANDLER",e[e.FUNCTION_REF=12]="FUNCTION_REF",e[e.ASYNC_COMPONENT_LOADER=13]="ASYNC_COMPONENT_LOADER",e[e.SCHEDULER=14]="SCHEDULER"}(b||(b={}));var V,x=b;!function(e){e[e.TEXT=1]="TEXT",e[e.CLASS=2]="CLASS",e[e.STYLE=4]="STYLE",e[e.PROPS=8]="PROPS",e[e.FULL_PROPS=16]="FULL_PROPS",e[e.HYDRATE_EVENTS=32]="HYDRATE_EVENTS",e[e.STABLE_FRAGMENT=64]="STABLE_FRAGMENT",e[e.KEYED_FRAGMENT=128]="KEYED_FRAGMENT",e[e.UNKEYED_FRAGMENT=256]="UNKEYED_FRAGMENT",e[e.NEED_PATCH=512]="NEED_PATCH",e[e.DYNAMIC_SLOTS=1024]="DYNAMIC_SLOTS",e[e.DEV_ROOT_FRAGMENT=2048]="DEV_ROOT_FRAGMENT",e[e.HOISTED=-1]="HOISTED",e[e.BAIL=-2]="BAIL"}(V||(V={}));var Y=V,G=4,j=128,W=256,X=512,$=function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=0;n<e.length;n++)e[n](t)};function q(e){return"function"==typeof e&&e.displayName||e.name}function z(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;u(e,t,7,[n,r])}var J=0,Q=1;var Z,ee=function(e,t){var n;t&&t.pendingBranch?m(e)?(n=t.effects).push.apply(n,a(e)):t.effects.push(e):c(e)},te=function(){function e(n){t(this,e),this.historyStackMap=[],this.destroyCache=n}return r(e,[{key:"push",value:function(e,t){var n=this.historyStackMap[t];if(Array.isArray(n))!n.includes(e)&&n.push(e),this.historyStackMap[t]=n.filter((function(e){return!e._isDestroyed}));else{var r=[];r.push(e),this.historyStackMap[t]=r}}},{key:"pop",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this.historyStackMap.pop();if(Array.isArray(n))if(t){var r=n.pop();r&&this.destroyCache(r)}else n.forEach((function(t){return t&&e.destroyCache(t)}))}},{key:"removeGreater",value:function(e){for(;this.historyStackMap.length>=e;)this.pop()}},{key:"clear",value:function(){this.historyStackMap=[]}}]),e}(),ne=function(){function e(n){t(this,e),this.router=n}return r(e,[{key:"beforeReplace",value:function(e,t){var n=this.router,r=n.replace;return n.replace=function(a,o,i){!function(a,o,i){e(a),r.call(n,a,o,(function(e){t(),F(i)&&i(e)}))}(a,o,i)},this}},{key:"beforeGo",value:function(e){var t=this.router,n=t.go;return t.go=function(r){return e(a=r),n.call(t,a);var a},this}},{key:"beforePush",value:function(e){var t=this.router,n=t.push;return t.push=function(r,a,o){return function(r,a,o){if(e(),!a&&!o&&"undefined"!=typeof Promise)return n.call(t,r,a,o);n.call(t,r,a,o)}(r,a,o)},this}}]),e}();var re=function(e){return Z||(Z=new ae),e&&Z.setup(e),Z},ae=function(){function e(){t(this,e)}return r(e,[{key:"setup",value:function(e){var t=this,n=e.router,r=e.pruneCacheEntry,a=e.replaceStay;!function(e){var t=e.replaceState;e.replaceState=function(n,r,a){var o=Object.assign({},e.state),i=Object.assign(o,n);t.call(e,i,r,a)};var n=e.pushState;e.pushState=function(t,r,a){var o=Object.assign({},e.state),i=Object.assign(o,t);n.call(e,i,r,a)}}(history),this.destroyCaches=r,this.router=n,this.router._stack=0,this.mode=n.mode,this.historyShouldChange=!1,this.isReplace=!1,this.replacePrePath=void 0,this.preStateId=0,this.pre=null,this.replaceStay=a||[],this._initial=!0,this.historyStack=new te((function(e){e&&t.destroyCaches(e.vnode.key)})),this.init(),this.router.__core=this,this._routeTo=void 0}},{key:"isBacking",get:function(){return!(this.isPush||this.isReplace)}},{key:"init",value:function(){this.initStackPointer(),this.routerHooks(),this.hackRouter()}},{key:"initStackPointer",value:function(){var e=H();F(e)?this.setStackPointer(e):this.setState(0)}},{key:"genInitialKeyNextTime",value:function(){this._initial=!0}},{key:"genKeyForVnode",value:function(){var e=this.router;return this.isReplace||this._initial?(this._initial=!1,w(this.stackPointer,e,this._routeTo)):this.isPush?w(this.stackPointer+1,e,this._routeTo):w(this.stackPointer-1,e,this._routeTo)}},{key:"routerHooks",value:function(){var e=this,t=this.router;t.beforeEach((function(t,n){e._routeTo=t.path})),t.afterEach((function(t,n){e.historyShouldChange=!0,s((function(){var t,n=e.currentVm,r=function(e){return F(e)?e:M}(n);null===e.pre?e.onInitial(r):e.isReplace?e.onReplace(r):e.isPush?e.onPush(r):e.onBack(r),e.pre=n,e.preStateId=e.stackPointer,(t=r)&&t.__placeholder||(e.historyShouldChange=!1)}))}))}},{key:"hackRouter",value:function(){var e=this;this._hackRouter=new ne(this.router),this._hackRouter.beforeReplace((function(){e.isReplace=!0,e.replacePrePath=D(e.router)}),(function(t){e.isReplace=!1,e.replacePrePath=void 0})).beforeGo((function(t){e.isReplace=!1})).beforePush((function(){e.isReplace=!1}))}},{key:"onInitial",value:function(e){this.historyStack.push(e,this.stackPointer)}},{key:"onPush",value:function(e){var t,n;this.setState(this.increaseStackPointer()),this.historyStack.push(e,this.stackPointer),null===(t=this.pre)||void 0===t||null===(n=t.$clearParent)||void 0===n||n.call(t,e),this.pre=null}},{key:"onBack",value:function(e){this.historyStack.pop(),this.decreaseStackPointer(),this.historyStack.push(e,this.stackPointer)}},{key:"onReplace",value:function(e){var t=this.replacePrePath===D(this.router);!(F(this.replacePrePath)&&this.replaceStay.includes(this.replacePrePath)||t)&&this.historyStack.pop(!0),this.pre=null,this.setState(this.stackPointer),this.historyStack.push(e,this.stackPointer),this.isReplace=!1,this.replacePrePath=void 0}},{key:"currentVm",get:function(){return(e=this.router).currentRoute._value.matched.length>0?null===(t=e.currentRoute._value.matched[0].instances.default)||void 0===t?void 0:t.$:void 0;var e,t}},{key:"isPush",get:function(){if(!this.isReplace){var e=H();return!F(e)||this.preStateId<=e}return!1}},{key:"stackPointer",get:function(){return this.router._stack}},{key:"setStackPointer",value:function(e){this.router._stack=e}},{key:"setState",value:function(e){this.setStackPointer(e),function(e,t,n){var r=window.location,a=r.pathname,o=r.search,i=r.hash,u="".concat(a).concat(o).concat(i),c=F(history.state)?history.state:{};c.id=n;var s=window.location.href.startsWith("file://");history.replaceState(c,"",s?null:u)}(this.mode,this.router,e)}},{key:"increaseStackPointer",value:function(){return this.router._stack+=1}},{key:"decreaseStackPointer",value:function(){return this.router._stack-=1}}]),e}(),oe=null,ie={name:"StackKeepAlive",__isKeepAlive:!0,props:{include:[String,RegExp,Array],exclude:[String,RegExp,Array],max:[String,Number],replaceStay:[Array],mode:String},setup:function(t,n){var r=n.slots,a=l(),o=a.ctx;if(!o.renderer)return r.default;var i=new Map,u=new Set,c=null;window.__v_cache=a.__v_cache=i;var s,m=a.suspense,A=o.renderer,C=(A.p,A.m),g=A.um,S=(0,A.o.createElement)("div");function k(e){ce(e),g(e,a,m,!0)}function N(e){i.forEach((function(t,n){var r=q(t.type);!r||e&&e(r)||R(n)}))}function R(e){var t=i.get(e);c.key===e?ce(c):c&&k(t),i.delete(e),u.delete(e)}if(o.activate=function(e,t,n,r,a){var o=e.component;C(e,t,n,J,m),ee((function(){o.isDeactivated=!1,o.a&&$(o.a);var t=e.props&&e.props.onVnodeMounted;t&&z(t,o.parent,e)}),m)},o.deactivate=function(e){var t=e.component;C(e,S,null,Q,m),ee((function(){t.da&&$(t.da);var n=e.props&&e.props.onVnodeUnmounted;n&&z(n,t.parent,e),t.isDeactivated=!0}),m)},!(s=T()))throw new Error("router is not found! In unit test mode ,router is got from gloabl.router, otherwise VueRouter.useRouter()");oe=re({router:s,pruneCacheEntry:R,replaceStay:t.replaceStay}),window.__core=oe,f((function(){return[t.include,t.exclude]}),(function(t){var n=e(t,2),r=n[0],a=n[1];r&&N((function(e){return ue(r,e)})),a&&N((function(e){return!ue(a,e)}))}),{flush:"post",deep:!0});var L=null,P=function(){null!=L&&i.set(L,se(a.subTree))};return v(P),p(P),h((function(){i.forEach((function(e){var t=a.subTree,n=a.suspense,r=se(t);if(e.type!==r.type)k(e);else{ce(r);var o=r.component.da;o&&ee(o,n)}}))})),function(){if(L=null,!r.default)return null;var e=oe.genKeyForVnode(),n=r.default({key:e}),o=n[0];if(a.vnode&&(a.vnode.__oldChild=n[0]),n.length>1)return d("KeepAlive should contain exactly one component child."),c=null,oe.genInitialKeyNextTime(),n;if(!y(o)||o.shapeFlag!==G&&o.shapeFlag!==j)return oe.genInitialKeyNextTime(),c=null,o;var s=se(o),l=s.type,f=q(s.__asyncLoader?s.type.__asyncResolved||{}:l),v=t.include,p=t.exclude,h=t.max;if(v&&(!f||!ue(v,f))||p&&f&&ue(p,f))return c=s,o;var m=null==s.key?l:s.key,A=i.get(m);return s.el&&(s=_(s),o.shapeFlag&j&&(o.ssContent=s)),L=m,A?(s.el=A.el,s.component=A.component,s.transition&&E(s,s.transition),s.shapeFlag|=X,u.delete(m),u.add(m)):(u.add(m),h&&u.size>parseInt(h,10)&&R(u.values().next().value)),s.shapeFlag|=W,c=s,o}}};function ue(e,t){return m(e)?e.some((function(e){return ue(e,t)})):A(e)?e.split(",").includes(t):!!e.test&&e.test(t)}function ce(e){if(e){var t=e.shapeFlag;t&W&&(t-=W),t&X&&(t-=X),e.shapeFlag=t}}function se(e){return e.shapeFlag&j?e.ssContent:e}var le=[Function,Array],fe={name:"BaseTransition",props:{mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:le,_onBeforeEnter:le,onEnter:le,_onEnter:le,onAfterEnter:le,onEnterCancelled:le,_onEnterCancelled:le,onBeforeLeave:le,onLeave:le,_onLeave:le,onAfterLeave:le,onLeaveCancelled:le,_onLeaveCancelled:le,onBeforeAppear:le,_onBeforeAppear:le,onAppear:le,_onAppear:le,onAfterAppear:le,onAppearCancelled:le,_onAppearCancelled:le},setup:function(e,t){var n,r=t.slots,a=l(),i=function(){var e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return v((function(){e.isMounted=!0})),h((function(){e.isUnmounting=!0})),e}();return function(){var t=r.default&&_e(r.default(),!0);if(t&&t.length){var u=t[0];if(t.length>1){var c,s=!1,l=function(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=o(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return u=e.done,e},e:function(e){c=!0,i=e},f:function(){try{u||null==n.return||n.return()}finally{if(c)throw i}}}}(t);try{for(l.s();!(c=l.n()).done;){var f=c.value;if(f.type!==k){if(s){d("<transition> can only be used on a single element or component. Use <transition-group> for lists.");break}u=f,s=!0}}}catch(e){l.e(e)}finally{l.f()}}if(u&&u.type&&u.type.name&&"StackKeepAlive"===u.type.name){u.__id=Math.floor(1e3*Math.random()),u._R;var v=new Proxy(u.children,{get:function(e,t,n){if("default"==t){var r=Reflect.get(e,t,n);return function(e){var t=r(e);return u._R&&!u._R.reused?("_placeholder"!==e.key&&(u._R[0].key=e.key,u._R[0].props.key=e.key,u._R.reused=!0),u._R):(t[0].type!==k&&(u._R=t),t)}}return Reflect.get(e,t,n)}});u.children=v}var p=P(e),h=p.mode;if(h&&"in-out"!==h&&"out-in"!==h&&"default"!==h&&d("invalid <transition> mode: ".concat(h)),i.isLeaving)return he(u);var y=de(u);if(!y)return he(u);var _=pe(y,p,i,a);ye(y,_);var E=a.subTree,m=E&&de(E),A=!1,C=y.type.getTransitionKey;if(C){var g=C();void 0===n?n=g:g!==n&&(n=g,A=!0)}if(m&&m.type!==k&&(!K(y,m)||A)){var S=pe(m,p,i,a);if(ye(m,S),"out-in"===h)return i.isLeaving=!0,S.afterLeave=function(){i.isLeaving=!1,a.update()},he(u);"in-out"===h&&y.type!==k&&(S.delayLeave=function(e,t,n){ve(i,m)[String(m.key)]=m,e._leaveCb=function(){t(),e._leaveCb=void 0,delete _.delayedLeave},_.delayedLeave=n})}return u}}}};function ve(e,t){var n=e.leavingVNodes,r=n.get(t.type);return r||(r=Object.create(null),n.set(t.type,r)),r}function pe(e,t,n,r){var a=t.appear,o=t.mode,i=t.persisted,c=void 0!==i&&i,s=t.onBeforeEnter,l=t._onBeforeEnter,f=t.onEnter,v=t._onEnter,p=t.onAfterEnter,h=t.onEnterCancelled,d=t._onEnterCancelled,y=t.onBeforeLeave,_=(t._onBeforeLeave,t.onLeave),E=t._onLeave,A=t.onAfterLeave,C=t.onLeaveCancelled,g=t._onLeaveCancelled,S=t.onBeforeAppear,T=t._onBeforeAppear,k=t.onAppear,N=t._onAppear,R=t.onAfterAppear,L=t.onAppearCancelled,P=t._onAppearCancelled,O=String(e.key),b=ve(n,e),I=re(),F=function(e,t){e&&u(e,r,x.TRANSITION_HOOK,t)},M=function(e,t){var n=t[1];F(e,t),m(e)?e.every((function(e){return e.length<=1}))&&n():e.length<=1&&n()},D={mode:o,persisted:c,beforeEnter:function(t){var r=I.isBacking?l:s;if(!n.isMounted){if(!a)return;r=I.isBacking?T||l:S||s}t._leaveCb&&t._leaveCb(!0);var o=b[O];o&&K(e,o)&&o.el._leaveCb&&o.el._leaveCb(),F(r,[t])},enter:function(e){var t=I.isBacking?v:f,r=p,o=I.isBacking?d:h;if(!n.isMounted){if(!a)return;t=I.isBacking?N||v:k||f,r=R||p,o=I.isBacking?P||d:L||h}var i=!1,u=e._enterCb=function(t){i||(i=!0,F(t?o:r,[e]),D.delayedLeave&&D.delayedLeave(),e._enterCb=void 0)};t?M(t,[e,u]):u()},leave:function(t,r){var a=String(e.key);if(t._enterCb&&t._enterCb(!0),n.isUnmounting)return r();F(y,[t]);var o=!1,i=t._leaveCb=function(n){o||(o=!0,r(),F(n?I.isBacking?g:C:A,[t]),t._leaveCb=void 0,b[a]===e&&delete b[a])};b[a]=e,_&&E?M(I.isBacking?E:_,[t,i]):i()},clone:function(e){return pe(e,t,n,r)}};return D}function he(e){if(U(e))return(e=_(e)).children=null,e}function de(e){return U(e)?e.children?m(e.children)?e.children[0]:e.children.default({key:"_placeholder"})[0]:void 0:e}function ye(e,t){e.shapeFlag&I.COMPONENT&&e.component?ye(e.component.subTree,t):e.shapeFlag&I.SUSPENSE?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function _e(e){for(var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2?arguments[2]:void 0,r=[],a=0,o=0;o<e.length;o++){var i=e[o],u=null==n?i.key:String(n)+String(null!=i.key?i.key:o);i.type===N?(i.patchFlag&Y.KEYED_FRAGMENT&&a++,r=r.concat(_e(i.children,t,u))):(t||i.type!==k)&&r.push(null!=u?_(i,{key:u}):i)}if(a>1)for(var c=0;c<r.length;c++)r[c].patchFlag=Y.BAIL;return r}var Ee="transition",me=function(e,t){var n=t.slots;return R(fe,function(e){var t={};for(var n in e)n in Ae||(t[n]=e[n]);if(!1===e.css)return t;var r=e.name,a=void 0===r?"v":r,o=e.type,i=e.duration,u=e.enterFromClass,c=void 0===u?"".concat(a,"-enter-from"):u,s=e.enterActiveClass,l=void 0===s?"".concat(a,"-enter-active"):s,f=e.enterToClass,v=void 0===f?"".concat(a,"-enter-to"):f,p=e.appearFromClass,h=void 0===p?c:p,d=e.appearActiveClass,y=void 0===d?l:d,_=e.appearToClass,E=void 0===_?v:_,m=e.leaveFromClass,A=void 0===m?"".concat(a,"-leave-from"):m,S=e.leaveActiveClass,T=void 0===S?"".concat(a,"-leave-active"):S,k=e.leaveToClass,N=void 0===k?"".concat(a,"-leave-to"):k,R=e.back_name,L=void 0===R?"v":R,P=(e.back_type,e.back_duration,e.back_enterFromClass),O=void 0===P?"".concat(L,"-enter-from"):P,b=e.back_enterActiveClass,I=void 0===b?"".concat(L,"-enter-active"):b,F=e.back_enterToClass,M=void 0===F?"".concat(L,"-enter-to"):F,D=e.back_appearFromClass,H=void 0===D?O:D,B=e.back_appearActiveClass,w=void 0===B?I:B,U=e.back_appearToClass,K=void 0===U?M:U,V=e.back_leaveFromClass,x=void 0===V?"".concat(L,"-leave-from"):V,Y=e.back_leaveActiveClass,G=void 0===Y?"".concat(L,"-leave-active"):Y,j=e.back_leaveToClass,W=void 0===j?"".concat(L,"-leave-to"):j,X=function(e){if(null==e)return null;if(g(e))return[Se(e.enter),Se(e.leave)];var t=Se(e);return[t,t]}(i),$=X&&X[0],q=X&&X[1],z=t.onBeforeEnter,J=t.onEnter,Q=t.onEnterCancelled,Z=t.onLeave,ee=t.onLeaveCancelled,te=t.onBeforeAppear,ne=void 0===te?z:te,re=t.onAppear,ae=void 0===re?J:re,oe=t.onAppearCancelled,ie=void 0===oe?Q:oe,ue=function(e,t,n){ke(e,t?E:v),ke(e,t?y:l),n&&n()},ce=function(e,t){e._isLeaving=!1,ke(e,A),ke(e,N),ke(e,T),t&&t()},se=function(e){return function(t,n){var r=e?ae:J,a=function(){return ue(t,e,n)};Ce(r,[t,a]),Ne((function(){ke(t,e?h:c),Te(t,e?E:v),ge(r)||Le(t,o,$,a)}))}},le=function(e,t){e._isLeaving=!1,ke(e,x),ke(e,W),ke(e,G),t&&t()},fe=function(e,t,n){ke(e,t?K:M),ke(e,t?w:I),n&&n()},ve=function(e){return function(t,n){var r=e?ae:J,a=function(){return fe(t,e,n)};Ce(r,[t,a]),Ne((function(){ke(t,e?H:O),Te(t,e?K:M),ge(r)||Le(t,o,$,a)}))}};return C(t,{onBeforeEnter:function(e){Ce(z,[e]),Te(e,c),Te(e,l)},_onBeforeEnter:function(e){Ce(z,[e]),Te(e,O),Te(e,I)},onBeforeAppear:function(e){Ce(ne,[e]),Te(e,h),Te(e,y)},_onBeforeAppear:function(e){Ce(ne,[e]),Te(e,H),Te(e,w)},_onEnter:ve(!1),_onAppear:ve(!0),onEnter:se(!1),onAppear:se(!0),onLeave:function(e,t){e._isLeaving=!0;var n=function(){return ce(e,t)};Te(e,A),be(),Te(e,T),Ne((function(){e._isLeaving&&(ke(e,A),Te(e,N),ge(Z)||Le(e,o,q,n))})),Ce(Z,[e,n])},_onLeave:function(e,t){e._isLeaving=!0;var n=function(){return le(e,t)};Te(e,x),be(),Te(e,G),Ne((function(){e._isLeaving&&(ke(e,x),Te(e,W),ge(Z)||Le(e,o,q,n))})),Ce(Z,[e,n])},onEnterCancelled:function(e){ue(e,!1),Ce(Q,[e])},_onEnterCancelled:function(e){fe(e,!1),Ce(Q,[e])},onAppearCancelled:function(e){ue(e,!0),Ce(ie,[e])},_onAppearCancelled:function(e){fe(e,!0),Ce(ie,[e])},onLeaveCancelled:function(e){ce(e),Ce(ee,[e])},_onLeaveCancelled:function(e){le(e),Ce(ee,[e])}})}(e),n)};me.displayName="SkTransition";var Ae={name:String,back_name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};me.props=C({},fe.props,Ae);var Ce=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];m(e)?e.forEach((function(e){return e.apply(void 0,a(t))})):e&&e.apply(void 0,a(t))},ge=function(e){return!!e&&(m(e)?e.some((function(e){return e.length>1})):e.length>1)};function Se(e){var t=S(e);return function(e){"number"!=typeof e?L("<transition> explicit duration is not a valid number - "+"got ".concat(JSON.stringify(e),".")):isNaN(e)&&L("<transition> explicit duration is NaN - the duration expression might be incorrect.")}(t),t}function Te(e,t){t.split(/\s+/).forEach((function(t){return t&&e.classList.add(t)})),(e._vtc||(e._vtc=new Set)).add(t)}function ke(e,t){t.split(/\s+/).forEach((function(t){return t&&e.classList.remove(t)}));var n=e._vtc;n&&(n.delete(t),n.size||(e._vtc=void 0))}function Ne(e){requestAnimationFrame((function(){requestAnimationFrame(e)}))}var Re=0;function Le(e,t,n,r){var a=e._endId=++Re,o=function(){a===e._endId&&r()};if(n)return setTimeout(o,n);var i=function(e,t){var n=window.getComputedStyle(e),r=function(e){return(n[e]||"").split(", ")},a=r("transitionDelay"),o=r("transitionDuration"),i=Pe(a,o),u=r("animationDelay"),c=r("animationDuration"),s=Pe(u,c),l=null,f=0,v=0;t===Ee?i>0&&(l=Ee,f=i,v=o.length):"animation"===t?s>0&&(l="animation",f=s,v=c.length):v=(l=(f=Math.max(i,s))>0?i>s?Ee:"animation":null)?l===Ee?o.length:c.length:0;var p=l===Ee&&/\b(transform|all)(,|$)/.test(n.transitionProperty);return{type:l,timeout:f,propCount:v,hasTransform:p}}(e,t),u=i.type,c=i.timeout,s=i.propCount;if(!u)return r();var l=u+"end",f=0,v=function(){e.removeEventListener(l,p),o()},p=function(t){t.target===e&&++f>=s&&v()};setTimeout((function(){f<s&&v()}),c+1),e.addEventListener(l,p)}function Pe(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max.apply(Math,a(t.map((function(t,n){return Oe(t)+Oe(e[n])}))))}function Oe(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function be(){return document.body.offsetHeight}var Ie={StackKeepAlive:ie,Transition:me},Fe={install:function(e){for(var t in Ie)if(Ie.hasOwnProperty(t)){var n=Ie[t];e.component(n.displayName||n.name,n)}},ATransition:me};export{Fe as default};
