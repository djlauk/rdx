import { Store, Action, ActionEvent } from '../typings/store'
import { PersistOptions } from '../typings/persist'
import { stateEvent } from './const'

export function persist<S, T extends Store>(store: T, options?: Partial<PersistOptions<S>>) {
  const opt = {
    name: location.hostname,
    storage: localStorage,
    serializer: JSON,
    filter: (_: Action) => true,
    persist: (state: S) => state,
    delay: 0,
    ...options
  }

  const state = opt.storage.getItem(opt.name)
  if (state) {
    store.state = { ...store.state, ...opt.serializer.parse(state) }
  }

  let task = 0

  store.addEventListener(stateEvent, e => {
    const { action } = (<CustomEvent<ActionEvent>>e).detail

    if (opt.filter(action)) {
      if (task) {
        window.clearTimeout(task)
      }
      task = window.setTimeout(() => {
        opt.storage.setItem(opt.name, opt.serializer.stringify(opt.persist(store.state)))
        task = 0
      }, opt.delay)
    }
  })

  return store
}
