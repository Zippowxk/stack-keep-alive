 let _ShapeFlags

;(function(ShapeFlags) {
  ShapeFlags[(ShapeFlags["ELEMENT"] = 1)] = "ELEMENT"
  ShapeFlags[(ShapeFlags["FUNCTIONAL_COMPONENT"] = 2)] = "FUNCTIONAL_COMPONENT"
  ShapeFlags[(ShapeFlags["STATEFUL_COMPONENT"] = 4)] = "STATEFUL_COMPONENT"
  ShapeFlags[(ShapeFlags["TEXT_CHILDREN"] = 8)] = "TEXT_CHILDREN"
  ShapeFlags[(ShapeFlags["ARRAY_CHILDREN"] = 16)] = "ARRAY_CHILDREN"
  ShapeFlags[(ShapeFlags["SLOTS_CHILDREN"] = 32)] = "SLOTS_CHILDREN"
  ShapeFlags[(ShapeFlags["TELEPORT"] = 64)] = "TELEPORT"
  ShapeFlags[(ShapeFlags["SUSPENSE"] = 128)] = "SUSPENSE"
  ShapeFlags[(ShapeFlags["COMPONENT_SHOULD_KEEP_ALIVE"] = 256)] =
    "COMPONENT_SHOULD_KEEP_ALIVE"
  ShapeFlags[(ShapeFlags["COMPONENT_KEPT_ALIVE"] = 512)] =
    "COMPONENT_KEPT_ALIVE"
  ShapeFlags[(ShapeFlags["COMPONENT"] = 6)] = "COMPONENT"
})(_ShapeFlags || (_ShapeFlags = {}))

export const ShapeFlags = _ShapeFlags
export const isDef = function (v) {
  return v !== undefined && v !== null;
};
const PLACEHOLDER_VM = {
  __placeholder: true,
};
export const currentPathOf = function (router) {
  return router.currentRoute._value.path
}
export const resolvePushedVm = function (current) {
  return isDef(current) ? current : PLACEHOLDER_VM;
};
export const isPlaceHolderVm = (vm) => vm && !!vm.__placeholder;

export const getStateId = function () {
  const state = getCurrentState();
  return isDef(state) ? state.id : undefined;
};
export const getStateForward = function () {
  const state = getCurrentState();
  return isDef(state) ? state.forward : undefined;
}

export const getQuery = function (params) {
  let query = '';
  query = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&');
  if (query.length > 0) {
    query = `?${query}`;
  }
  return query;
};
const getCurrentState = function () {
  return history.state;
};

export const genKey = function (num, router, routeTo = null) {
  // return `keep-alive-vnode-key-${Number(num)}-`;
  return `keep-alive-vnode-key-${Number(num)}-${routeTo?routeTo:currentPathOf(router)}`;
};
export const getCurrentVM = function (router) {
  return router.currentRoute._value.matched.length > 0
    ? router.currentRoute._value.matched[0].instances.default?.$
    : undefined;
};
export const setCurrentVnodeKey = function (router, key) {
  const current = getCurrentVM(router);
  if (current && current.vnode) {
    current.vnode.key = key;
  }
};

export const replaceState = function (mode, router, id) {
  const { pathname, search, hash } = window.location;
  let path = `${pathname}${search}${hash}`;
  let state = isDef(history.state) ? history.state : {};
  state['id'] = id;
  // optimize file:// URL
  const isFilSys = window.location.href.startsWith('file://');
  history.replaceState(state, '', isFilSys ? null : path);
};

export const inBrowser = typeof window !== 'undefined';

export const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;

// export const Comment = Symbol(__DEV__ ? 'Comment' : undefined)
// export const Fragment = Symbol(__DEV__ ? 'Fragment' : undefined)

export function isSameVNodeType(n1, n2){
  if (
    __DEV__ &&
    n2.shapeFlag & ShapeFlags.COMPONENT
  ) {
    // HMR only: if the component has been hot-updated, force a reload.
    return false
  }
  return n1.type === n2.type && n1.key === n2.key
}

