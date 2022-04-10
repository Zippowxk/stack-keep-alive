import { queuePostFlushCb } from 'Vue';
import { isArray } from '@vue/shared';

export const MoveType = {
    ENTER : 0,
    LEAVE : 1,
    REORDER : 2
  }

function queueEffectWithSuspense(
    fn,
    suspense
  ) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn)
      } else {
        suspense.effects.push(fn)
      }
    } else {
      queuePostFlushCb(fn)
    }
  }
export const queuePostRenderEffect = __FEATURE_SUSPENSE__
  ? queueEffectWithSuspense
  : queuePostFlushCb