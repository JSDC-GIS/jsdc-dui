import { values, isEmpty, pick, omit } from 'lodash'

export default class AssociativeArray<T> {
  values: Array<T> = []
  private _hash: { [k: string]: T } = {}

  gets(keys: string[]) {
    const target = pick(this._hash, keys)
    return values(target)
  }
  omit(keys: string[]) {
    const target = omit(this._hash, keys)
    return values(target)
  }
  get(key: string) {
    return this._hash[key]
  }
  set(key: string, value: T) {
    this._hash[key] = value
    this.values = values(this._hash)
  }
  remove(key: string) {
    if (this.contain(key)) {
      delete this._hash[key]
      this.values = values(this._hash)
    }
  }
  removeAll() {
    this._hash = {}
    this.values = []
  }
  contain(key: string) {
    return isEmpty(this.get(key))
  }
}
