// ==========================================
// Interfaces de la tabla intermedia Producto-Ingrediente
// ==========================================

export interface ProductoIngredienteCreate {
  ingrediente_id: number;
  es_removible: boolean;
}

export interface ProductoIngredienteUpdate {
  es_removible?: boolean;
}

export interface ProductoIngrediente {
  producto_id: number;
  ingrediente_id: number;
  es_removible: boolean;
}
