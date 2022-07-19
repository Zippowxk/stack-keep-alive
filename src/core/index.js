import {
  getCurrentVM,
  isDef,
  getStateId,
  resolvePushedVm,
  genKey,
  isPlaceHolderVm,
  replaceState,
  currentPathOf,
  getStateForward
} from './utils';

import HistoryStack from './Stack';

import { nextTick } from 'vue'

import { hackHistory, RouterHacker } from '../hacks/index';

let _core
export const SingleCore = function(args) {
  if (!_core) {
    _core = new Core()
  }
  if (args) {
    _core.setup(args)
  }
  return _core
}

export default class Core {
  constructor() {
  }
  setup({ router, pruneCacheEntry , replaceStay }) {

    hackHistory(history)
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
    this._initial = true; //闲置状态
    this.historyStack = new HistoryStack((_vm) => {
      if ( _vm ) {
        this.destroyCaches( _vm.vnode.key )
      }
    });
    this.init();
    // expose this core
    this.router.__core = this
    this._routeTo = undefined
    // this.isBacking = false
  }


  get isBacking() {
    // console.log(history.state)
    // console.log(from.fullPath)
    // console.log(from.fullPath)
    return !(this.isPush || this.isReplace)
    // return from ? getStateForward() === from.fullPath : false
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
    this._initial = true
  }
  /**
   * 
   * @returns generator for the vnode key of keep-alive slots
   */
  genKeyForVnode() {
    const { router } = this
    // console.log('genKey- isPush',this.isPush)
    // console.log('genKey- isReplace_initial',this.isReplace || this._initial)
    if (this.isReplace || this._initial) {
      this._initial = false
      return genKey(this.stackPointer, router, this._routeTo);
    } else if ( this.isPush) {
      return genKey(this.stackPointer + 1, router, this._routeTo);
    } else {
      return genKey(this.stackPointer - 1, router, this._routeTo);
    }
  }
  /**
   * use afterEach hook to set state.key and add the reference of vm to the historyStack
   */
  routerHooks() {
    const { router } = this
    router.beforeEach((to, from) => {
      this._routeTo = to.path
    })
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
    this._hackRouter = new RouterHacker(this.router)
    this._hackRouter
    .beforeReplace(()=>{
      this.isReplace = true;
      this.replacePrePath = currentPathOf(this.router);
    },(e)=>{
      this.isReplace = false;
      this.replacePrePath = undefined;
    })
    .beforeGo((num)=>{
      this.isReplace = false;
    })
    .beforePush(()=>{
      this.isReplace = false;
    })
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
    const avoidReplaceQuery = this.replacePrePath === currentPathOf(this.router)
    const shouldDestroy = 
      !(isDef(this.replacePrePath) && this.replaceStay.includes(this.replacePrePath)) 
      && 
      !avoidReplaceQuery

    if (shouldDestroy) {
      // this.destroyCaches(this.pre.vnode.key)
      this.historyStack.pop(true);
    } else if (!avoidReplaceQuery) {
      // this.pre?.$clearParent?.(vm); 
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
