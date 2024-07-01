import { createApp } from '../../lib/guide-mini-vue.esm.js'
import { App } from './App.js'

const rootComponent = document.querySelector('#app')

createApp(App).mount(rootComponent)

/*
h函数（即createVNode）的第一个参数type，就是App这个对象，
该对象相当于一个组件，包含render和setup等等。
createApp(App)说明创建一个App组件，mount(rootComponent)说明将App组件挂载到rootComponent上。
执行createApp(App).mount时，创建vnode，将vnoderootComponent传给render；
接着执行./render.ts中的render()函数。
render()函数中执行patch，在patch中判断vnode是否是element（对象）：
  如果是element则执行processComponent(vnode, container)
  否则，type是string，执行processElement

第一次执行patch的时候，vnode对象为:
{
  type: { render: Function, setup: Function },
  props: {},
  children: [],
}
因此会走processComponent，执行mountComponent
在mountComponent中，执行createComponentInstance(vnode)创建实例instance；
执行setupComponent(instance)；该函数完成两件事：
    1.此时vnode对象有render和setup两个方法（也就是App.js中的App对象）
      此时获取App中的setup并执行，setup返回data（即vue中的data），将该data挂载到instance上（instance.setupState = setupResult）
    2.将App.js中的render方法挂载到instance上（instance.render = render）
setupComponent执行完毕后，视角重新回到mountComponent函数中，执行setupRenderEffect(instance, container)：
    setupRenderEffect函数执行instance.render()（即App.js中App对象的render，不要和上面的render搞混）返回subTree，然后执行patch(subTree, container)；

第二次执行patch的时候，vnode对象,举例为:
{
    type: 'div',
    props: {},
    children: [
        {
            type: 'h1',
            props: {},
            children: 'Hello World'
        }
    ]
}
此时type类型是string，执行processElement，执行mountElement：
 mountElement函数用来创建dom节点，将子节点递归执行patch，直到子节点为string类型，将其赋值给dom节点的textContent属性。
 最后，将dom节点挂载到container上（container.appendChild）

*/
