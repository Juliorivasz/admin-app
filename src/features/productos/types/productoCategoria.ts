// ==========================================
// Interfaces de la tabla intermedia Producto-Categoria
// ==========================================

export interface ProductoCategoriaCreate {
  categoria_id: number;
  es_principal: boolean;
}

export interface ProductoCategoria {
  categoria_id: number;
  nombre: string;
  es_principal: boolean;
}
