function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { callWithAsyncErrorHandling, queuePostFlushCb, nextTick, getCurrentInstance, watch, onMounted, onUpdated, onBeforeUnmount, warn, isVNode, cloneVNode, setTransitionHooks as setTransitionHooks$1 } from 'vue';
import { isArray, isString, extend, isObject, toNumber } from '@vue/shared';
import { useRouter } from 'vue-router';
import { Comment, Fragment, h, warn as warn$1 } from '@vue/runtime-core';
import { toRaw } from '@vue/reactivity';

var _ShapeFlags;

(function (ShapeFlags) {
  ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags[ShapeFlags["FUNCTIONAL_COMPONENT"] = 2] = "FUNCTIONAL_COMPONENT";
  ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
  ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
  ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
  ShapeFlags[ShapeFlags["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
  ShapeFlags[ShapeFlags["TELEPORT"] = 64] = "TELEPORT";
  ShapeFlags[ShapeFlags["SUSPENSE"] = 128] = "SUSPENSE";
  ShapeFlags[ShapeFlags["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
  ShapeFlags[ShapeFlags["COMPONENT_KEPT_ALIVE"] = 512] = "COMPONENT_KEPT_ALIVE";
  ShapeFlags[ShapeFlags["COMPONENT"] = 6] = "COMPONENT";
})(_ShapeFlags || (_ShapeFlags = {}));

var ShapeFlags$1 = _ShapeFlags;

var isDef = function isDef(v) {
  return v !== undefined && v !== null;
};

var PLACEHOLDER_VM = {
  __placeholder: true
};

var currentPathOf = function currentPathOf(router) {
  return router.currentRoute._value.path;
};

var resolvePushedVm = function resolvePushedVm(current) {
  return isDef(current) ? current : PLACEHOLDER_VM;
};

var isPlaceHolderVm = function isPlaceHolderVm(vm) {
  return vm && !!vm.__placeholder;
};

var getStateId = function getStateId() {
  var state = getCurrentState();
  return isDef(state) ? state.id : undefined;
};

var getCurrentState = function getCurrentState() {
  return history.state;
};

var genKey = function genKey(num, router) {
  var routeTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  // return `keep-alive-vnode-key-${Number(num)}-`;
  return "keep-alive-vnode-key-".concat(Number(num), "-").concat(routeTo ? routeTo : currentPathOf(router));
};

var genSingletonKey = function genSingletonKey(router) {
  var routeTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return "keep-alive-vnode-key-singleton-".concat(routeTo ? routeTo : currentPathOf(router));
};

var isSingletonNode = function isSingletonNode(vnode) {
  return vnode && vnode.key.startsWith('keep-alive-vnode-key-singleton-');
};

var getCurrentVM = function getCurrentVM(router) {
  var _router$currentRoute, _router$currentRoute$, _router$currentRoute$2, _router$currentRoute$3, _router$currentRoute$4;

  return (router === null || router === void 0 ? void 0 : (_router$currentRoute = router.currentRoute) === null || _router$currentRoute === void 0 ? void 0 : (_router$currentRoute$ = _router$currentRoute._value) === null || _router$currentRoute$ === void 0 ? void 0 : (_router$currentRoute$2 = _router$currentRoute$.matched) === null || _router$currentRoute$2 === void 0 ? void 0 : _router$currentRoute$2.length) > 0 ? (_router$currentRoute$3 = router.currentRoute._value.matched[0].instances) === null || _router$currentRoute$3 === void 0 ? void 0 : (_router$currentRoute$4 = _router$currentRoute$3["default"]) === null || _router$currentRoute$4 === void 0 ? void 0 : _router$currentRoute$4.$ : undefined;
};

var replaceState = function replaceState(mode, router, id) {
  var _window$location = window.location,
      pathname = _window$location.pathname,
      search = _window$location.search,
      hash = _window$location.hash;
  var path = "".concat(pathname).concat(search).concat(hash);
  var state = isDef(history.state) ? history.state : {};
  state['id'] = id; // optimize file:// URL

  var isFilSys = window.location.href.startsWith('file://');
  history.replaceState(state, '', isFilSys ? null : path);
};

var isKeepAlive = function isKeepAlive(vnode) {
  return vnode.type.__isKeepAlive;
}; // export const Comment = Symbol(true ? 'Comment' : undefined)
// export const Fragment = Symbol(true ? 'Fragment' : undefined)


function isSameVNodeType(n1, n2) {
  if (n2.shapeFlag & ShapeFlags$1.COMPONENT) {
    // HMR only: if the component has been hot-updated, force a reload.
    return false;
  }

  return n1.type === n2.type && n1.key === n2.key;
}

var _ErrorCodes;

(function (ErrorCodes) {
  ErrorCodes[ErrorCodes["SETUP_FUNCTION"] = 0] = "SETUP_FUNCTION";
  ErrorCodes[ErrorCodes["RENDER_FUNCTION"] = 1] = "RENDER_FUNCTION";
  ErrorCodes[ErrorCodes["WATCH_GETTER"] = 2] = "WATCH_GETTER";
  ErrorCodes[ErrorCodes["WATCH_CALLBACK"] = 3] = "WATCH_CALLBACK";
  ErrorCodes[ErrorCodes["WATCH_CLEANUP"] = 4] = "WATCH_CLEANUP";
  ErrorCodes[ErrorCodes["NATIVE_EVENT_HANDLER"] = 5] = "NATIVE_EVENT_HANDLER";
  ErrorCodes[ErrorCodes["COMPONENT_EVENT_HANDLER"] = 6] = "COMPONENT_EVENT_HANDLER";
  ErrorCodes[ErrorCodes["VNODE_HOOK"] = 7] = "VNODE_HOOK";
  ErrorCodes[ErrorCodes["DIRECTIVE_HOOK"] = 8] = "DIRECTIVE_HOOK";
  ErrorCodes[ErrorCodes["TRANSITION_HOOK"] = 9] = "TRANSITION_HOOK";
  ErrorCodes[ErrorCodes["APP_ERROR_HANDLER"] = 10] = "APP_ERROR_HANDLER";
  ErrorCodes[ErrorCodes["APP_WARN_HANDLER"] = 11] = "APP_WARN_HANDLER";
  ErrorCodes[ErrorCodes["FUNCTION_REF"] = 12] = "FUNCTION_REF";
  ErrorCodes[ErrorCodes["ASYNC_COMPONENT_LOADER"] = 13] = "ASYNC_COMPONENT_LOADER";
  ErrorCodes[ErrorCodes["SCHEDULER"] = 14] = "SCHEDULER";
})(_ErrorCodes || (_ErrorCodes = {}));

var ErrorCodes = _ErrorCodes;

var _PatchFlags;

(function (PatchFlags) {
  PatchFlags[PatchFlags["TEXT"] = 1] = "TEXT";
  PatchFlags[PatchFlags["CLASS"] = 2] = "CLASS";
  PatchFlags[PatchFlags["STYLE"] = 4] = "STYLE";
  PatchFlags[PatchFlags["PROPS"] = 8] = "PROPS";
  PatchFlags[PatchFlags["FULL_PROPS"] = 16] = "FULL_PROPS";
  PatchFlags[PatchFlags["HYDRATE_EVENTS"] = 32] = "HYDRATE_EVENTS";
  PatchFlags[PatchFlags["STABLE_FRAGMENT"] = 64] = "STABLE_FRAGMENT";
  PatchFlags[PatchFlags["KEYED_FRAGMENT"] = 128] = "KEYED_FRAGMENT";
  PatchFlags[PatchFlags["UNKEYED_FRAGMENT"] = 256] = "UNKEYED_FRAGMENT";
  PatchFlags[PatchFlags["NEED_PATCH"] = 512] = "NEED_PATCH";
  PatchFlags[PatchFlags["DYNAMIC_SLOTS"] = 1024] = "DYNAMIC_SLOTS";
  PatchFlags[PatchFlags["DEV_ROOT_FRAGMENT"] = 2048] = "DEV_ROOT_FRAGMENT";
  PatchFlags[PatchFlags["HOISTED"] = -1] = "HOISTED";
  PatchFlags[PatchFlags["BAIL"] = -2] = "BAIL";
})(_PatchFlags || (_PatchFlags = {}));

var PatchFlags = _PatchFlags;
var ShapeFlags = {
  ELEMENT: 1,
  FUNCTIONAL_COMPONENT: 1 << 1,
  STATEFUL_COMPONENT: 1 << 2,
  TEXT_CHILDREN: 1 << 3,
  ARRAY_CHILDREN: 1 << 4,
  SLOTS_CHILDREN: 1 << 5,
  TELEPORT: 1 << 6,
  SUSPENSE: 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE: 1 << 8,
  COMPONENT_KEPT_ALIVE: 1 << 9,
  COMPONENT: 1 << 1 | 1 << 2
};

var isFunction = function isFunction(val) {
  return typeof val === 'function';
};

var invokeArrayFns = function invokeArrayFns(fns) {
  var arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  for (var i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};

function getComponentName(Component) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name;
}

var VNODE_HOOK = 7;

function invokeVNodeHook(hook, instance, vnode) {
  var prevVNode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  callWithAsyncErrorHandling(hook, instance, VNODE_HOOK, [vnode, prevVNode]);
}

var MoveType = {
  ENTER: 0,
  LEAVE: 1,
  REORDER: 2
};

function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      var _suspense$effects;

      (_suspense$effects = suspense.effects).push.apply(_suspense$effects, _toConsumableArray(fn));
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}

var queuePostRenderEffect = queueEffectWithSuspense;

var isAsyncWrapper = function isAsyncWrapper(i) {
  return !!i.__asyncLoader;
};

var HistoryStack = /*#__PURE__*/function () {
  function HistoryStack(destroyCache) {
    _classCallCheck(this, HistoryStack);

    this.historyStackMap = [];
    this.destroyCache = destroyCache;
  }

  _createClass(HistoryStack, [{
    key: "push",
    value: function push(vm, index) {
      var stack = this.historyStackMap[index];

      if (Array.isArray(stack)) {
        !stack.includes(vm) && stack.push(vm);
        this.historyStackMap[index] = stack.filter(function (item) {
          return !item._isDestroyed;
        });
      } else {
        var vms = [];
        vms.push(vm);
        this.historyStackMap[index] = vms;
      }
    }
  }, {
    key: "pop",
    value: function pop() {
      var _this = this;

      var onlyLastOne = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var last = this.historyStackMap.pop();

      if (Array.isArray(last)) {
        if (onlyLastOne) {
          var vm = last.pop();
          vm && this.destroyCache(vm);
        } else {
          last.forEach(function (vm) {
            return vm && _this.destroyCache(vm);
          });
        }
      }
    }
  }, {
    key: "removeGreater",
    value: function removeGreater(index) {
      while (this.historyStackMap.length >= index) {
        this.pop();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.historyStackMap = [];
    }
  }]);

  return HistoryStack;
}();

var RouterHacker = /*#__PURE__*/function () {
  function RouterHacker(router) {
    _classCallCheck(this, RouterHacker);

    this.router = router;
  }

  _createClass(RouterHacker, [{
    key: "beforeReplace",
    value: function beforeReplace(cb, onerror) {
      var router = this.router;
      var rtmp = router.replace;

      var rtmpf = function rtmpf(location, onComplete, onAbort) {
        cb(location);
        rtmp.call(router, location, onComplete, function (e) {
          onerror();
          isDef(onAbort) && onAbort(e);
        });
      };

      router.replace = function (location, onComplete, onAbort) {
        rtmpf(location, onComplete, onAbort);
      };

      return this;
    }
  }, {
    key: "beforeGo",
    value: function beforeGo(cb) {
      var router = this.router;
      var gstmp = router.go;

      var gstmpf = function gstmpf(number) {
        cb(number);
        return gstmp.call(router, number);
      };

      router.go = function (num) {
        return gstmpf(num);
      };

      return this;
    }
  }, {
    key: "beforePush",
    value: function beforePush(cb) {
      var router = this.router;
      var pstmp = router.push;

      var pstmpf = function pstmpf(location, onComplete, onAbort) {
        cb();

        if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
          return pstmp.call(router, location, onComplete, onAbort);
        } else {
          pstmp.call(router, location, onComplete, onAbort);
        }
      };

      router.push = function (location, onComplete, onAbort) {
        return pstmpf(location, onComplete, onAbort);
      };

      return this;
    }
  }]);

  return RouterHacker;
}();

function hackHistory(history) {
  var rstmp = history.replaceState;

  history.replaceState = function (state, op, path) {
    var old = Object.assign({}, history.state);
    var s = Object.assign(old, state);
    rstmp.call(history, s, op, path);
  };

  var historyPushState = history.pushState;

  history.pushState = function (state, op, path) {
    var old = Object.assign({}, history.state);
    var s = Object.assign(old, state);
    historyPushState.call(history, s, op, path);
  };
}

var _core$1;

var SingleCore = function SingleCore(args) {
  if (!_core$1) {
    _core$1 = new Core();
  }

  if (args) {
    _core$1.setup(args);
  }

  return _core$1;
};

var Core = /*#__PURE__*/function () {
  function Core() {
    _classCallCheck(this, Core);
  }

  _createClass(Core, [{
    key: "setup",
    value: function setup(_ref) {
      var _this2 = this;

      var router = _ref.router,
          pruneCacheEntry = _ref.pruneCacheEntry,
          replaceStay = _ref.replaceStay,
          singleton = _ref.singleton;
      hackHistory(history);
      this.destroyCaches = pruneCacheEntry;
      this.router = router;
      this.router._stack = 0;
      this.mode = router.mode; // hash or history

      this.historyShouldChange = false;
      this.isReplace = false;
      this.replacePrePath = undefined;
      this.preStateId = 0;
      this.pre = null;
      this.replaceStay = replaceStay || [];
      this.singleton = singleton || []; // 单例页面

      this._initial = true; //闲置状态

      this.historyStack = new HistoryStack(function (_vm) {
        if (_vm) {
          if (_vm.vnode.key && !isSingletonNode(_vm.vnode)) {
            _this2.destroyCaches(_vm.vnode.key);
          }
        }
      });
      this.init(); // expose this core

      this.router.__core = this;
      this._routeTo = undefined; // this.isBacking = false
    }
  }, {
    key: "isBacking",
    get: function get() {
      // console.log(history.state)
      // console.log(from.fullPath)
      // console.log(from.fullPath)
      return !(this.isPush || this.isReplace); // return from ? getStateForward() === from.fullPath : false
    }
  }, {
    key: "init",
    value: function init() {
      this.initStackPointer();
      this.routerHooks();
      this.hackRouter();
    }
  }, {
    key: "initStackPointer",
    value: function initStackPointer() {
      var currentStateId = getStateId();

      if (isDef(currentStateId)) {
        this.setStackPointer(currentStateId);
      } else {
        this.setState(0);
      }
    }
    /**
     * to fix the first time inital Render with path like "/",
     */

  }, {
    key: "genInitialKeyNextTime",
    value: function genInitialKeyNextTime() {
      this._initial = true;
    }
    /**
     * 
     * @returns generator for the vnode key of keep-alive slots
     */

  }, {
    key: "genKeyForVnode",
    value: function genKeyForVnode() {
      var _this3 = this;

      var router = this.router; // console.log('genKey- isPush',this.isPush)
      // console.log('genKey- isReplace_initial',this.isReplace || this._initial)

      var _genKey = function _genKey(num, router, to) {
        return to && _this3.singleton.includes(to) ? genSingletonKey(router, to) : genKey(num, router, to);
      };

      if (this.isReplace || this._initial) {
        this._initial = false;
        return _genKey(this.stackPointer, router, this._routeTo);
      } else if (this.isPush) {
        return _genKey(this.stackPointer + 1, router, this._routeTo);
      } else {
        return _genKey(this.stackPointer - 1, router, this._routeTo);
      }
    }
    /**
     * use afterEach hook to set state.key and add the reference of vm to the historyStack
     */

  }, {
    key: "routerHooks",
    value: function routerHooks() {
      var _this4 = this;

      var router = this.router;
      router.beforeEach(function (to, from, next) {
        if (_this4.singleton.includes(to.path) && to.path === from.path) {
          console.warn('警告 [stack-keep-alive]: 单例模式的页面不支持从自身重复路由');
          console.warn('warning [stack-keep-alive]: the singleton component doesn`t support route to from itself');
          return;
        }

        _this4._routeTo = to.path;
        next();
      });
      router.afterEach(function (to, from) {
        _this4.historyShouldChange = true; // get the vm instance after render

        nextTick(function () {
          var current = _this4.currentVm;
          var pendingToPushVm = resolvePushedVm(current);

          if (_this4.pre === null) {
            _this4.onInitial(pendingToPushVm);
          } else if (_this4.isReplace) {
            _this4.onReplace(pendingToPushVm);
          } else if (_this4.isPush) {
            _this4.onPush(pendingToPushVm);
          } else {
            _this4.onBack(pendingToPushVm);
          } // console.log(current)


          _this4.pre = current; // this.SetIdle(true)

          _this4.preStateId = _this4.stackPointer;

          if (!isPlaceHolderVm(pendingToPushVm)) {
            _this4.historyShouldChange = false;
          }
        });
      });
    }
    /**
     * @description hack router go , replace and push functions to tell replace from back and push
     */

  }, {
    key: "hackRouter",
    value: function hackRouter() {
      var _this5 = this;

      this._hackRouter = new RouterHacker(this.router);

      this._hackRouter.beforeReplace(function () {
        _this5.isReplace = true;
        _this5.replacePrePath = currentPathOf(_this5.router);
      }, function (e) {
        _this5.isReplace = false;
        _this5.replacePrePath = undefined;
      }).beforeGo(function (num) {
        _this5.isReplace = false;
      }).beforePush(function () {
        _this5.isReplace = false;
      });
    }
  }, {
    key: "onInitial",
    value: function onInitial(vm) {
      this.historyStack.push(vm, this.stackPointer);
    }
  }, {
    key: "onPush",
    value: function onPush(vm) {
      var _this$pre, _this$pre$$clearParen;

      this.setState(this.increaseStackPointer());
      this.historyStack.push(vm, this.stackPointer);
      (_this$pre = this.pre) === null || _this$pre === void 0 ? void 0 : (_this$pre$$clearParen = _this$pre.$clearParent) === null || _this$pre$$clearParen === void 0 ? void 0 : _this$pre$$clearParen.call(_this$pre, vm);
      this.pre = null;
    }
  }, {
    key: "onBack",
    value: function onBack(vm) {
      this.historyStack.pop();
      this.decreaseStackPointer();
      this.historyStack.push(vm, this.stackPointer);
    }
  }, {
    key: "onReplace",
    value: function onReplace(vm) {
      // avoidReplaceQuery is fix the issue : router.replace only a query by same path, may cause error
      var avoidReplaceQuery = this.replacePrePath === currentPathOf(this.router);
      var shouldDestroy = !(isDef(this.replacePrePath) && this.replaceStay.includes(this.replacePrePath)) && !avoidReplaceQuery;

      if (shouldDestroy) {
        // this.destroyCaches(this.pre.vnode.key)
        this.historyStack.pop(true);
      }

      this.pre = null;
      this.setState(this.stackPointer);
      this.historyStack.push(vm, this.stackPointer);
      this.isReplace = false;
      this.replacePrePath = undefined;
    }
  }, {
    key: "currentVm",
    get: function get() {
      return getCurrentVM(this.router);
    }
  }, {
    key: "isPush",
    get: function get() {
      if (!this.isReplace) {
        var stateId = getStateId();
        var v = !isDef(stateId) || this.preStateId <= stateId;
        return v;
      }

      return false;
    }
  }, {
    key: "stackPointer",
    get: function get() {
      return this.router._stack;
    }
  }, {
    key: "setStackPointer",
    value: function setStackPointer(val) {
      this.router._stack = val;
    }
  }, {
    key: "setState",
    value: function setState(id) {
      this.setStackPointer(id);
      replaceState(this.mode, this.router, id);
    }
  }, {
    key: "increaseStackPointer",
    value: function increaseStackPointer() {
      return this.router._stack += 1;
    }
  }, {
    key: "decreaseStackPointer",
    value: function decreaseStackPointer() {
      return this.router._stack -= 1;
    }
  }]);

  return Core;
}(); // vnode 生成key
// 提供根据key清除cache的方法


var _core = null;
var StackKeepAliveImpl = {
  name: "StackKeepAlive",
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number],
    replaceStay: [Array],
    singleton: [Array],
    mode: String
  },
  setup: function setup(props, _ref2) {
    var slots = _ref2.slots;
    var instance = getCurrentInstance(); // KeepAlive communicates with the instantiated renderer via the
    // ctx where the renderer passes in its internals,
    // and the KeepAlive instance exposes activate/deactivate implementations.
    // The whole point of this is to avoid importing KeepAlive directly in the
    // renderer to facilitate tree-shaking.

    var sharedContext = instance.ctx; // if the internal renderer is not registered, it indicates that this is server-side rendering,
    // for KeepAlive, we just need to render its children

    if (!sharedContext.renderer) {
      return slots["default"];
    }

    var cache = new Map();
    var keys = new Set();
    var current = null;
    {
      window.__v_cache = instance.__v_cache = cache;
    }
    var parentSuspense = instance.suspense;
    var _sharedContext$render = sharedContext.renderer,
        patch = _sharedContext$render.p,
        move = _sharedContext$render.m,
        _unmount = _sharedContext$render.um,
        createElement = _sharedContext$render.o.createElement;
    var storageContainer = createElement('div');

    sharedContext.activate = function (vnode, container, anchor, isSVG, optimized) {
      // debugger
      var instance = vnode.component;
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense); // in case props have changed
      // patch(
      //   instance.vnode,
      //   vnode,
      //   container,
      //   anchor,
      //   instance,
      //   parentSuspense,
      //   isSVG,
      //   vnode.slotScopeIds,
      //   optimized
      // )

      queuePostRenderEffect(function () {
        instance.isDeactivated = false;

        if (instance.a) {
          invokeArrayFns(instance.a);
        }

        var vnodeHook = vnode.props && vnode.props.onVnodeMounted;

        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
      }, parentSuspense);
    };

    sharedContext.deactivate = function (vnode) {
      var instance = vnode.component;
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense);
      queuePostRenderEffect(function () {
        if (instance.da) {
          invokeArrayFns(instance.da);
        }

        var vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;

        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }

        instance.isDeactivated = true;
      }, parentSuspense);
    };

    function unmount(vnode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode);

      _unmount(vnode, instance, parentSuspense, true);
    }

    function pruneCache(filter) {
      cache.forEach(function (vnode, key) {
        var name = getComponentName(vnode.type);

        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }

    function pruneCacheEntry(key) {
      var cached = cache.get(key);

      if (current.key === key) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current);
      } else if (current) {
        unmount(cached);
      }

      cache["delete"](key);
      keys["delete"](key);
    } // core


    var router;
    {
      router = useRouter();
    }

    if (!router) {
      throw new Error("router is not found! In unit test mode ,router is got from gloabl.router, otherwise VueRouter.useRouter()");
    } // debugger


    _core = SingleCore({
      router: router,
      pruneCacheEntry: pruneCacheEntry,
      replaceStay: props.replaceStay,
      singleton: props.singleton
    });
    {
      window.__core = _core;
    } // prune cache on include/exclude prop change

    watch(function () {
      return [props.include, props.exclude];
    }, function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          include = _ref4[0],
          exclude = _ref4[1];

      include && pruneCache(function (name) {
        return matches(include, name);
      });
      exclude && pruneCache(function (name) {
        return !matches(exclude, name);
      });
    }, // prune post-render after `current` has been updated
    {
      flush: 'post',
      deep: true
    }); // cache sub tree after render

    var pendingCacheKey = null;

    var cacheSubtree = function cacheSubtree() {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };

    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(function () {
      cache.forEach(function (cached) {
        var subTree = instance.subTree,
            suspense = instance.suspense;
        var vnode = getInnerChild(subTree);

        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode); // but invoke its deactivated hook here

          var da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }

        unmount(cached);
      });
    });
    return function () {
      pendingCacheKey = null;

      if (!slots["default"]) {
        return null;
      } // generate a specific key for every vnode


      var _key = _core.genKeyForVnode();

      var children = slots["default"]({
        'key': _key
      });
      var rawVNode = children[0];

      if (instance.vnode) {
        instance.vnode.__oldChild = children[0];
      }

      if (children.length > 1) {
        {
          warn("KeepAlive should contain exactly one component child.");
        }
        current = null;

        _core.genInitialKeyNextTime();

        return children;
      } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) && !(rawVNode.shapeFlag === ShapeFlags.SUSPENSE)) {
        _core.genInitialKeyNextTime();

        current = null;
        return rawVNode;
      }

      var vnode = getInnerChild(rawVNode);
      var comp = vnode.type; // for async components, name check should be based in its loaded
      // inner component if available

      var name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
      var include = props.include,
          exclude = props.exclude,
          max = props.max;

      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
        current = vnode;
        return rawVNode;
      }

      var key = vnode.key == null ? comp : vnode.key;
      var cachedVNode = cache.get(key); // clone vnode if it's reused because we are going to mutate it

      if (vnode.el) {
        vnode = cloneVNode(vnode);

        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode;
        }
      } // #1513 it's possible for the returned vnode to be cloned due to attr
      // fallthrough or scopeId, so the vnode here may not be the final vnode
      // that is mounted. Instead of caching it directly, we store the pending
      // key and cache `instance.subTree` (the normalized vnode) in
      // beforeMount/beforeUpdate hooks.


      pendingCacheKey = key;

      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;

        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks$1(vnode, vnode.transition);
        } // avoid vnode being mounted as fresh


        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE; // make this key the freshest

        keys["delete"](key);
        keys.add(key);
      } else {
        keys.add(key); // prune oldest entry

        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      } // avoid vnode being unmounted


      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
      current = vnode;
      return rawVNode;
    };
  }
};
var StackKeepAlive = StackKeepAliveImpl;

