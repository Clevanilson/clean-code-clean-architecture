export interface Queue {
  connect(): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
  publish(queue: string, data: any): Promise<void>;
}
