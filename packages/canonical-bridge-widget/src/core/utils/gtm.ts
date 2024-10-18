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
