import { httpClient } from '@core/api/httpClient';
import type { MetricsSummary, ViewsGranularity, ViewsSeriesResponse } from '../types/metrics.types';

export const metricsKeys = {
  all: ['metrics'] as const,
  summary: (months = 12, top = 5) => [...metricsKeys.all, 'summary', months, top] as const,
  views: (params: { from: string; to: string; granularity: ViewsGranularity }) =>
    [...metricsKeys.all, 'views', params] as const,
};

export const metricsApi = {
  async summary(months = 12, top = 5): Promise<MetricsSummary> {
    const { data } = await httpClient.get<MetricsSummary>('/metrics/summary', {
      params: { months, top },
    });
    return data;
  },

  async views(params: {
    from: string;
    to: string;
    granularity: ViewsGranularity;
  }): Promise<ViewsSeriesResponse> {
    const { data } = await httpClient.get<ViewsSeriesResponse>('/metrics/views', { params });
    return data;
  },
};
