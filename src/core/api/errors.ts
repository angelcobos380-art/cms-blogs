import axios from 'axios';

export interface FieldValidationError {
  field: string;
  message: string;
}

export interface NormalizedApiError {
  status: number;
  message: string;
  fieldErrors: FieldValidationError[];
}

interface FastApiDetailItem {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (!axios.isAxiosError(error)) {
    return {
      status: 0,
      message: error instanceof Error ? error.message : 'Error inesperado.',
      fieldErrors: [],
    };
  }

  const status = error.response?.status ?? 0;
  const data = error.response?.data as { detail?: string | FastApiDetailItem[] } | undefined;
  const detail = data?.detail;

  if (typeof detail === 'string') {
    return { status, message: detail, fieldErrors: [] };
  }

  if (Array.isArray(detail)) {
    const fieldErrors: FieldValidationError[] = detail.map((item) => {
      const loc = item.loc ?? [];
      const field = String(loc[loc.length - 1] ?? 'general');
      return {
        field,
        message: item.msg ?? 'Valor inválido.',
      };
    });
    const summary = fieldErrors.map((e) => e.message).join(' · ') || 'Error de validación.';
    return { status, message: summary, fieldErrors };
  }

  if (status === 0) {
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      fieldErrors: [],
    };
  }

  return {
    status,
    message: error.message || 'Ocurrió un error al procesar la solicitud.',
    fieldErrors: [],
  };
}
