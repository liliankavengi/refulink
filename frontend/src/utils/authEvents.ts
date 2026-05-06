type AuthEventHandler = () => void;

class AuthEventEmitter {
  private listeners: Map<string, AuthEventHandler[]> = new Map();

  on(event: string, handler: AuthEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(handler);
  }

  off(event: string, handler: AuthEventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      this.listeners.set(
        event,
        handlers.filter(h => h !== handler)
      );
    }
  }

  emit(event: string): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler());
    }
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

export const authEvents = new AuthEventEmitter();