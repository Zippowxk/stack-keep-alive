import {
    getCurrentInstance,
    cloneVNode,
    isVNode,
    warn
} from 'vue'
import { isDef } from '../core/utils'
import {
    getComponentName, // fix done
  } from '../depens/component'

  import {
    invokeVNodeHook // fix
  } from '../depens/vnode'

  import {
    onBeforeUnmount, // fix
    injectHook, // fix
    onUnmounted, // fix
    onMounted, // fix
    onUpdated // fix
  } from 'vue'
  import {
    isString, // fix
    isArray, // fix
    remove, // fix
  } from '@vue/shared'
  import {
    ShapeFlags,
    invokeArrayFns
  } from '../depens/share'

  import { watch } from 'vue' // fix done
  import {
    queuePostRenderEffect, // fix done
    MoveType,
  } from '../depens/renderer'
  import { setTransitionHooks } from 'vue' // fix done
//   import { devtoolsComponentAdded } from '../devtools' // TODO: fixed
  import { isAsyncWrapper } from '../depens/apiAsyncComponent' // fix done
  
  // import { hackRouter, hackHistory } from '../hacks/index'

  import Core from '../core/index'
  import { useRouter } from 'vue-router';
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
      const instance = getCurrentInstance()
      // KeepAlive communicates with the instantiated renderer via the
      // ctx where the renderer passes in its internals,
      // and the KeepAlive instance exposes activate/deactivate implementations.
      // The whole point of this is to avoid importing KeepAlive directly in the
      // renderer to facilitate tree-shaking.
      const sharedContext = instance.ctx
  
      // if the internal renderer is not registered, it indicates that this is server-side rendering,
      // for KeepAlive, we just need to render its children
      if (!sharedContext.renderer) {
        return slots.default
      }
  
      const cache = new Map()
      const keys = new Set()
  
      let current = null
  
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        window.__v_cache = instance.__v_cache = cache
      }
  
      const parentSuspense = instance.suspense
  
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext
      const storageContainer = createElement('div')
  
      sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
        const instance = vnode.component
        move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
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
        )
        queuePostRenderEffect(() => {
          instance.isDeactivated = false
          if (instance.a) {
            invokeArrayFns(instance.a)
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance.parent, vnode)
          }
        }, parentSuspense)
  
        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          // Update components tree
        //   devtoolsComponentAdded(instance)
        }
      }
  
      sharedContext.deactivate = (vnode) => {
        const instance = vnode.component
        move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)
        queuePostRenderEffect(() => {
          if (instance.da) {
            invokeArrayFns(instance.da)
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance.parent, vnode)
          }
          instance.isDeactivated = true
        }, parentSuspense)
  
        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          // Update components tree
        //   devtoolsComponentAdded(instance)
        }
      }
  
      function unmount(vnode) {
        // reset the shapeFlag so it can be properly unmounted
        resetShapeFlag(vnode)
        _unmount(vnode, instance, parentSuspense, true)
      }
  
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type)
          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key)
          }
        })
      }
  
      function pruneCacheEntry(key) {
        const cached = cache.get(key)
        if (!current || cached.type !== current.type) {
          unmount(cached)
        } else if (current) {
          // current active instance should no longer be kept-alive.
          // we can't unmount it now but it might be later, so reset its flag now.
          resetShapeFlag(current)
        }
        cache.delete(key)
        keys.delete(key)
      }
  
      // core
      let router
      if (__TEST__) {
        router = global.router
      } else {
        router = useRouter()
      }
      if (!router) {
        throw new Error("router is not found! In unit test mode ,router is got from gloabl.router, otherwise VueRouter.useRouter()")
      }
      const _core = new Core({ router, pruneCacheEntry, replaceStay: props.replaceStay })
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        window.__core = _core
      }
      if (__TEST__) {
        global.__core = _core
      }
      // prune cache on include/exclude prop change
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache(name => matches(include, name))
          exclude && pruneCache(name => !matches(exclude, name))
        },
        // prune post-render after `current` has been updated
        { flush: 'post', deep: true }
      )
  
      // cache sub tree after render
      let pendingCacheKey = null
      const cacheSubtree = () => {
        // fix #1621, the pendingCacheKey could be 0
        if (pendingCacheKey != null) {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree))
        }
      }
      onMounted(cacheSubtree)
      onUpdated(cacheSubtree)
  
      onBeforeUnmount(() => {
        cache.forEach(cached => {
          const { subTree, suspense } = instance
          const vnode = getInnerChild(subTree)
          if (cached.type === vnode.type) {
            // current instance will be unmounted as part of keep-alive's unmount
            resetShapeFlag(vnode)
            // but invoke its deactivated hook here
            const da = vnode.component.da
            da && queuePostRenderEffect(da, suspense)
            return
          }
          unmount(cached)
        })
      })
  
      return () => {
        pendingCacheKey = null
  
        if (!slots.default) {
          return null
        }
        // generate a specific key for every vnode
        const _key = _core.genKeyForVnode()
        
        const children = slots.default({'key': _key})
        const rawVNode = children[0]
        if (children.length > 1) {
          if (__DEV__) {
            warn(`KeepAlive should contain exactly one component child.`)
          }
          current = null
          _core.genInitialKeyNextTime()
          return children
        } else if (
          !isVNode(rawVNode) ||
          (!(rawVNode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) &&
            !(rawVNode.shapeFlag === ShapeFlags.SUSPENSE))
        ) {
          _core.genInitialKeyNextTime()
          current = null
          return rawVNode
        }
  
        let vnode = getInnerChild(rawVNode)

        const comp = vnode.type

        // for async components, name check should be based in its loaded
        // inner component if available
        const name = getComponentName(
          isAsyncWrapper(vnode)
            ? (vnode.type).__asyncResolved || {}
            : comp
        )
  
        const { include, exclude, max } = props
  
        if (
          (include && (!name || !matches(include, name))) ||
          (exclude && name && matches(exclude, name))
        ) {
          current = vnode
          return rawVNode
        }
  
        const key = vnode.key == null ? comp : vnode.key
        const cachedVNode = cache.get(key)
        // clone vnode if it's reused because we are going to mutate it
        if (vnode.el) {
          vnode = cloneVNode(vnode)
          if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
            rawVNode.ssContent = vnode
          }
        }
        // #1513 it's possible for the returned vnode to be cloned due to attr
        // fallthrough or scopeId, so the vnode here may not be the final vnode
        // that is mounted. Instead of caching it directly, we store the pending
        // key and cache `instance.subTree` (the normalized vnode) in
        // beforeMount/beforeUpdate hooks.
        pendingCacheKey = key
        if (cachedVNode) {
          // copy over mounted state
          vnode.el = cachedVNode.el
          vnode.component = cachedVNode.component
          
          if (vnode.transition) {
            // recursively update transition hooks on subTree
            setTransitionHooks(vnode, vnode.transition)
          }
          // avoid vnode being mounted as fresh
          vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
          // make this key the freshest
          keys.delete(key)
          keys.add(key)
        } else {
          keys.add(key)
          // prune oldest entry
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value)
          }
        }
        // avoid vnode being unmounted
        vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  
        current = vnode
        return rawVNode
      }
    }
  }
  
  if (__COMPAT__) {
    StackKeepAliveImpl.__isBuildIn = true
  }
  
  export const StackKeepAlive = StackKeepAliveImpl
  
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
  
  export function onActivated(
    hook,
    target = null
  ) {
    registerKeepAliveHook(hook, LifecycleHooks.ACTIVATED, target)
  }
  
  export function onDeactivated(
    hook,
    target = null
  ) {
    registerKeepAliveHook(hook, LifecycleHooks.DEACTIVATED, target)
  }
  
  function registerKeepAliveHook(
    hook,
    type,
    target = currentInstance
  ) {
    // cache the deactivate branch check wrapper for injected hooks so the same
    // hook can be properly deduped by the scheduler. "__wdc" stands for "with
    // deactivation check".
    const wrappedHook =
      hook.__wdc ||
      (hook.__wdc = () => {
        // only fire the hook if the target instance is NOT in a deactivated branch.
        let current = target
        while (current) {
          if (current.isDeactivated) {
            return
          }
          current = current.parent
        }
        return hook()
      })
    injectHook(type, wrappedHook, target)
    // In addition to registering it on the target instance, we walk up the parent
    // chain and register it on all ancestor instances that are keep-alive roots.
    // This avoids the need to walk the entire component tree when invoking these
    // hooks, and more importantly, avoids the need to track child components in
    // arrays.
    if (target) {
      let current = target.parent
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current)
        }
        current = current.parent
      }
    }
  }
  
  function injectToKeepAliveRoot(
    hook,
    type,
    target,
    keepAliveRoot
  ) {
    // injectHook wraps the original for error handling, so make sure to remove
    // the wrapped version.
    const injected = injectHook(type, hook, keepAliveRoot, true /* prepend */)
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected)
    }, target)
  }
  
  function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag
    if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
      shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
    }
    if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE
    }
    vnode.shapeFlag = shapeFlag
  }
  
  function getInnerChild(vnode) {
    return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent : vnode
  }
  
  function normalizeSlot(slot, data) {
    if (!slot) return null
    const slotContent = slot(data)
    return slotContent.length === 1 ? slotContent[0] : slotContent
  }