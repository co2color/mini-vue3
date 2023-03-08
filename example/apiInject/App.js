import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js'

const FatherComponent = {
  name: 'FatherComponent',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h(ChildComponent)])
  },
}

const ChildComponent = {
  name: 'ChildComponent',
  setup() {
    provide('foo', 'fooVal_Child')
    const foo = inject('foo')
    const bar = inject('bar')
    return {
      foo,
      bar,
    }
  },
  render() {
    return h('div', {}, [
      h('p', {}, `Childfoo:${this.foo}---Childbar:${this.bar}`),
      h(SonComponent),
    ])
  },
}

const SonComponent = {
  name: 'SonComponent',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    return {
      foo,
      bar,
    }
  },
  render() {
    return h('div', {}, `Sonfoo: ${this.foo}---Sonbar: ${this.bar}`)
  },
}

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h(FatherComponent)])
  },
}
