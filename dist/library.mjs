import { callWithAsyncErrorHandling, queuePostFlushCb, nextTick, getCurrentInstance, watch, onMounted, onUpdated, onBeforeUnmount, warn, isVNode, cloneVNode, setTransitionHooks } from 'Vue';
import { isArray, isString } from '@vue/shared';
import VueRouter from 'vue-router';

const isDef = function (v) {
  return v !== undefined && v !== null;
};
const PLACEHOLDER_VM = {
  __placeholder: true,
};
const currentPathOf = function (router) {
  return router.currentRoute._value.path
};
const resolvePushedVm = function (current) {
  return isDef(current) ? current : PLACEHOLDER_VM;
};
const isPlaceHolderVm = (vm) => vm && !!vm.__placeholder;

const getStateId = function () {
  const state = getCurrentState();
  return isDef(state) ? state.id : undefined;
};
const getCurrentState = function () {
  return history.state;
};

const genKey = function (num, router) {
  return `keep-alive-vnode-key-${Number(num)}-${currentPathOf(router)}`;
};
const getCurrentVM = function (router) {
  return router.currentRoute._value.matched.length > 0
    ? router.currentRoute._value.matched[0].instances.default.$
    : undefined;
};

const replaceState = function (mode, router, id) {
  const { pathname, search, hash } = window.location;
  let path = `${pathname}${search}${hash}`;
  let state = isDef(history.state) ? history.state : {};
  state['id'] = id;
  // optimize file:// URL
  const isFilSys = window.location.href.startsWith('file://');
  history.replaceState(state, '', isFilSys ? null : path);
};

const ShapeFlags = {
    ELEMENT : 1,
    FUNCTIONAL_COMPONENT : 1 << 1,
    STATEFUL_COMPONENT : 1 << 2,
    TEXT_CHILDREN : 1 << 3,
    ARRAY_CHILDREN : 1 << 4,
    SLOTS_CHILDREN : 1 << 5,
    TELEPORT : 1 << 6,
    SUSPENSE : 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE : 1 << 8,
    COMPONENT_KEPT_ALIVE : 1 << 9,
    COMPONENT :  1 << 1 |  1 << 2
  };
  
  const isFunction = val => typeof val === 'function';

  const invokeArrayFns = (fns, arg = null) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };

function getComponentName(Component) {
    return isFunction(Component)
      ? Component.displayName || Component.name
      : Component.name
  }

const VNODE_HOOK = 7;
function invokeVNodeHook(
    hook,
    instance,
    vnode,
    prevVNode = null
  ) {
    callWithAsyncErrorHandling(hook, instance, VNODE_HOOK, [
      vnode,
      prevVNode
    ]);
  }

const MoveType = {
    ENTER : 0,
    LEAVE : 1,
    REORDER : 2
  };
const queuePostRenderEffect = queuePostFlushCb;

const isAsyncWrapper = (i) => !!i.__asyncLoader;

class HistoryStack {
  constructor(destroyCache) {
    this.historyStackMap = [];
    this.destroyCache = destroyCache;
  }
  push(vm, index) {
    const stack = this.historyStackMap[index];
    if (Array.isArray(stack)) {
      !stack.includes(vm) && stack.push(vm);
      this.historyStackMap[index] = stack.filter((item) => !item._isDestroyed);
    } else {
      const vms = [];
      vms.push(vm);
      this.historyStackMap[index] = vms;
    }
  }
  pop(onlyLastOne = false) {
    const last = this.historyStackMap.pop();
    if (Array.isArray(last)) {
      if (onlyLastOne) {
        const vm = last.pop();
        vm && this.destroyCache(vm);
      } else {
        last.forEach(
          (vm) => vm && this.destroyCache(vm)
        );
      }
    }
  }
  
  removeGreater(index) {
    while (this.historyStackMap.length >= index) {
      this.pop();
    }
  }
  clear() {
    this.historyStackMap = [];
  }
}

class RouterHacker {
  constructor(router) {
    this.router = router;
  }

  beforeReplace(cb,onerror) {
    const router = this.router;
    const rtmp = router.replace;
    const rtmpf = (location, onComplete, onAbort) => {
      cb();
      rtmp.call(router, location, onComplete, (e) => {
        onerror();
        isDef(onAbort) && onAbort(e);
      });
    };
    router.replace = function (location, onComplete, onAbort) {
      rtmpf(location, onComplete, onAbort);
    };
    return this
  }

  beforeGo(cb) {
    const { router } = this;
    const gstmp = router.go;
    const gstmpf = (number) => {
      cb();
      return gstmp.call(router, number);
    };
    router.go = function (num) {
      return gstmpf(num);
    };
    return this
  }

