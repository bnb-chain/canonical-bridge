import { EventName, EventData } from './events';

// Overloaded event handler type that provides type inference based on event name
export interface AnalyticsEventHandler {
  <T extends EventName>(eventName: T, eventData: EventData<T>): void | Promise<void>;
}

export interface AnalyticsConfig {
  /**
   * Whether analytics is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * User ID for tracking
   */
  userId?: string;

  /**
   * Event handler function that will be called for all events
   * Provides automatic type inference based on event name
   */
  onEvent?: AnalyticsEventHandler;
}