function matches(pattern, name) {
  if (isArray(pattern)) {
    return pattern.some(function (p) {
      return matches(p, name);
    });
  } else if (isString(pattern)) {
    return pattern.split(',').includes(name);
  } else if (pattern.test) {
    return pattern.test(name);
  }
  /* istanbul ignore next */


  return false;
}

function resetShapeFlag(vnode) {
  if (!vnode) return;
  var shapeFlag = vnode.shapeFlag;

  if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
  }

  if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
  }

  vnode.shapeFlag = shapeFlag;
}

function getInnerChild(vnode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent : vnode;
} // import { Comment, isSameVNodeType, Fragment } from "../vnode"


function useTransitionState() {
  var state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  };
  onMounted(function () {
    state.isMounted = true;
  });
  onBeforeUnmount(function () {
    state.isUnmounting = true;
  });
  return state;
}

var PLACEHOLDER = '_placeholder';
var TransitionHookValidator = [Function, Array];
var BaseTransitionImpl = {
  name: "BaseTransition",
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    _onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    _onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    _onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    _onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    _onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    _onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    _onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator,
    _onAppearCancelled: TransitionHookValidator
  },
  setup: function setup(props, _ref5) {
    var slots = _ref5.slots;
    var instance = getCurrentInstance();
    var state = useTransitionState();
    var prevTransitionKey;
    return function () {
      var children = slots["default"] && getTransitionRawChildren(slots["default"](), true);

      if (!children || !children.length) {
        return;
      }

      var child = children[0];

      if (children.length > 1) {
        var hasFound = false; // locate first non-comment child

        var _iterator = _createForOfIteratorHelper(children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var c = _step.value;

            if (c.type !== Comment) {
              if (hasFound) {
                // warn more than one non-comment child
                warn("<transition> can only be used on a single element or component. " + "Use <transition-group> for lists.");
                break;
              }

              child = c;
              hasFound = true;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } // fix enter issue
      // debugger


      if (child && child.type && child.type.name && child.type.name === 'StackKeepAlive') {
        child.__id = Math.floor(Math.random() * 1000);
        console.log(child);
        child._R; // let now = null

        var _child = new Proxy(child.children, {
          get: function get(target, property, receiver) {
            if (property == 'default') {
              // if (now) {
              //   return now
              // }
              var pre = Reflect.get(target, property, receiver);

              var now = function _now(arg) {
                var res = pre(arg);

                if (child._R && !child._R.reused) {
                  if (arg.key !== PLACEHOLDER) {
                    child._R[0].key = arg.key;
                    child._R[0].props.key = arg.key;
                    child._R.reused = true;
                  }

                  return child._R;
                }

                if (res[0].type !== Comment) {
                  child._R = res;
                }

                console.log('get');
                return res;
              };

              return now;
            }

            return Reflect.get(target, property, receiver);
          }
        });

        child.children = _child;
      } // there's no need to track reactivity for these props so use the raw
      // props for a bit better perf


      var rawProps = toRaw(props);
      var mode = rawProps.mode; // check mode

      if (mode && mode !== "in-out" && mode !== "out-in" && mode !== "default") {
        warn("invalid <transition> mode: ".concat(mode));
      }

      if (state.isLeaving) {
        return emptyPlaceholder(child);
      } // in the case of <transition><keep-alive/></transition>, we need to
      // compare the type of the kept-alive children.


      var innerChild = getKeepAliveChild(child);

      if (!innerChild) {
        return emptyPlaceholder(child);
      }

      var enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      var oldChild = instance.subTree;
      var oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      var transitionKeyChanged = false;
      var getTransitionKey = innerChild.type.getTransitionKey;

      if (getTransitionKey) {
        var key = getTransitionKey();

        if (prevTransitionKey === undefined) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      } // handle mode


      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        var leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance); // update old tree's hooks in case of dynamic transition

        setTransitionHooks(oldInnerChild, leavingHooks); // switching between different views

        if (mode === "out-in") {
          state.isLeaving = true; // return placeholder node and queue update when leave finishes

          leavingHooks.afterLeave = function () {
            state.isLeaving = false;
            instance.update();
          }; // setTimeout(()=>{
          //   state.isLeaving = false
          //   instance.update()
          // },200)


          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = function (el, earlyRemove, delayedLeave) {
            var leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild; // early removal callback

            el._leaveCb = function () {
              earlyRemove();
              el._leaveCb = undefined;
              delete enterHooks.delayedLeave;
            };

            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }

      return child;
    };
  }
}; // export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files

var BaseTransition = BaseTransitionImpl;

function getLeavingNodesForType(state, vnode) {
  var leavingVNodes = state.leavingVNodes;
  var leavingVNodesCache = leavingVNodes.get(vnode.type);

  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }

  return leavingVNodesCache;
} // The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.