  beforePush(cb) {
    const { router } = this;
    const pstmp = router.push;
    const pstmpf = (location, onComplete, onAbort) => {
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
    return this
  }
}

function hackHistory(history) {
  const rstmp = history.replaceState;
  history.replaceState = function (state, op, path) {
    const old = Object.assign({}, history.state);
    const s = Object.assign(old, state);
    rstmp.call(history, s, op, path);
  };
  const historyPushState = history.pushState;
  history.pushState = function (state, op, path) {
    const old = Object.assign({}, history.state);
    const s = Object.assign(old, state);
    historyPushState.call(history, s, op, path);
  };
}

class Core {
  constructor({ router, pruneCacheEntry , replaceStay }) {
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
    this.historyStack = new HistoryStack((_vm) => {
      if ( _vm ) {
        this.destroyCaches( _vm.vnode.key );
      }
    });
    this.init();
  }

  init() {
    this.initStackPointer();
    this.routerHooks();
    this.hackRouter();
  }

  initStackPointer() {
    const currentStateId = getStateId();
    if (isDef(currentStateId)) {
      this.setStackPointer(currentStateId);
    } else {
      this.setState(0);
    }
  }
  /**
   * to fix the first time inital Render with path like "/",
   */
  genInitialKeyNextTime() {
    this._initial = true;
  }
  /**
   * 
   * @returns generator for the vnode key of keep-alive slots
   */
  genKeyForVnode() {
    const { router } = this;
    if (this.isReplace || this._initial) {
      this._initial = false;
      return genKey(this.stackPointer, router);
    } else if ( this.isPush) {
      return genKey(this.stackPointer + 1, router);
    } else {
      return genKey(this.stackPointer - 1, router);
    }
  }
  /**
   * use afterEach hook to set state.key and add the reference of vm to the historyStack
   */
  routerHooks() {
    const { router } = this;
    router.beforeEach((to, from) => {
    });
    router.afterEach((to, from) => {
      this.historyShouldChange = true;
      // get the vm instance after render
      nextTick(() => {
        const current = this.currentVm;
        const pendingToPushVm = resolvePushedVm(current);
        if (this.pre === null) {
          this.onInitial(pendingToPushVm);
        } else if (this.isReplace) {
          this.onReplace(pendingToPushVm);
        } else if (this.isPush) {
          this.onPush(pendingToPushVm);
        } else {
          this.onBack(pendingToPushVm);
        }
        // console.log(current)
        this.pre = current;
        // this.SetIdle(true)
        this.preStateId = this.stackPointer;
        if (!isPlaceHolderVm(pendingToPushVm)) {
          this.historyShouldChange = false;
        }
      });
    });
  }
  /**
   * @description hack router go , replace and push functions to tell replace from back and push
   */
  hackRouter() {
    this._hackRouter = new RouterHacker(this.router);
    this._hackRouter
    .beforeReplace(()=>{
      this.isReplace = true;
      this.replacePrePath = currentPathOf(this.router);
    },(e)=>{
      this.isReplace = false;
      this.replacePrePath = undefined;
    })
    .beforeGo(()=>{
      this.isReplace = false;
    })
    .beforePush(()=>{
      this.isReplace = false;
    });
  }

  onInitial(vm) {
    this.historyStack.push(vm, this.stackPointer);
  }
  onPush(vm) {
    this.setState(this.increaseStackPointer());
    this.historyStack.push(vm, this.stackPointer);
    this.pre?.$clearParent?.(vm);
    this.pre = null;
  }
  onBack(vm) {
    this.historyStack.pop();
    this.decreaseStackPointer();
    this.historyStack.push(vm, this.stackPointer);
  }
  onReplace(vm) {
    // avoidReplaceQuery is fix the issue : router.replace only a query by same path, may cause error
    const avoidReplaceQuery = this.replacePrePath === currentPathOf(this.router);
    const shouldDestroy = 
      !(isDef(this.replacePrePath) && this.replaceStay.includes(this.replacePrePath)) 
      && 
      !avoidReplaceQuery;

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
  get currentVm() {
    return getCurrentVM(this.router);
  }
  get isPush() {
    if (!this.isReplace) {
      const stateId = getStateId();
      const v = !isDef(stateId) || this.preStateId <= stateId;
      return v
    }
    return false;
  }
  get stackPointer() {
    return this.router._stack;
  }
  setStackPointer(val) {
    this.router._stack = val;
  }
  setState(id) {
    this.setStackPointer(id);
    replaceState(this.mode, this.router, id);
  }
  increaseStackPointer() {
    return (this.router._stack += 1);
  }
  decreaseStackPointer() {
    return (this.router._stack -= 1);
  }
}

// vnode 生成key
  // 提供根据key清除cache的方法

  const StackKeepAliveImpl = {
    name: `StackKeepAlive`,
  
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
  
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number],
      replaceStay: [Array],
      mode: String,
    },
  
