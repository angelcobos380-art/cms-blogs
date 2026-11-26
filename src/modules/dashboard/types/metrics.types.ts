export type ViewsRange = '7d' | '30d' | '12m';
export type ViewsGranularity = 'day' | 'week';

export interface MetricsSummary {
  totals: {
    posts: number;
    by_status: {
      BORRADOR: number;
      PUBLICADO: number;
      ARCHIVADO: number;
    };
    views: number;
  };
  top_tags: Array<{ tag: string; count: number }>;
  posts_per_month: Array<{ month: string; created: number; published: number }>;
  top_posts: Array<{ post_id: string; slug: string; title: string; views: number }>;
}

export interface ViewsSeriesResponse {
  from: string;
  to: string;
  granularity: ViewsGranularity;
  series: Array<{ date: string; views: number }>;
}
