import { callWithAsyncErrorHandling } from 'Vue'
const VNODE_HOOK = 7
export function invokeVNodeHook(
    hook,
    instance,
    vnode,
    prevVNode = null
  ) {
    callWithAsyncErrorHandling(hook, instance, VNODE_HOOK, [
      vnode,
      prevVNode
    ])
  }
  