function resolveTransitionHooks(vnode, props, state, instance) {
  var appear = props.appear,
      mode = props.mode,
      _props$persisted = props.persisted,
      persisted = _props$persisted === void 0 ? false : _props$persisted,
      onBeforeEnter = props.onBeforeEnter,
      _onBeforeEnter = props._onBeforeEnter,
      onEnter = props.onEnter,
      _onEnter = props._onEnter,
      onAfterEnter = props.onAfterEnter,
      onEnterCancelled = props.onEnterCancelled,
      _onEnterCancelled = props._onEnterCancelled,
      onBeforeLeave = props.onBeforeLeave,
      _onBeforeLeave = props._onBeforeLeave,
      onLeave = props.onLeave,
      _onLeave = props._onLeave,
      onAfterLeave = props.onAfterLeave,
      onLeaveCancelled = props.onLeaveCancelled,
      _onLeaveCancelled = props._onLeaveCancelled,
      onBeforeAppear = props.onBeforeAppear,
      _onBeforeAppear = props._onBeforeAppear,
      onAppear = props.onAppear,
      _onAppear = props._onAppear,
      onAfterAppear = props.onAfterAppear,
      onAppearCancelled = props.onAppearCancelled,
      _onAppearCancelled = props._onAppearCancelled;
  var key = String(vnode.key);
  var leavingVNodesCache = getLeavingNodesForType(state, vnode);

  var _core = SingleCore();

  var callHook = function callHook(hook, args) {
    hook && callWithAsyncErrorHandling(hook, instance, ErrorCodes.TRANSITION_HOOK, args);
  };

  var callAsyncHook = function callAsyncHook(hook, args) {
    var done = args[1];
    callHook(hook, args);

    if (isArray(hook)) {
      if (hook.every(function (hook) {
        return hook.length <= 1;
      })) done();
    } else if (hook.length <= 1) {
      done();
    }
  };

  var hooks = {
    mode: mode,
    persisted: persisted,
    beforeEnter: function beforeEnter(el) {
      // debugger
      var hook = _core.isBacking ? _onBeforeEnter : onBeforeEnter;

      if (!state.isMounted) {
        if (appear) {
          hook = _core.isBacking ? _onBeforeAppear || _onBeforeEnter : onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      } // for same element (v-show)


      if (el._leaveCb) {
        el._leaveCb(true
        /* cancelled */
        );
      } // for toggled element with same key (v-if)


      var leavingVNode = leavingVNodesCache[key];

      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        // force early removal (not cancelled)
        leavingVNode.el._leaveCb();
      }

      callHook(hook, [el]);
    },
    enter: function enter(el) {
      var hook = _core.isBacking ? _onEnter : onEnter;
      var afterHook = onAfterEnter;
      var cancelHook = _core.isBacking ? _onEnterCancelled : onEnterCancelled;

      if (!state.isMounted) {
        if (appear) {
          hook = _core.isBacking ? _onAppear || _onEnter : onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = _core.isBacking ? _onAppearCancelled || _onEnterCancelled : onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }

      var called = false;

      var done = el._enterCb = function (cancelled) {
        if (called) return;
        called = true;

        if (cancelled) {
          callHook(cancelHook, [el]);
        } else {
          callHook(afterHook, [el]);
        }

        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }

        el._enterCb = undefined;
      };

      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave: function leave(el, remove) {
      var key = String(vnode.key);

      if (el._enterCb) {
        el._enterCb(true
        /* cancelled */
        );
      }

      if (state.isUnmounting) {
        return remove();
      }

      callHook(onBeforeLeave, [el]);
      var called = false;

      var done = el._leaveCb = function (cancelled) {
        if (called) return;
        called = true;
        remove();

        if (cancelled) {
          callHook(_core.isBacking ? _onLeaveCancelled : onLeaveCancelled, [el]);
        } else {
          callHook(onAfterLeave, [el]);
        }

        el._leaveCb = undefined;

        if (leavingVNodesCache[key] === vnode) {
          delete leavingVNodesCache[key];
        }
      };

      leavingVNodesCache[key] = vnode;

      if (onLeave && _onLeave) {
        callAsyncHook(_core.isBacking ? _onLeave : onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone: function clone(vnode) {
      return resolveTransitionHooks(vnode, props, state, instance);
    }
  };
  return hooks;
} // the placeholder really only handles one special case: KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being
// unmounted.


function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}

function getKeepAliveChild(vnode) {
  //   const oldChild = vnode.__oldChild
  //   if (oldChild) { 
  //       return oldChild
  //   }
  // // debugger
  return isKeepAlive(vnode) ? vnode.children ? isArray(vnode.children) ? vnode.children[0] : vnode.children["default"]({
    key: PLACEHOLDER
  })[0] : undefined : vnode;
}

function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & ShapeFlags$1.COMPONENT && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & ShapeFlags$1.SUSPENSE) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}

function getTransitionRawChildren(children) {
  var keepComment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var parentKey = arguments.length > 2 ? arguments[2] : undefined;
  var ret = [];
  var keyedFragmentCount = 0;

  for (var i = 0; i < children.length; i++) {
    var child = children[i]; // #5360 inherit parent key in case of <template v-for>

    var key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i); // handle fragment children case, e.g. v-for

    if (child.type === Fragment) {
      if (child.patchFlag & PatchFlags.KEYED_FRAGMENT) keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } // comment placeholders should be skipped, e.g. v-if
    else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, {
        key: key
      }) : child);
    }
  } // #1126 if a transition children list contains multiple sub fragments, these
  // fragments will be merged into a flat children array. Since each v-for
  // fragment may contain different static bindings inside, we need to de-op
  // these children to force full diffs to ensure correct behavior.


  if (keyedFragmentCount > 1) {
    for (var _i2 = 0; _i2 < ret.length; _i2++) {
      ret[_i2].patchFlag = PatchFlags.BAIL;
    }
  }

  return ret;
}

