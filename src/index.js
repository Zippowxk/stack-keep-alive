import components from'./components/index'

import { Transition as _Transition } from './components/Transition'

const plugin = {
  install (app) {
    for (const prop in components) {
      if (components.hasOwnProperty(prop)) {
        const component = components[prop]
        app.component(component.displayName || component.name, component)
      }
    }
  },
  "ATransition": _Transition
}

export default plugin