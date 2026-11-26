import { httpClient } from '@core/api/httpClient';
import type { MetricsSummary, ViewsGranularity, ViewsSeriesResponse } from '../types/metrics.types';

export const metricsKeys = {
  all: ['metrics'] as const,
  summary: (months = 12, top = 5) => [...metricsKeys.all, 'summary', months, top] as const,
  views: (params: { from: string; to: string; granularity: ViewsGranularity; postId?: string }) =>
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
    post_id?: string;
  }): Promise<ViewsSeriesResponse> {
    const query: Record<string, string> = {
      from: params.from,
      to: params.to,
      granularity: params.granularity,
    };
    if (params.post_id) query.post_id = params.post_id;
    const { data } = await httpClient.get<ViewsSeriesResponse>('/metrics/views', { params: query });
    return data;
  },
};
