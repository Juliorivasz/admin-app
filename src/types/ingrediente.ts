// ==========================================
// Interfaces de Ingrediente (sin soft delete)
// ==========================================

export interface IngredienteBase {
  nombre: string;
  descripcion?: string | null;
  es_alergeno: boolean;
  cantidad: number;
  unidad_medida: string;
}

export interface Ingrediente extends IngredienteBase {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface IngredienteCreate extends IngredienteBase {}
export interface IngredienteUpdate extends Partial<IngredienteBase> {}
