export type Listener<T extends ReadonlyArray<unknown>> = (...args: T) => void;

export class EventEmitter<T extends Record<string, unknown[]>> {
  private events: { [K in keyof T]?: Listener<T[K]>[] } = {};

  constructor() {}

  public on<K extends keyof T>(event: K, listener: Listener<T[K]>) {
    const listeners = this.events[event] ?? [];

    listeners.push(listener);

    this.events[event] = listeners;
  }
  public unsubscribe<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    const listeners = this.events[event];
    if (!listeners) {
      return;
    }

    const events = listeners.filter((l) => l !== listener);

    this.events[event] = events;
  }
}
