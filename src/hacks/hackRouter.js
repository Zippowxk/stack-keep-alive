import { isDef } from '../core/utils'
export class RouterHacker {
  constructor(router) {
    this.router = router
  }

  beforeReplace(cb,onerror) {
    const router = this.router;
    const rtmp = router.replace;
    const rtmpf = (location, onComplete, onAbort) => {
      cb()
      rtmp.call(router, location, onComplete, (e) => {
        onerror()
        isDef(onAbort) && onAbort(e);
      });
    };
    router.replace = function (location, onComplete, onAbort) {
      rtmpf(location, onComplete, onAbort);
    };
    return this
  }

  beforeGo(cb) {
    const { router } = this
    const gstmp = router.go;
    const gstmpf = (number) => {
      cb(number)
      return gstmp.call(router, number);
    };
    router.go = function (num) {
      return gstmpf(num);
    };
    return this
  }

  beforePush(cb) {
    const { router } = this
    const pstmp = router.push;
    const pstmpf = (location, onComplete, onAbort) => {
      cb()
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