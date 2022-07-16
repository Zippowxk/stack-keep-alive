// import { Comment, isSameVNodeType, Fragment } from "../vnode"
import { callWithAsyncErrorHandling } from "vue"

import { toRaw } from "@vue/reactivity"
import { isArray } from "@vue/shared"
import { Comment, Fragment } from '@vue/runtime-core'
import {
  getCurrentInstance,
  cloneVNode,
  warn
} from 'vue'
import { isKeepAlive, ShapeFlags, isSameVNodeType, ErrorCodes, PatchFlags } from '../core/utils'
// import { isSameVNodeType } from '@vue/runtime-core'
import {
  onBeforeUnmount, // fix
  onMounted, // fix
} from 'vue'

export function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  }
  onMounted(() => {
    state.isMounted = true
  })
  onBeforeUnmount(() => {
    state.isUnmounting = true
  })
  return state
}

const PLACEHOLDER = '_placeholder'
const TransitionHookValidator = [Function, Array]

const BaseTransitionImpl = {
  name: `BaseTransition`,

  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance()
    const state = useTransitionState()

    let prevTransitionKey
    return () => {
      const children =
        slots.default && getTransitionRawChildren(slots.default(), true)
      if (!children || !children.length) {
        return
      }

      let child = children[0]
      if (children.length > 1) {
        let hasFound = false
        // locate first non-comment child
        for (const c of children) {
          if (c.type !== Comment) {
            if (__DEV__ && hasFound) {
              // warn more than one non-comment child
              warn(
                "<transition> can only be used on a single element or component. " +
                  "Use <transition-group> for lists."
              )
              break
            }
            child = c
            hasFound = true
            if (!__DEV__) break
          }
        }
      }

      // fix enter issue
      // debugger
      if (child && child.type && child.type.name && child.type.name === 'StackKeepAlive') {
        console.log(child)
        child._R
        let now = null
        const _child = new Proxy(child.children, {
          get: function (target, property, receiver) {
              if (property == 'default') {
                  // cache it 
                  if (now) {
                    return now
                  }
                  var pre = Reflect.get(target, property, receiver);
                  now = function _now(...args) {
                    const oldM = child._R ? child._R[0] : undefined
                    const newKey = (args && args[0] ) ? args[0].key : undefined
                    const oldKey = (child._R && child._R[0]) ? child._R[0].key : undefined
                    console.log('new key : ',newKey)
                    console.log('old key : ',oldKey)
                   
                    // r newKey oldKey
                    if (newKey === PLACEHOLDER) {
                      let m = pre(...args)
                      const newType = m[0].type
                      if (newType !== Comment) {
                        console.log('cache')
                        return child._R = m
                      } else {
                        console.log('no cache')
                        return m
                      }
                    } else if (child._R){
                      // 替换Key
                      child._R[0].key = newKey
                      child._R[0].props && (child._R[0].props.key = newKey)
                      console.log('use cache')
                      return child._R
                    } else {
                      let m = pre(...args)
                      console.log('cache')
                      return child._R = m
                    }
                   
                    // if ( r ) {
                    //   if (args && args[0].key && (r[0].key === PLACEHOLDER) && args[0].key) {
                    //     r[0].key = args[0].key
                    //     r[0].props && (r[0].props.key = args[0].key)
                    //   }
                    //   // console.log('use cache:',r)
                    //   return r
                    // }
                    // let m = pre(...args)
                    // if (m[0].type !== Comment) {
                    //   // console.log('cache:',m)
                    //   return r = m
                    // } else {
                    //   // console.log('use no cache:',m)
                    //   return m
                    // }
                  }
                  return now;
              }
              return Reflect.get(target, property, receiver);
          },
        })
        child.children = _child
      }


      // there's no need to track reactivity for these props so use the raw
      // props for a bit better perf
      const rawProps = toRaw(props)
      const { mode } = rawProps
      // check mode
      if (
        __DEV__ &&
        mode &&
        mode !== "in-out" &&
        mode !== "out-in" &&
        mode !== "default"
      ) {
        warn(`invalid <transition> mode: ${mode}`)
      }

      if (state.isLeaving) {
        return emptyPlaceholder(child)
      }

      // in the case of <transition><keep-alive/></transition>, we need to
      // compare the type of the kept-alive children.
      const innerChild = getKeepAliveChild(child)
      if (!innerChild) {
        return emptyPlaceholder(child)
      }

      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      )
      setTransitionHooks(innerChild, enterHooks)

      const oldChild = instance.subTree
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild)

      let transitionKeyChanged = false
      const { getTransitionKey } = innerChild.type
      if (getTransitionKey) {
        const key = getTransitionKey()
        if (prevTransitionKey === undefined) {
          prevTransitionKey = key
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key
          transitionKeyChanged = true
        }
      }
      // handle mode
      if (
        oldInnerChild &&
        oldInnerChild.type !== Comment &&
        (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)
      ) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        )
        // update old tree's hooks in case of dynamic transition
        setTransitionHooks(oldInnerChild, leavingHooks)
        // switching between different views
        if (mode === "out-in") {
          state.isLeaving = true
          // return placeholder node and queue update when leave finishes
          leavingHooks.afterLeave = () => {
            state.isLeaving = false
            instance.update()
          }
          // setTimeout(()=>{
          //   state.isLeaving = false
          //   instance.update()
          // },200)
          return emptyPlaceholder(child)
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            )
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild
            // early removal callback
            el._leaveCb = () => {
              earlyRemove()
              el._leaveCb = undefined
              delete enterHooks.delayedLeave
            }
            enterHooks.delayedLeave = delayedLeave
          }
        }
      }

      return child
    }
  }
}

