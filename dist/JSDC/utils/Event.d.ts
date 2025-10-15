declare class Event<T = any> {
    private _listeners;
    addEventListener(callback: (arg?: T) => void): () => void;
    removeEventListener(callback: (arg: T) => void): void;
    removeAllEvents(): void;
    raise: (arg?: T) => void;
}
export default Event;
