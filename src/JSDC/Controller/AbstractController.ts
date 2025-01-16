import { Map } from 'leaflet'
import { IController } from './IController'

export default abstract class AbstractController implements IController {
  viewer: Map | undefined
  name: string
  _isDestroy: boolean = false
  constructor(name: string) {
    this.name = name
  }

  get isDestroy() {
    return this._isDestroy
  }

  init(viewer: Map) {
    this.viewer = viewer
    this._isDestroy = false
  }

  validateViewer() {
    if (!this.viewer) {
      throw new Error('viewer is undefined, init controller first')
    }
    return this.viewer
  }

  start() {
    this.validateViewer()
    return this
  }

  stop() {}

  destroy() {
    this.viewer = undefined
    this._isDestroy = true
  }
}
