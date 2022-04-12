export function hackHistory(history) {
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