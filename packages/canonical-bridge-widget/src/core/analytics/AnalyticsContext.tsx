import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';

import { EventData, EventName, EventParams } from './events';
import { EventEmitter } from './EventEmitter';

export interface AnalyticsContextValue {
  // Emit predefined events - supports type inference
  emit: <T extends EventName>(eventName: T, eventData: EventParams<T>) => Promise<void>;

  // Listen to events - supports type inference
  on: <T extends EventName>(
    eventName: T,
    listener: (eventData: EventData<T>) => void | Promise<void>,
  ) => () => void;

  // Listen to all events
  onAll: (
    listener: (eventName: EventName, eventData: EventData<EventName>) => void | Promise<void>,
  ) => () => void;

  // Set user ID
  setUserId: (userId: string) => void;

  // Reset session
  resetSession: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  onEvent?: (eventName: EventName, eventData: EventData<EventName>) => void | Promise<void>;
  userId?: string;
}

export function AnalyticsProvider({ children, onEvent, userId }: AnalyticsProviderProps) {
  const emitterRef = useRef<EventEmitter>();

  if (!emitterRef.current) {
    emitterRef.current = new EventEmitter();
  }

  useEffect(() => {
    if (userId) {
      emitterRef.current?.setUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (onEvent && emitterRef.current) {
      return emitterRef.current.onAll(onEvent);
    }
  }, [onEvent]);

  const emit = useCallback(async <T extends EventName>(eventName: T, eventData: EventParams<T>) => {
    await emitterRef.current?.emit(eventName, eventData);
  }, []);

  const on = useCallback(
    <T extends EventName>(
      eventName: T,
      listener: (eventData: EventData<T>) => void | Promise<void>,
    ) => {
      return emitterRef.current?.on(eventName, listener) || (() => {});
    },
    [],
  );

  const onAll = useCallback(
    (listener: (eventName: EventName, eventData: EventData<EventName>) => void | Promise<void>) => {
      return emitterRef.current?.onAll(listener) || (() => {});
    },
    [],
  );

  const setUserId = useCallback((userId: string) => {
    emitterRef.current?.setUserId(userId);
  }, []);

  const resetSession = useCallback(() => {
    emitterRef.current?.resetSession();
  }, []);

  const value: AnalyticsContextValue = {
    emit,
    on,
    onAll,
    setUserId,
    resetSession,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