var TRANSITION = "transition";
var ANIMATION = "animation"; // DOM Transition is a higher-order-component based on the platform-agnostic
// base Transition component, with DOM-specific logic.

var Transition = function Transition(props, _ref6) {
  var slots = _ref6.slots;
  return h(BaseTransition, resolveTransitionProps(props), slots);
};

Transition.displayName = "SkTransition";
var DOMTransitionPropsValidators = {
  name: String,
  back_name: String,
  type: String,
  css: {
    type: Boolean,
    "default": true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /*#__PURE__*/extend({}, BaseTransition.props, DOMTransitionPropsValidators);
/**
 * #3227 Incoming hooks may be merged into arrays when wrapping Transition
 * with custom HOCs.
 */

var callHook = function callHook(hook) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (isArray(hook)) {
    hook.forEach(function (h) {
      return h.apply(void 0, _toConsumableArray(args));
    });
  } else if (hook) {
    hook.apply(void 0, _toConsumableArray(args));
  }
};
/**
 * Check if a hook expects a callback (2nd arg), which means the user
 * intends to explicitly control the end of the transition.
 */


var hasExplicitCallback = function hasExplicitCallback(hook) {
  return hook ? isArray(hook) ? hook.some(function (h) {
    return h.length > 1;
  }) : hook.length > 1 : false;
};

function resolveTransitionProps(rawProps) {
  var baseProps = {};

  for (var key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }

  if (rawProps.css === false) {
    return baseProps;
  }

  var _rawProps$name = rawProps.name,
      name = _rawProps$name === void 0 ? "v" : _rawProps$name,
      type = rawProps.type,
      duration = rawProps.duration,
      _rawProps$enterFromCl = rawProps.enterFromClass,
      enterFromClass = _rawProps$enterFromCl === void 0 ? "".concat(name, "-enter-from") : _rawProps$enterFromCl,
      _rawProps$enterActive = rawProps.enterActiveClass,
      enterActiveClass = _rawProps$enterActive === void 0 ? "".concat(name, "-enter-active") : _rawProps$enterActive,
      _rawProps$enterToClas = rawProps.enterToClass,
      enterToClass = _rawProps$enterToClas === void 0 ? "".concat(name, "-enter-to") : _rawProps$enterToClas,
      _rawProps$appearFromC = rawProps.appearFromClass,
      appearFromClass = _rawProps$appearFromC === void 0 ? enterFromClass : _rawProps$appearFromC,
      _rawProps$appearActiv = rawProps.appearActiveClass,
      appearActiveClass = _rawProps$appearActiv === void 0 ? enterActiveClass : _rawProps$appearActiv,
      _rawProps$appearToCla = rawProps.appearToClass,
      appearToClass = _rawProps$appearToCla === void 0 ? enterToClass : _rawProps$appearToCla,
      _rawProps$leaveFromCl = rawProps.leaveFromClass,
      leaveFromClass = _rawProps$leaveFromCl === void 0 ? "".concat(name, "-leave-from") : _rawProps$leaveFromCl,
      _rawProps$leaveActive = rawProps.leaveActiveClass,
      leaveActiveClass = _rawProps$leaveActive === void 0 ? "".concat(name, "-leave-active") : _rawProps$leaveActive,
      _rawProps$leaveToClas = rawProps.leaveToClass,
      leaveToClass = _rawProps$leaveToClas === void 0 ? "".concat(name, "-leave-to") : _rawProps$leaveToClas,
      _rawProps$back_name = rawProps.back_name,
      back_name = _rawProps$back_name === void 0 ? "v" : _rawProps$back_name,
      back_type = rawProps.back_type,
      back_duration = rawProps.back_duration,
      _rawProps$back_enterF = rawProps.back_enterFromClass,
      back_enterFromClass = _rawProps$back_enterF === void 0 ? "".concat(back_name, "-enter-from") : _rawProps$back_enterF,
      _rawProps$back_enterA = rawProps.back_enterActiveClass,
      back_enterActiveClass = _rawProps$back_enterA === void 0 ? "".concat(back_name, "-enter-active") : _rawProps$back_enterA,
      _rawProps$back_enterT = rawProps.back_enterToClass,
      back_enterToClass = _rawProps$back_enterT === void 0 ? "".concat(back_name, "-enter-to") : _rawProps$back_enterT,
      _rawProps$back_appear = rawProps.back_appearFromClass,
      back_appearFromClass = _rawProps$back_appear === void 0 ? back_enterFromClass : _rawProps$back_appear,
      _rawProps$back_appear2 = rawProps.back_appearActiveClass,
      back_appearActiveClass = _rawProps$back_appear2 === void 0 ? back_enterActiveClass : _rawProps$back_appear2,
      _rawProps$back_appear3 = rawProps.back_appearToClass,
      back_appearToClass = _rawProps$back_appear3 === void 0 ? back_enterToClass : _rawProps$back_appear3,
      _rawProps$back_leaveF = rawProps.back_leaveFromClass,
      back_leaveFromClass = _rawProps$back_leaveF === void 0 ? "".concat(back_name, "-leave-from") : _rawProps$back_leaveF,
      _rawProps$back_leaveA = rawProps.back_leaveActiveClass,
      back_leaveActiveClass = _rawProps$back_leaveA === void 0 ? "".concat(back_name, "-leave-active") : _rawProps$back_leaveA,
      _rawProps$back_leaveT = rawProps.back_leaveToClass,
      back_leaveToClass = _rawProps$back_leaveT === void 0 ? "".concat(back_name, "-leave-to") : _rawProps$back_leaveT;
  var durations = normalizeDuration(duration);
  var enterDuration = durations && durations[0];
  var leaveDuration = durations && durations[1];

  var _onBeforeEnter2 = baseProps.onBeforeEnter,
      onEnter = baseProps.onEnter,
      _onEnterCancelled2 = baseProps.onEnterCancelled,
      _onLeave2 = baseProps.onLeave,
      _onLeaveCancelled2 = baseProps.onLeaveCancelled,
      _baseProps$onBeforeAp = baseProps.onBeforeAppear,
      _onBeforeAppear2 = _baseProps$onBeforeAp === void 0 ? _onBeforeEnter2 : _baseProps$onBeforeAp,
      _baseProps$onAppear = baseProps.onAppear,
      onAppear = _baseProps$onAppear === void 0 ? onEnter : _baseProps$onAppear,
      _baseProps$onAppearCa = baseProps.onAppearCancelled,
      _onAppearCancelled2 = _baseProps$onAppearCa === void 0 ? _onEnterCancelled2 : _baseProps$onAppearCa;

  var finishEnter = function finishEnter(el, isAppear, done) {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };

  var finishLeave = function finishLeave(el, done) {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };

  var makeEnterHook = function makeEnterHook(isAppear) {
    return function (el, done) {
      var hook = isAppear ? onAppear : onEnter;

      var resolve = function resolve() {
        return finishEnter(el, isAppear, done);
      };

      callHook(hook, [el, resolve]);
      nextFrame(function () {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);

        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve);
        }
      });
    };
  };

  var _finishLeave = function _finishLeave(el, done) {
    el._isLeaving = false;
    removeTransitionClass(el, back_leaveFromClass);
    removeTransitionClass(el, back_leaveToClass);
    removeTransitionClass(el, back_leaveActiveClass);
    done && done();
  };

  var _finishEnter = function _finishEnter(el, isAppear, done) {
    removeTransitionClass(el, isAppear ? back_appearToClass : back_enterToClass);
    removeTransitionClass(el, isAppear ? back_appearActiveClass : back_enterActiveClass);
    done && done();
  };

  var _makeEnterHook = function _makeEnterHook(isAppear) {
    return function (el, done) {
      var hook = isAppear ? onAppear : onEnter;

      var resolve = function resolve() {
        return _finishEnter(el, isAppear, done);
      };

      callHook(hook, [el, resolve]);
      nextFrame(function () {
        removeTransitionClass(el, isAppear ? back_appearFromClass : back_enterFromClass);
        addTransitionClass(el, isAppear ? back_appearToClass : back_enterToClass);

        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve);
        }
      });
    };
  }; // const _core = SingleCore()


  return extend(baseProps, {
    onBeforeEnter: function onBeforeEnter(el) {
      callHook(_onBeforeEnter2, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    _onBeforeEnter: function _onBeforeEnter(el) {
      callHook(_onBeforeEnter2, [el]);
      addTransitionClass(el, back_enterFromClass);
      addTransitionClass(el, back_enterActiveClass);
    },
    onBeforeAppear: function onBeforeAppear(el) {
      callHook(_onBeforeAppear2, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    _onBeforeAppear: function _onBeforeAppear(el) {
      callHook(_onBeforeAppear2, [el]);
      addTransitionClass(el, back_appearFromClass);
      addTransitionClass(el, back_appearActiveClass);
    },
    _onEnter: _makeEnterHook(false),
    _onAppear: _makeEnterHook(true),
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave: function onLeave(el, done) {
      el._isLeaving = true;

      var resolve = function resolve() {
        return finishLeave(el, done);
      };

      addTransitionClass(el, leaveFromClass); // force reflow so *-leave-from classes immediately take effect (#2593)

      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        if (!el._isLeaving) {
          // cancelled
          return;
        }

        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);

        if (!hasExplicitCallback(_onLeave2)) {
          whenTransitionEnds(el, type, leaveDuration, resolve);
        }
      });
      callHook(_onLeave2, [el, resolve]);
    },
    _onLeave: function _onLeave(el, done) {
      el._isLeaving = true;

      var resolve = function resolve() {
        return _finishLeave(el, done);
      };

      addTransitionClass(el, back_leaveFromClass); // force reflow so *-leave-from classes immediately take effect (#2593)

      forceReflow();
      addTransitionClass(el, back_leaveActiveClass);
      nextFrame(function () {
        if (!el._isLeaving) {
          // cancelled
          return;
        }

        removeTransitionClass(el, back_leaveFromClass);
        addTransitionClass(el, back_leaveToClass);

        if (!hasExplicitCallback(_onLeave2)) {
          whenTransitionEnds(el, type, leaveDuration, resolve);
        }
      });
      callHook(_onLeave2, [el, resolve]);
    },
    onEnterCancelled: function onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(_onEnterCancelled2, [el]);
    },
    _onEnterCancelled: function _onEnterCancelled(el) {
      _finishEnter(el, false);

      callHook(_onEnterCancelled2, [el]);
    },
    onAppearCancelled: function onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(_onAppearCancelled2, [el]);
    },
    _onAppearCancelled: function _onAppearCancelled(el) {
      _finishEnter(el, true);

      callHook(_onAppearCancelled2, [el]);
    },
    onLeaveCancelled: function onLeaveCancelled(el) {
      finishLeave(el);
      callHook(_onLeaveCancelled2, [el]);
    },
    _onLeaveCancelled: function _onLeaveCancelled(el) {
      _finishLeave(el);

      callHook(_onLeaveCancelled2, [el]);
    }
  });
}

