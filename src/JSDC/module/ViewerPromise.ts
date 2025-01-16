import { Map } from 'leaflet'

export default class ViewerPromise {
  viewer: Map | undefined
  stack: Array<(viewer: Map) => void>
  constructor() {
    this.viewer = undefined
    this.stack = []
  }
  get asyncViewer() {
    return new Promise<Map>((resolve) => {
      this.execute((viewer) => resolve(viewer))
    })
  }
  setViewer(viewer: Map) {
    this.viewer = viewer
    this.stack.forEach((task) => task(viewer))
    this.stack = []
  }
  execute(callback: (viewer: Map) => void) {
    this.viewer || this.stack.push(callback)
    this.viewer && callback(this.viewer)
  }
}