if (__COMPAT__) {
  BaseTransitionImpl.__isBuiltIn = true
}

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const BaseTransition = BaseTransitionImpl

function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state
  let leavingVNodesCache = leavingVNodes.get(vnode.type)
  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null)
    leavingVNodes.set(vnode.type, leavingVNodesCache)
  }
  return leavingVNodesCache
}

// The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.
export function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props
  const key = String(vnode.key)
  const leavingVNodesCache = getLeavingNodesForType(state, vnode)

  const callHook = (hook, args) => {
    hook &&
      callWithAsyncErrorHandling(
        hook,
        instance,
        ErrorCodes.TRANSITION_HOOK,
        args
      )
  }

  const callAsyncHook = (hook, args) => {
    const done = args[1]
    callHook(hook, args)
    if (isArray(hook)) {
      if (hook.every(hook => hook.length <= 1)) done()
    } else if (hook.length <= 1) {
      done()
    }
  }

  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter
        } else {
          return
        }
      }
      // for same element (v-show)
      if (el._leaveCb) {
        el._leaveCb(true /* cancelled */)
      }
      // for toggled element with same key (v-if)
      const leavingVNode = leavingVNodesCache[key]
      if (
        leavingVNode &&
        isSameVNodeType(vnode, leavingVNode) &&
        leavingVNode.el._leaveCb
      ) {
        // force early removal (not cancelled)
        leavingVNode.el._leaveCb()
      }
      callHook(hook, [el])
    },

    enter(el) {
      let hook = onEnter
      let afterHook = onAfterEnter
      let cancelHook = onEnterCancelled
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter
          afterHook = onAfterAppear || onAfterEnter
          cancelHook = onAppearCancelled || onEnterCancelled
        } else {
          return
        }
      }
      let called = false
      const done = (el._enterCb = cancelled => {
        if (called) return
        called = true
        if (cancelled) {
          callHook(cancelHook, [el])
        } else {
          callHook(afterHook, [el])
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave()
        }
        el._enterCb = undefined
      })
      if (hook) {
        callAsyncHook(hook, [el, done])
      } else {
        done()
      }
    },

    leave(el, remove) {
      const key = String(vnode.key)
      if (el._enterCb) {
        el._enterCb(true /* cancelled */)
      }
      if (state.isUnmounting) {
        return remove()
      }
      callHook(onBeforeLeave, [el])
      let called = false
      const done = (el._leaveCb = cancelled => {
        if (called) return
        called = true
        remove()
        if (cancelled) {
          callHook(onLeaveCancelled, [el])
        } else {
          callHook(onAfterLeave, [el])
        }
        el._leaveCb = undefined
        if (leavingVNodesCache[key] === vnode) {
          delete leavingVNodesCache[key]
        }
      })
      leavingVNodesCache[key] = vnode
      if (onLeave) {
        callAsyncHook(onLeave, [el, done])
      } else {
        done()
      }
    },

    clone(vnode) {
      return resolveTransitionHooks(vnode, props, state, instance)
    }
  }

  return hooks
}

// the placeholder really only handles one special case: KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being
// unmounted.
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode)
    vnode.children = null
    return vnode
  }
}

function getKeepAliveChild(vnode) {
//   const oldChild = vnode.__oldChild
//   if (oldChild) { 
//       return oldChild
//   }
// // debugger
  return isKeepAlive(vnode)
      ? vnode.children
          ? isArray(vnode.children)
              ? vnode.children[0]
              : (vnode.children.default({key: PLACEHOLDER}))[0]
          : undefined
      : vnode;
}

export function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & ShapeFlags.COMPONENT && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks)
  } else if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent)
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback)
  } else {
    vnode.transition = hooks
  }
}

export function getTransitionRawChildren(
  children,
  keepComment = false,
  parentKey
) {
  let ret = []
  let keyedFragmentCount = 0
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    // #5360 inherit parent key in case of <template v-for>
    const key =
      parentKey == null
        ? child.key
        : String(parentKey) + String(child.key != null ? child.key : i)
    // handle fragment children case, e.g. v-for
    if (child.type === Fragment) {
      if (child.patchFlag & PatchFlags.KEYED_FRAGMENT) keyedFragmentCount++
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      )
    }
    // comment placeholders should be skipped, e.g. v-if
    else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child)
    }
  }
  // #1126 if a transition children list contains multiple sub fragments, these
  // fragments will be merged into a flat children array. Since each v-for
  // fragment may contain different static bindings inside, we need to de-op
  // these children to force full diffs to ensure correct behavior.
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = PatchFlags.BAIL
    }
  }
  return ret
}
