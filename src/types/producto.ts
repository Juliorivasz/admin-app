// ==========================================
// Interfaces de Producto y sus relaciones N:N
// ==========================================

import type { ProductoCategoriaCreate } from "./productoCategoria";
import type { ProductoIngredienteCreate } from "./productoIngrediente";


export interface ProductoBase {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagen_url?: string | null;
  stock_cantidad: number;
  disponible: boolean;
}

export interface Producto extends ProductoBase {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface ProductoCreate extends ProductoBase {
  categorias?: ProductoCategoriaCreate[];
  ingredientes?: ProductoIngredienteCreate[];
}

export interface ProductoUpdate extends Partial<ProductoBase> {
  categorias?: ProductoCategoriaCreate[];
  ingredientes?: ProductoIngredienteCreate[];
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

export interface ProductoDetalle extends Producto {
  categorias: CategoriaEnProducto[];
  ingredientes: IngredienteDetalle[];
}
