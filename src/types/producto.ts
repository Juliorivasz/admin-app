// ==========================================
// Interfaces de Producto y sus relaciones N:N
// ==========================================




export interface ProductoBase {
  name: string;
  price: number;
  stock_cantidad: number;
  disponible: boolean;
}

export interface ProductoCategoriaRead {
  categoria_id: number;
  es_principal: boolean;
  delete_at?: string | null;
}

export interface ProductoIngredienteRead {
  ingrediente_id: number;
}

export interface Producto extends ProductoBase {
  id: number;
  categorias: ProductoCategoriaRead[];
  ingredientes: ProductoIngredienteRead[];
}

export interface ProductoIngredientePayload {
  ingrediente_id: number;
  cantidad: number;
  unidad_medida_id: number;
  es_removible: boolean;
}

export interface ProductoCreate extends ProductoBase {
  categorias: number[];
  ingredientes?: ProductoIngredientePayload[] | null;
  unidad_venta_id: number;
}

export interface ProductoUpdate extends Partial<ProductoBase> {
  categorias?: number[] | null;
  ingredientes?: ProductoIngredientePayload[] | null;
  unidad_venta_id?: number | null;
}



// Vistas anidadas para el detalle del producto
export interface CategoriaEnProducto {
  id: number;
  nombre: string;
  es_principal: boolean;
}

export interface IngredienteDetalle {
  ingrediente_id: number;
  nombre: string;
  es_removible: boolean;
  es_alergeno: boolean;
}

export interface ProductoDetalle extends Omit<Producto, 'categorias' | 'ingredientes'> {
  categorias: CategoriaEnProducto[];
  ingredientes: IngredienteDetalle[];
}
