// https://developers.google.com/tag-platform/gtagjs/reference
export type TGtagCommand = 'config' | 'set' | 'get' | 'event' | 'consent';

export interface IReportEvent {
  command?: TGtagCommand;
  name: string;
  data: { [key: string]: string };
  setData?: { [key: string]: string };
}

// https://developers.google.com/tag-platform/gtagjs/configure
export function reportEvent({ command = 'event', name, data }: IReportEvent) {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag(command, name, data);
}
