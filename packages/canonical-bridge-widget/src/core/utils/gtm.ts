interface IReportParams {
  id: string;
  params?: { [key: string]: string | undefined };
}

export function reportEvent({ id, params }: IReportParams) {
  if (typeof window === 'undefined' || !(window as any).dataLayer) return;

  (window as any).dataLayer.push({
    event: id,
    ...params,
  });
}

export function createGTMEventListener() {
  return (eventName: string, eventData: any) => {
    const params: Record<string, string> = {};

    Object.entries(eventData || {}).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        params[key] = String(value);
      }
    });

    reportEvent({
      id: eventName,
      params,
    });
  };
}
