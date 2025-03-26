type EventMap = {
  [Events.NEW_CHAT]: void;
};

type EventCallback<T> = T extends void ? () => void : (data: T) => void;

class EventEmitter {
  private listeners: { [K in keyof EventMap]?: EventCallback<EventMap[K]>[] } = {};

  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
  }

  off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]?.filter(cb => cb !== callback);
  }

  emit<K extends keyof EventMap>(event: K, data?: EventMap[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event]?.forEach(callback => {
      if (data === undefined) {
        (callback as () => void)();
      } else {
        (callback as (data: EventMap[K]) => void)(data);
      }
    });
  }
}

export enum Events {
  NEW_CHAT = 'NEW_CHAT',
}

export const eventEmitter = new EventEmitter(); 