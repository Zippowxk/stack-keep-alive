export const ShapeFlags = {
    ELEMENT : 1,
    FUNCTIONAL_COMPONENT : 1 << 1,
    STATEFUL_COMPONENT : 1 << 2,
    TEXT_CHILDREN : 1 << 3,
    ARRAY_CHILDREN : 1 << 4,
    SLOTS_CHILDREN : 1 << 5,
    TELEPORT : 1 << 6,
    SUSPENSE : 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE : 1 << 8,
    COMPONENT_KEPT_ALIVE : 1 << 9,
    COMPONENT :  1 << 1 |  1 << 2
  }
  
  export const isFunction = val => typeof val === 'function'