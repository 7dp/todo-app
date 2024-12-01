import { Storage as ReduxStorage } from 'redux-persist'

import { MMKVStorage } from './storage'

const persistStorage: ReduxStorage = {
  setItem: (key, value) => {
    MMKVStorage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key) => {
    const value = MMKVStorage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: (key) => {
    MMKVStorage.delete(key)
    return Promise.resolve()
  },
}

export { persistStorage }
