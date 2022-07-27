# Stack-Keep-Alive

## Introdaction

English | [中文](./README_CN.md)

`Stack-Keep-Alive` is an automatic management tool for page cache in `Vue.js` (Vue 3.x) project. 

[Vue2.x Version](https://github.com/Zippowxk/vue-router-keep-alive-helper)

[Online Demo](http://xinkai.wang/stack-keep-alive-sample/dist/), Check the Vue-devtools Panel


![img](./assets/stack.gif)

### Why do you need this plugin

The built-in `keep-alive` component is very useful in development, but it is not intelligent enough, it is difficult to clean up the page cache later, you need to use `exclude` and `include` API to save memory, and it cannot be accurately destroyed for different pages created by the same component.

If you have experienced mobile native development, you will not be troubled by this problem, because the model similar to NavigationController to manage each page is a stack structure, and the top page of the stack is destroyed when returning back.(The API is `push` and `pop` )



### Features

1. Automatically detect forward or backward
2. Automatically destroy the current page cache when routing back
3. Automatically create a new cache instance when routing forward, regardless of whether the component is cached or not
4. After refreshing the page, it is still able to accurately identify forward or backward
5. `replaceStay` whitelist helps cache pages when tab switching
6. `singleton` allows you to set a globally unique page instance
7. `sk-transition` allows you to use two animations to simulate [the native stacking effect](http://xinkai.wang/stack-keep-alive-sample/dist/)

### Usage

1. ```npm i -s stack-keep-alive``` | ```yarn add stack-keep-alive```
2. Replace the ``keep-alive`` component with ``stack-keep-alive`` (no need to import, registered global component)
```vue
<router-view v-slot="{ Component }">
  <stack-keep-alive v-slot='{ key }'> 
      <component :is="Component" :key='key'/>
  </stack-keep-alive>
</router-view>
```
3. When the app is initialized, use the StackKeepAlive plugin
```javascript
import StackKeepAlive from 'stack-keep-alive'
const app = Vue.createApp({})
app.use(StackKeepAlive)
...
```

### Configuration

#### 1. replace whitelist
  
  When the tab bar is switched, some tab pages need to be retained, and these paths can be configured in replaceStay
```vue
<stack-keep-alive v-slot='{ key }' :replaceStay='["/foo"]'> 
    <component :is="Component" :key='key'/>
</stack-keep-alive>
```
#### 2. transition
For use with transition, you need to replace the transition component with the built-in sk-transition component.Use `name` and `back_name` to achieve two different animation effects. [Sameple Code here](https://github.com/Zippowxk/stack-keep-alive-sample/blob/main/src/App4.vue)
```vue
    <router-view v-slot="{ Component }">
      <sk-transition name='slide-left' back_name='slide-right'>
        <stack-keep-alive v-slot="{ key }">
          <component :is="Component" :key='key'/>
        </stack-keep-alive>
      </sk-transition>
    </router-view>
```
#### 3. singleton route
Sometimes it is expected that a component is only created once in the entire application life cycle, such as the common shopping cart page, in this case, use `singleton` to configure singleton route

```vue
<stack-keep-alive v-slot='{ key }' :singleton='["/foo"]'> 
    <component :is="Component" :key='key'/>
</stack-keep-alive>
```

### Sample code

[Sample code](https://github.com/Zippowxk/stack-keep-alive-sample)

[Online demo](http://xinkai.wang/stack-keep-alive-sample/dist/)

![Animation](https://github.com/Zippowxk/stack-keep-alive-sample/blob/main/imgs/sample.gif)


<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->