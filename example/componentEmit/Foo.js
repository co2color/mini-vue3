import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log(props)
      emit('add', 1, 2)
      emit('add-foo', 3, 4)
    }
    return {
      emitAdd,
    }
  },
  render() {
    const btn = h(
      'button',
      {
        class: 'Foo-button',
        onClick: this.emitAdd,
      },
      'emitAddText'
    )
    return h(
      'div',
      {
        class: 'Foo',
      },
      [btn]
    )
  },
}
