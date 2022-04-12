<template>
  <router-view v-slot="{ Component }">
    <stack-keep-alive>
        <component :is="Component"/>
    </stack-keep-alive>
  </router-view>
</template>
<script>
export default {
  name: 'KeepAliveRouterView',
}
</script>
