export class Mediator {
  private readonly events: Event[] = [];

  register(name: string, callback: Function): void {
    this.events.push({ name, callback });
  }

  async notify(name: string, data?: any): Promise<void> {
    for (const event of this.events) {
      if (event.name === name) {
        await event.callback(data);
      }
    }
  }
}

type Event = { name: string; callback: Function };