var _ErrorCodes

;(function(ErrorCodes) {
  ErrorCodes[(ErrorCodes["SETUP_FUNCTION"] = 0)] = "SETUP_FUNCTION"
  ErrorCodes[(ErrorCodes["RENDER_FUNCTION"] = 1)] = "RENDER_FUNCTION"
  ErrorCodes[(ErrorCodes["WATCH_GETTER"] = 2)] = "WATCH_GETTER"
  ErrorCodes[(ErrorCodes["WATCH_CALLBACK"] = 3)] = "WATCH_CALLBACK"
  ErrorCodes[(ErrorCodes["WATCH_CLEANUP"] = 4)] = "WATCH_CLEANUP"
  ErrorCodes[(ErrorCodes["NATIVE_EVENT_HANDLER"] = 5)] = "NATIVE_EVENT_HANDLER"
  ErrorCodes[(ErrorCodes["COMPONENT_EVENT_HANDLER"] = 6)] =
    "COMPONENT_EVENT_HANDLER"
  ErrorCodes[(ErrorCodes["VNODE_HOOK"] = 7)] = "VNODE_HOOK"
  ErrorCodes[(ErrorCodes["DIRECTIVE_HOOK"] = 8)] = "DIRECTIVE_HOOK"
  ErrorCodes[(ErrorCodes["TRANSITION_HOOK"] = 9)] = "TRANSITION_HOOK"
  ErrorCodes[(ErrorCodes["APP_ERROR_HANDLER"] = 10)] = "APP_ERROR_HANDLER"
  ErrorCodes[(ErrorCodes["APP_WARN_HANDLER"] = 11)] = "APP_WARN_HANDLER"
  ErrorCodes[(ErrorCodes["FUNCTION_REF"] = 12)] = "FUNCTION_REF"
  ErrorCodes[(ErrorCodes["ASYNC_COMPONENT_LOADER"] = 13)] =
    "ASYNC_COMPONENT_LOADER"
  ErrorCodes[(ErrorCodes["SCHEDULER"] = 14)] = "SCHEDULER"
})(_ErrorCodes || (_ErrorCodes = {}))
export const ErrorCodes = _ErrorCodes

var _PatchFlags

;(function(PatchFlags) {
  PatchFlags[(PatchFlags["TEXT"] = 1)] = "TEXT"
  PatchFlags[(PatchFlags["CLASS"] = 2)] = "CLASS"
  PatchFlags[(PatchFlags["STYLE"] = 4)] = "STYLE"
  PatchFlags[(PatchFlags["PROPS"] = 8)] = "PROPS"
  PatchFlags[(PatchFlags["FULL_PROPS"] = 16)] = "FULL_PROPS"
  PatchFlags[(PatchFlags["HYDRATE_EVENTS"] = 32)] = "HYDRATE_EVENTS"
  PatchFlags[(PatchFlags["STABLE_FRAGMENT"] = 64)] = "STABLE_FRAGMENT"
  PatchFlags[(PatchFlags["KEYED_FRAGMENT"] = 128)] = "KEYED_FRAGMENT"
  PatchFlags[(PatchFlags["UNKEYED_FRAGMENT"] = 256)] = "UNKEYED_FRAGMENT"
  PatchFlags[(PatchFlags["NEED_PATCH"] = 512)] = "NEED_PATCH"
  PatchFlags[(PatchFlags["DYNAMIC_SLOTS"] = 1024)] = "DYNAMIC_SLOTS"
  PatchFlags[(PatchFlags["DEV_ROOT_FRAGMENT"] = 2048)] = "DEV_ROOT_FRAGMENT"
  PatchFlags[(PatchFlags["HOISTED"] = -1)] = "HOISTED"
  PatchFlags[(PatchFlags["BAIL"] = -2)] = "BAIL"
})(_PatchFlags || (_PatchFlags = {}))
export const PatchFlags = _PatchFlags