    setup(props, { slots } ) {
      const instance = getCurrentInstance();
      // KeepAlive communicates with the instantiated renderer via the
      // ctx where the renderer passes in its internals,
      // and the KeepAlive instance exposes activate/deactivate implementations.
      // The whole point of this is to avoid importing KeepAlive directly in the
      // renderer to facilitate tree-shaking.
      const sharedContext = instance.ctx;
  
      // if the internal renderer is not registered, it indicates that this is server-side rendering,
      // for KeepAlive, we just need to render its children
      if (!sharedContext.renderer) {
        return slots.default
      }
  
      const cache = new Map();
      const keys = new Set();
  
      let current = null;
  
      {
        window.__v_cache = instance.__v_cache = cache;
      }
  
      const parentSuspense = instance.suspense;
  
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext;
      const storageContainer = createElement('div');
  
      sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
        const instance = vnode.component;
        move(vnode, container, anchor, MoveType.ENTER, parentSuspense);
        // in case props have changed
        patch(
          instance.vnode,
          vnode,
          container,
          anchor,
          instance,
          parentSuspense,
          isSVG,
          vnode.slotScopeIds,
          optimized
        );
        queuePostRenderEffect(() => {
          instance.isDeactivated = false;
          if (instance.a) {
            invokeArrayFns(instance.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance.parent, vnode);
          }
        }, parentSuspense);
      };
  
      sharedContext.deactivate = (vnode) => {
        const instance = vnode.component;
        move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance.da) {
            invokeArrayFns(instance.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
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
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type);
          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key);
          }
        });
      }
  
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (!current || cached.type !== current.type) {
          unmount(cached);
        } else if (current) {
          // current active instance should no longer be kept-alive.
          // we can't unmount it now but it might be later, so reset its flag now.
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
  
      // core
      let router;
      {
        router = VueRouter.useRouter();
      }
      if (!router) {
        throw new Error("router is not found! In unit test mode ,router is got from gloabl.router, otherwise VueRouter.useRouter()")
      }
      const _core = new Core({ router, pruneCacheEntry, replaceStay: props.replaceStay });
      {
        window.__core = _core;
      }
      // prune cache on include/exclude prop change
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache(name => matches(include, name));
          exclude && pruneCache(name => !matches(exclude, name));
        },
        // prune post-render after `current` has been updated
        { flush: 'post', deep: true }
      );
  
      // cache sub tree after render
      let pendingCacheKey = null;
      const cacheSubtree = () => {
        // fix #1621, the pendingCacheKey could be 0
        if (pendingCacheKey != null) {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree));
        }
      };
      onMounted(cacheSubtree);
      onUpdated(cacheSubtree);
  
      onBeforeUnmount(() => {
        cache.forEach(cached => {
          const { subTree, suspense } = instance;
          const vnode = getInnerChild(subTree);
          if (cached.type === vnode.type) {
            // current instance will be unmounted as part of keep-alive's unmount
            resetShapeFlag(vnode);
            // but invoke its deactivated hook here
            const da = vnode.component.da;
            da && queuePostRenderEffect(da, suspense);
            return
          }
          unmount(cached);
        });
      });
  
      return () => {
        pendingCacheKey = null;
  
        if (!slots.default) {
          return null
        }
        // generate a specific key for every vnode
        const _key = _core.genKeyForVnode();
        
        const children = slots.default({'key': _key});
        const rawVNode = children[0];
        if (children.length > 1) {
          {
            warn(`KeepAlive should contain exactly one component child.`);
          }
          current = null;
          _core.genInitialKeyNextTime();
          return children
        } else if (
          !isVNode(rawVNode) ||
          (!(rawVNode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) &&
            !(rawVNode.shapeFlag === ShapeFlags.SUSPENSE))
        ) {
          _core.genInitialKeyNextTime();
          current = null;
          return rawVNode
        }
  
        let vnode = getInnerChild(rawVNode);

        const comp = vnode.type;

        // for async components, name check should be based in its loaded
        // inner component if available
        const name = getComponentName(
          isAsyncWrapper(vnode)
            ? (vnode.type).__asyncResolved || {}
            : comp
        );
  
        const { include, exclude, max } = props;
  
        if (
          (include && (!name || !matches(include, name))) ||
          (exclude && name && matches(exclude, name))
        ) {
          current = vnode;
          return rawVNode
        }
  
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        // clone vnode if it's reused because we are going to mutate it
        if (vnode.el) {
          vnode = cloneVNode(vnode);
          if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
            rawVNode.ssContent = vnode;
          }
        }
        // #1513 it's possible for the returned vnode to be cloned due to attr
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
            setTransitionHooks(vnode, vnode.transition);
          }
          // avoid vnode being mounted as fresh
          vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
          // make this key the freshest
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          // prune oldest entry
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        // avoid vnode being unmounted
        vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
  
        current = vnode;
        return rawVNode
      }
    }
  };
  
  const StackKeepAlive = StackKeepAliveImpl;
  
  function matches(pattern, name){
    if (isArray(pattern)) {
      return pattern.some((p) => matches(p, name))
    } else if (isString(pattern)) {
      return pattern.split(',').includes(name)
    } else if (pattern.test) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }
  
  function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag;
    if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
      shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
    }
    if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE;
    }
    vnode.shapeFlag = shapeFlag;
  }
  
  function getInnerChild(vnode) {
    return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent : vnode
  }

var components = { StackKeepAlive };

const plugin = {
  install (Vue) {
    for (const prop in components) {
      if (components.hasOwnProperty(prop)) {
        const component = components[prop];
        Vue.component(component.name, component);
      }
    }
  }
};

export { plugin as default };
