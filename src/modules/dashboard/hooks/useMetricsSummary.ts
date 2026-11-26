import { useQuery } from '@tanstack/react-query';
import { metricsApi, metricsKeys } from '../api/metricsApi';

export function useMetricsSummary(months = 12, top = 5) {
  return useQuery({
    queryKey: metricsKeys.summary(months, top),
    queryFn: () => metricsApi.summary(months, top),
  });
}
