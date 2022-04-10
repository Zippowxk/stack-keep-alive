(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('Vue'), require('@vue/shared')) :
  typeof define === 'function' && define.amd ? define(['Vue', '@vue/shared'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StackKeepAlive = factory(global.Vue, global.shared));
})(this, (function (Vue, shared) { 'use strict';

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
      Vue.callWithAsyncErrorHandling(hook, instance, VNODE_HOOK, [
        vnode,
        prevVNode
      ]);
    }

  const MoveType = {
      ENTER : 0,
      LEAVE : 1,
      REORDER : 2
    };
  const queuePostRenderEffect = Vue.queuePostFlushCb;

  const isAsyncWrapper = (i) => !!i.__asyncLoader;

  //   type MatchPattern = string | RegExp | (string | RegExp)[]
    
  //   export interface KeepAliveProps {
  //     include?: MatchPattern
  //     exclude?: MatchPattern
  //     max?: number | string
  //   }
    
  //   type CacheKey = string | number | symbol | ConcreteComponent
  //   type Cache = Map<CacheKey, VNode>
  //   type Keys = Set<CacheKey>
    
  //   export interface KeepAliveContext extends ComponentRenderContext {
  //     renderer: RendererInternals
  //     activate: (
  //       vnode: VNode,
  //       container: RendererElement,
  //       anchor: RendererNode | null,
  //       isSVG: boolean,
  //       optimized: boolean
  //     ) => void
  //     deactivate: (vnode: VNode) => void
  //   }
    
  //   export const isKeepAlive = (vnode: VNode): boolean =>
  //     (vnode.type as any).__isKeepAlive
    
    const StackKeepAliveImpl = {
      name: `StackKeepAlive`,
    
      // Marker for special handling inside the renderer. We are not using a ===
      // check directly on KeepAlive in the renderer, because importing it directly
      // would prevent it from being tree-shaken.
      __isKeepAlive: true,
    
      props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number]
      },
    
      setup(props, { slots } ) {
        const instance = Vue.getCurrentInstance();
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
          instance.__v_cache = cache;
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
              shared.invokeArrayFns(instance.a);
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
              shared.invokeArrayFns(instance.da);
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
    
        // prune cache on include/exclude prop change
        Vue.watch(
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
        Vue.onMounted(cacheSubtree);
        Vue.onUpdated(cacheSubtree);
    
        Vue.onBeforeUnmount(() => {
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
    
          const children = slots.default();
          const rawVNode = children[0];
          if (children.length > 1) {
            {
              Vue.warn(`KeepAlive should contain exactly one component child.`);
            }
            current = null;
            return children
          } else if (
            !Vue.isVNode(rawVNode) ||
            (!(rawVNode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) &&
              !(rawVNode.shapeFlag === ShapeFlags.SUSPENSE))
          ) {
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
            vnode = Vue.cloneVNode(vnode);
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
              Vue.setTransitionHooks(vnode, vnode.transition);
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
      if (shared.isArray(pattern)) {
        return pattern.some((p) => matches(p, name))
      } else if (shared.isString(pattern)) {
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

  return plugin;

}));
