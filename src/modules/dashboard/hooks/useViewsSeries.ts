import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { metricsApi, metricsKeys } from '../api/metricsApi';
import type { ViewsGranularity, ViewsRange } from '../types/metrics.types';

export function computeDateRange(range: ViewsRange): { from: string; to: string } {
  const today = new Date();
  const days = range === '7d' ? 6 : range === '30d' ? 29 : 364;
  return {
    from: format(subDays(today, days), 'yyyy-MM-dd'),
    to: format(today, 'yyyy-MM-dd'),
  };
}

export function useViewsSeries(
  range: ViewsRange,
  granularity: ViewsGranularity,
  postId?: string,
) {
  const bounds = useMemo(() => computeDateRange(range), [range]);

  return useQuery({
    queryKey: metricsKeys.views({ ...bounds, granularity, postId: postId || undefined }),
    queryFn: () =>
      metricsApi.views({
        ...bounds,
        granularity,
        post_id: postId || undefined,
      }),
  });
}
