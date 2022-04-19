import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { routes, App } from "./routes.js";
import { currentPathOf } from "@/core/utils.js";

jest.setTimeout(500000);
let core = undefined;
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
global.router = router;

const log = global.console.log;
const mockConsoleLog = jest.fn((msg) => log(msg));
global.console.log = mockConsoleLog;

const after = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

beforeAll(async () => {
  mount(App, {
    global: {
      plugins: [router],
    },
  });
  await router.isReady();
  if (global.__core) {
    core = global.__core;
  }
});

// /->foo->bar->baz B-> bar R-> baz B-> foo
//                  3-baz     2-bar   2-baz
describe("thrice push,once back", () => {
  test("core init", async () => {
    expect(router._stack).toBe(0);
    core.genInitialKeyNextTime();
    expect(core.genKeyForVnode()).toBe("keep-alive-vnode-key-0-/");
    await router.isReady();
  });

  test("history push 1", async () => {
    await router.push("/foo");
    expect(router._stack).toBe(0);
    expect(core.genKeyForVnode()).toBe("keep-alive-vnode-key-1-/foo");
    expect(currentPathOf(router)).toBe("/foo");
  });

  test("core push 2", async () => {
    expect(router._stack).toBe(1);
    await router.push("/bar");
    expect(core.genKeyForVnode()).toBe("keep-alive-vnode-key-2-/bar");
    expect(currentPathOf(router)).toBe("/bar");
  });

  test("core push 3", async () => {
    expect(router._stack).toBe(2);
    await router.push("/baz");
    expect(core.genKeyForVnode()).toBe("keep-alive-vnode-key-3-/baz");
    expect(currentPathOf(router)).toBe("/baz");
  });

  test("core pop 1", async () => {
    await router.go(-1);
    await after(100);
    const len = mockConsoleLog.mock.calls.length;
    const times = mockConsoleLog.mock.calls.length;
    expect(times).toBe(13);
    expect(mockConsoleLog.mock.calls[len - 2][0]).toBe("bar activate");
    expect(mockConsoleLog.mock.calls[len - 1][0]).toBe("baz unmounted");
    expect(currentPathOf(router)).toBe("/bar");
  });

  test("core replace 1", async () => {
    await router.replace("/baz");
    await after(100);
    const len = mockConsoleLog.mock.calls.length;
    const times = mockConsoleLog.mock.calls.length;
    expect(times).toBe(16);
    expect(mockConsoleLog.mock.calls[len - 2][0]).toBe("baz activate");
    expect(mockConsoleLog.mock.calls[len - 1][0]).toBe("bar unmounted");
    expect(currentPathOf(router)).toBe("/baz");
  });

  test("core back 1", async () => {
    await router.go(-1);
    await after(100);
    const len = mockConsoleLog.mock.calls.length;
    const times = mockConsoleLog.mock.calls.length;
    expect(times).toBe(19);
    expect(mockConsoleLog.mock.calls[len - 2][0]).toBe("foo activate");
    expect(mockConsoleLog.mock.calls[len - 1][0]).toBe("baz unmounted");
    expect(currentPathOf(router)).toBe("/foo");
  });
});
