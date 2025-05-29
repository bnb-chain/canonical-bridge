import { EventData, EventListener, EventName, EventParams } from './events';

// Define specific listener types
type SpecificEventListener = (name: string, data: any) => void | Promise<void>;
type GlobalEventListener = (eventName: string, eventData: any) => void | Promise<void>;

export class EventEmitter {
  private listeners: Map<string, Set<SpecificEventListener>> = new Map();
  private globalListeners: Set<GlobalEventListener> = new Set();
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // Listen to specific events - supports type inference
  on<T extends EventName>(eventName: T, listener: EventListener<T>): () => void {
    const wrappedListener: SpecificEventListener = (name: string, data: any) => {
      if (name === eventName) {
        listener(data as EventData<T>);
      }
    };

    if (!this.listeners.has(eventName as string)) {
      this.listeners.set(eventName as string, new Set());
    }
    this.listeners.get(eventName as string)?.add(wrappedListener);

    return () => {
      this.listeners.get(eventName as string)?.delete(wrappedListener);
    };
  }

  // Listen to all events
  onAll(
    listener: (eventName: EventName, eventData: EventData<EventName>) => void | Promise<void>,
  ): () => void {
    const wrappedListener: GlobalEventListener = (eventName: string, eventData: any) => {
      listener(eventName as EventName, eventData);
    };

    this.globalListeners.add(wrappedListener);

    return () => {
      this.globalListeners.delete(wrappedListener);
    };
  }

  // Type-safe emit method
  async emit<T extends EventName>(eventName: T, eventData: EventParams<T>): Promise<void> {
    const enhancedData: EventData<T> = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    } as EventData<T>;

    // Trigger specific event listeners
    const eventListeners = this.listeners.get(eventName as string);
    if (eventListeners) {
      const promises = Array.from(eventListeners).map((listener) =>
        Promise.resolve(listener(eventName as string, enhancedData)),
      );
      await Promise.allSettled(promises);
    }

    // Trigger global listeners
    const globalPromises = Array.from(this.globalListeners).map((listener) =>
      Promise.resolve(listener(eventName as string, enhancedData)),
    );
    await Promise.allSettled(globalPromises);
  }

  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Reset session
  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  // Remove all listeners
  removeAllListeners(): void {
    this.listeners.clear();
    this.globalListeners.clear();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
