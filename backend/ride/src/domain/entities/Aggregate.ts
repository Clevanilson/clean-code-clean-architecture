export class Aggregate {
  listeners: { callback: (data: any) => void; name: string }[];

  constructor() {
    this.listeners = [];
  }

  register(name: string, callback: (data: any) => void): void {
    this.listeners.push({ name, callback });
  }

  notify(event: Object): void {
    for (const listener of this.listeners) {
      if (listener.name === event.constructor.name) listener.callback(event);
    }
  }
}
