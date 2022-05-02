function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('@vue/shared'), require('vue-router')) : typeof define === 'function' && define.amd ? define(['vue', '@vue/shared', 'vue-router'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StackKeepAlive = factory(global.vue, global["vue/shared"], global.VueRouter));
})(this, function (vue, shared, vueRouter) {
  'use strict';

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
    return "keep-alive-vnode-key-".concat(Number(num), "-").concat(currentPathOf(router));
  };

  var getCurrentVM = function getCurrentVM(router) {
    return router.currentRoute._value.matched.length > 0 ? router.currentRoute._value.matched[0].instances["default"].$ : undefined;
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
    vue.callWithAsyncErrorHandling(hook, instance, VNODE_HOOK, [vnode, prevVNode]);
  }

  var MoveType = {
    ENTER: 0,
    LEAVE: 1,
    REORDER: 2
  };
  var queuePostRenderEffect = vue.queuePostFlushCb;

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
          cb();
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
          cb();
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

  var Core = /*#__PURE__*/function () {
    function Core(_ref) {
      var _this2 = this;

      var router = _ref.router,
          pruneCacheEntry = _ref.pruneCacheEntry,
          replaceStay = _ref.replaceStay;

      _classCallCheck(this, Core);

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
      this._initial = false; //闲置状态

      this.historyStack = new HistoryStack(function (_vm) {
        if (_vm) {
          _this2.destroyCaches(_vm.vnode.key);
        }
      });
      this.init();
    }

    _createClass(Core, [{
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
        var router = this.router;

        if (this.isReplace || this._initial) {
          this._initial = false;
          return genKey(this.stackPointer, router);
        } else if (this.isPush) {
          return genKey(this.stackPointer + 1, router);
        } else {
          return genKey(this.stackPointer - 1, router);
        }
      }
      /**
       * use afterEach hook to set state.key and add the reference of vm to the historyStack
       */

    }, {
      key: "routerHooks",
      value: function routerHooks() {
        var _this3 = this;

        var router = this.router;
        router.beforeEach(function (to, from) {});
        router.afterEach(function (to, from) {
          _this3.historyShouldChange = true; // get the vm instance after render

          vue.nextTick(function () {
            var current = _this3.currentVm;
            var pendingToPushVm = resolvePushedVm(current);

            if (_this3.pre === null) {
              _this3.onInitial(pendingToPushVm);
            } else if (_this3.isReplace) {
              _this3.onReplace(pendingToPushVm);
            } else if (_this3.isPush) {
              _this3.onPush(pendingToPushVm);
            } else {
              _this3.onBack(pendingToPushVm);
            } // console.log(current)


            _this3.pre = current; // this.SetIdle(true)

            _this3.preStateId = _this3.stackPointer;

            if (!isPlaceHolderVm(pendingToPushVm)) {
              _this3.historyShouldChange = false;
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
        var _this4 = this;

        this._hackRouter = new RouterHacker(this.router);

        this._hackRouter.beforeReplace(function () {
          _this4.isReplace = true;
          _this4.replacePrePath = currentPathOf(_this4.router);
        }, function (e) {
          _this4.isReplace = false;
          _this4.replacePrePath = undefined;
        }).beforeGo(function () {
          _this4.isReplace = false;
        }).beforePush(function () {
          _this4.isReplace = false;
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
      mode: String
    },
    setup: function setup(props, _ref2) {
      var slots = _ref2.slots;
      var instance = vue.getCurrentInstance(); // KeepAlive communicates with the instantiated renderer via the
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
        var instance = vnode.component;
        move(vnode, container, anchor, MoveType.ENTER, parentSuspense); // in case props have changed

        patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
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

        if (!current || cached.type !== current.type) {
          unmount(cached);
        } else if (current) {
          // current active instance should no longer be kept-alive.
          // we can't unmount it now but it might be later, so reset its flag now.
          resetShapeFlag(current);
        }

        cache["delete"](key);
        keys["delete"](key);
      } // core


      var router;
      {
        router = vueRouter.useRouter();
      }

      if (!router) {
        throw new Error("router is not found! In unit test mode ,router is got from gloabl.router, otherwise VueRouter.useRouter()");
      }

      var _core = new Core({
        router: router,
        pruneCacheEntry: pruneCacheEntry,
        replaceStay: props.replaceStay
      });

      {
        window.__core = _core;
      } // prune cache on include/exclude prop change

      vue.watch(function () {
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

      vue.onMounted(cacheSubtree);
      vue.onUpdated(cacheSubtree);
      vue.onBeforeUnmount(function () {
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

        if (children.length > 1) {
          {
            vue.warn("KeepAlive should contain exactly one component child.");
          }
          current = null;

          _core.genInitialKeyNextTime();

          return children;
        } else if (!vue.isVNode(rawVNode) || !(rawVNode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) && !(rawVNode.shapeFlag === ShapeFlags.SUSPENSE)) {
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
          vnode = vue.cloneVNode(vnode);

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
            vue.setTransitionHooks(vnode, vnode.transition);
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
    if (shared.isArray(pattern)) {
      return pattern.some(function (p) {
        return matches(p, name);
      });
    } else if (shared.isString(pattern)) {
      return pattern.split(',').includes(name);
    } else if (pattern.test) {
      return pattern.test(name);
    }
    /* istanbul ignore next */


    return false;
  }

  function resetShapeFlag(vnode) {
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
  }

  var components = {
    StackKeepAlive: StackKeepAlive
  };
  var plugin = {
    install: function install(Vue) {
      for (var prop in components) {
        if (components.hasOwnProperty(prop)) {
          var component = components[prop];
          Vue.component(component.name, component);
        }
      }
    }
  };
  return plugin;
});
