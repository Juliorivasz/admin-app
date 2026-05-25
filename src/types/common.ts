// ==========================================
// Tipos utilitarios globales
// ==========================================

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
}
