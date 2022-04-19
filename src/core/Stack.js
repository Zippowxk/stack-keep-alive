export default class HistoryStack {
  constructor(destroyCache) {
    this.historyStackMap = [];
    this.destroyCache = destroyCache
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
        const vm = last.pop()
        vm && this.destroyCache(vm)
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
