export type Listener<T extends ReadonlyArray<unknown>> = (...args: T) => void;

export class EventEmitter<T extends Record<string, unknown[]>> {
  private events: { [K in keyof T]?: Listener<T[K]>[] } = {};

  constructor() {}

  private filterListeners<K extends keyof T>(event: K, listener: Listener<T[K]>) {
    return this.events[event]?.filter((l) => l !== listener);
  }

  private getEvents<K extends keyof T>(event: K): Listener<T[K]>[] {
    return this.events[event] ?? [];
  }

  public on<K extends keyof T>(event: K, listener: Listener<T[K]>) {
    const listeners = this.getEvents(event);

    listeners.push(listener);

    this.events[event] = listeners;
  }
  public off<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    const listeners = this.events[event];
    if (!listeners) {
      return;
    }

    const events = this.filterListeners(event, listener);

    this.events[event] = events;
  }

  public emit<K extends keyof T>(event: K, ...args: T[K]) {
    const events = this.events[event];

    if (!events) {
      return;
    }

    events.map((event) => event(...args));
  }

  public once<K extends keyof T>(event: K, listener: Listener<T[K]>) {
    const listeners = this.getEvents(event);

    const handler: Listener<T[K]> = (...args) => {
      listener(...args);
      this.events[event] = this.filterListeners(event, handler);
    };

    this.events[event] = listeners.concat(handler);
  }
}
