
class Event<T = any> {
    private _listeners: Array<(arg?: T) => void> = []

    addEventListener (callback: (arg?: T) => void) {
        this._listeners.push(callback)
        return () => this.removeEventListener(callback)
    }
    removeEventListener (callback: (arg: T) => void) {
        const index = this._listeners.findIndex(e => e === callback)
        if (index < 0) return

        this._listeners.splice(index, 1)
    }
    removeAllEvents () {
        while (this._listeners.length > 0) {
            this.removeEventListener(this._listeners[0])
        }
    }
    raise =  (arg?: T) => {
        this._listeners.forEach(listener => listener(arg))
    }
}

export default Event
