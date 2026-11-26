import { httpClient } from '@core/api/httpClient';
import type { MediaUploadResponse } from '../types/post.types';

export const mediaApi = {
  async upload(file: File, alt?: string): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (alt?.trim()) {
      formData.append('alt', alt.trim());
    }
    const { data } = await httpClient.post<MediaUploadResponse>('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
