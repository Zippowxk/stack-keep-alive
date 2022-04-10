import {
    isFunction,
  } from './share'

export function getComponentName(Component) {
    return isFunction(Component)
      ? Component.displayName || Component.name
      : Component.name
  }
  