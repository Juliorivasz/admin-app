// ==========================================
// Interfaces de Ingrediente (sin soft delete)
// ==========================================

export interface IngredienteBase {
  name: string;
  description: string;
  esAlergeno: boolean;
}

export interface Ingrediente extends IngredienteBase {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface IngredienteCreate extends IngredienteBase {}
export interface IngredienteUpdate extends Partial<IngredienteBase> {}
