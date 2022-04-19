import { createRouter, createWebHistory } from "vue-router";
import { StackKeepAlive } from "../src/components/KeepAlive";
export const Foo = {
  name: "foo",
  template:
    '<div><p>this is foo page {{a}}</p><router-link to="/bar">Go to Bar</router-link></div>',
  data() {
    return {
      b: 20,
    };
  },
  beforeCreate() {
    console.log(this);
    // console.log(this.$.ctx === this)
    console.log("foo beforeCreate");
  },
  setup(props) {
    const a = 10;
    return {
      a,
    };
  },
  unmounted() {
    console.log("foo unmounted");
  },
  deactivated() {
    console.log("foo deactivate");
  },
  activated() {
    console.log("foo activate");
  },
};
export const Bar = {
  name: "bar",
  props: ["test_prop"],
  data() {
    return { test_data: "help", date: new Date() };
  },
  setup(props) {
    const a = [];
    for (let index = 0; index < 1000; index++) {
      a.push(new Date());
    }
    return {
      a,
    };
  },
  template:
    '<div><p>this is bar page</p><router-link to="/baz">Go to Baz</router-link></div>',
  beforeCreate() {
    console.log("bar beforeCreate");
  },
  unmounted() {
    console.log("bar unmounted");
  },
  deactivated() {
    console.log("bar deactivate");
  },
  activated() {
    console.log("bar activate");
  },
};
export const Baz = {
  name: "baz",
  template:
    '<div><p>this is baz page</p><div @click="goback">goBack</div><router-link to="/foo">Go to Foo</router-link></div>',
  methods: {
    goback() {
      this.$router.back();
    },
  },
  activated() {
    console.log("baz activate");
  },
  deactivated() {
    console.log("baz deactivate");
  },
  unmounted() {
    console.log("baz unmounted");
  },
};
export const Home = {
  name: "home",
  template:
    '<div><p>this is home page</p><div @click="goback">goBack</div><router-link to="/foo">Go to Foo</router-link></div>',
  methods: {
    goback() {
      this.$router.back();
    },
  },
  deactivated() {
    console.log("home deactivate");
  },
  activated() {
    console.log("home activate");
  },
  unmounted() {
    console.log("home unmounted");
  },
};

export const App = {
  template: `
    <router-view v-slot="{ Component }">
        <stack-keep-alive v-slot='{ key }'> 
            <component :is="Component" :key='key'/>
        </stack-keep-alive>
    </router-view>
    `,
  components: { StackKeepAlive },
};

export const AppStay = {
  template: `
      <router-view v-slot="{ Component }">
          <stack-keep-alive v-slot='{ key }' :replaceStay="['/bar']"> 
              <component :is="Component" :key='key'/>
          </stack-keep-alive>
      </router-view>
      `,
  components: { StackKeepAlive },
};

export const routes = [
  { path: "/", component: Home },
  { path: "/foo", component: Foo },
  { path: "/bar", component: Bar },
  { path: "/baz", component: Baz },
];
