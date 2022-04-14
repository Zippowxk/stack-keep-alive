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

export const genKey = function (num, router) {
  return `keep-alive-vnode-key${Number(num)}${currentPathOf(router)}`;
};
export const getCurrentVM = function (router) {
  return router.currentRoute._value.matched.length > 0
    ? router.currentRoute._value.matched[0].instances.default.$
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