function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    var n = NumberOf(duration);
    return [n, n];
  }
}

function NumberOf(val) {
  var res = toNumber(val);
  validateDuration(res);
  return res;
}

function validateDuration(val) {
  if (typeof val !== "number") {
    warn$1("<transition> explicit duration is not a valid number - " + "got ".concat(JSON.stringify(val), "."));
  } else if (isNaN(val)) {
    warn$1("<transition> explicit duration is NaN - " + "the duration expression might be incorrect.");
  }
}

function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(function (c) {
    return c && el.classList.add(c);
  });
  (el._vtc || (el._vtc = new Set())).add(cls);
}

function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach(function (c) {
    return c && el.classList.remove(c);
  });
  var _vtc = el._vtc;

  if (_vtc) {
    _vtc["delete"](cls);

    if (!_vtc.size) {
      el._vtc = undefined;
    }
  }
}

function nextFrame(cb) {
  requestAnimationFrame(function () {
    requestAnimationFrame(cb);
  });
}

var endId = 0;

function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
  var id = el._endId = ++endId;

  var resolveIfNotStale = function resolveIfNotStale() {
    if (id === el._endId) {
      resolve();
    }
  };

  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }

  var _getTransitionInfo = getTransitionInfo(el, expectedType),
      type = _getTransitionInfo.type,
      timeout = _getTransitionInfo.timeout,
      propCount = _getTransitionInfo.propCount;

  if (!type) {
    return resolve();
  }

  var endEvent = type + "end";
  var ended = 0;

  var end = function end() {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };

  var onEnd = function onEnd(e) {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  var getStyleProperties = function getStyleProperties(key) {
    return (styles[key] || "").split(", ");
  };

  var transitionDelays = getStyleProperties(TRANSITION + "Delay");
  var transitionDurations = getStyleProperties(TRANSITION + "Duration");
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = getStyleProperties(ANIMATION + "Delay");
  var animationDurations = getStyleProperties(ANIMATION + "Duration");
  var animationTimeout = getTimeout(animationDelays, animationDurations);
  var type = null;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  var hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(Math, _toConsumableArray(durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  })));
} // Old versions of Chromium (below 61.0.3163.100) formats floating pointer
// numbers in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down
// (i.e. acting as a floor function) causing unexpected behaviors


function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1000;
} // synchronously force layout to put elements into a certain state


function forceReflow() {
  return document.body.offsetHeight;
}

var components = {
  StackKeepAlive: StackKeepAlive,
  Transition: Transition
};
var plugin = {
  install: function install(app) {
    for (var prop in components) {
      if (components.hasOwnProperty(prop)) {
        var component = components[prop];
        app.component(component.displayName || component.name, component);
      }
    }
  },
  "ATransition": Transition
};
export { plugin as default };
