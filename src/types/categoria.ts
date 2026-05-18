// ==========================================
// Interfaces de Categoría
// ==========================================

export interface CategoriaBase {
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
  parent_id?: number | null;
}

export interface Categoria extends CategoriaBase {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface CategoriaCreate extends CategoriaBase {}
export interface CategoriaUpdate extends Partial<CategoriaBase> {}

export interface ProductoEnCategoria {
  id: number;
  nombre: string;
  precio_base: number;
  disponible: boolean;
}

export interface CategoriaDetalle extends Categoria {
  productos_vinculados: ProductoEnCategoria[];
}
