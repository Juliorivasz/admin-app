import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronDown, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface CategoriaTreeViewProps {
  data: any[];
  onRowClick: (row: any) => void;
}

export interface TreeNode {
  item: any;
  children: TreeNode[];
  depth: number;
}

function buildTree(flatData: any[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // 1. Crear nodos
  flatData.forEach(item => {
    map.set(item.id, { item, children: [], depth: 0 });
  });

  // 2. Vincular padres e hijos
  flatData.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 3. Calcular profundidad
  function setDepth(nodes: TreeNode[], depth: number) {
    nodes.forEach(n => {
      n.depth = depth;
      setDepth(n.children, depth + 1);
    });
  }
  setDepth(roots, 0);

  return roots;
}
const CategoriaTreeView = ({ data, onRowClick }: CategoriaTreeViewProps) => {
  // Estado de expandidos. Por defecto, expandir todos
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Inicializar expandidos una vez cuando la data carga
  useEffect(() => {
    const allIds = data.map(d => d.id);
    setExpandedIds(new Set(allIds));
  }, [data]);
  const toggleExpand = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const tree = useMemo(() => buildTree(data), [data]);

  if (data.length === 0) {
    return (
      <div className="w-full rounded-xl border border-border bg-surface flex flex-col items-center justify-center py-16">
        <p className="text-text-muted font-normal" style={{ fontSize: '14px' }}>No se encontraron categorías.</p>
      </div>
    );
  }

  // Renderizado recursivo de nodos (Desktop: Table Rows / Mobile: Cards)
  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedIds.has(node.item.id);
    const hasChildren = node.children.length > 0;
    const isInactive = !!node.item.deleted_at;

    return (
      <div key={node.item.id} className="w-full flex flex-col">
        {/* Fila del nodo */}
        <div
          onClick={() => onRowClick(node.item)}
          className={`group flex items-center justify-between px-6 py-4 hover:bg-[#252636]/50 transition-colors duration-150 cursor-pointer ${isInactive ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${Math.max(1.5, node.depth * 2.5)}rem` }}
        >
          {/* Lado izquierdo: Nombre y Flecha */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Flecha de expansión (ocupa espacio aunque esté oculta para mantener alineación) */}
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(e, node.item.id)}
                  className="p-1 rounded hover:bg-surface-2/80 text-text-muted hover:text-text transition-colors"
                  aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <div className="w-1 h-1 rounded-full bg-border" /> // Viñeta simple para nodos hoja
              )}
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-surface-2 border border-border flex items-center justify-center shrink-0">
                {node.item.imagen_url ? (
                  <img 
                    src={node.item.imagen_url} 
                    alt={node.item.nombre} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center text-text-muted/30">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-normal text-[14px] text-text truncate">
                  {node.item.nombre}
                </span>
                {node.item.descripcion && (
                  <span className="text-xs text-text-muted truncate sm:hidden mt-0.5">
                    {node.item.descripcion}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Columnas adicionales visibles solo en Desktop */}
          <div className="hidden sm:flex items-center flex-1 min-w-0 px-4">
            <span className="text-[14px] font-normal text-text-muted truncate">
              {node.item.descripcion || '-'}
            </span>
          </div>

          {/* Lado derecho: Estado */}
          <div className="shrink-0 flex items-center justify-end w-24">
            <StatusBadge variant={node.item.deleted_at ? 'inactivo' : 'activo'} />
          </div>
        </div>

        {/* Renderizado de hijos si está expandido */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col relative before:absolute before:left-[1.8rem] before:top-0 before:bottom-0 before:w-px before:bg-border">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header de la tabla */}
      <div className="hidden sm:flex items-center border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-widest">
        <div className="flex-1 px-6 py-4">Nombre de Categoría</div>
        <div className="flex-1 px-6 py-4">Descripción</div>
        <div className="w-24 px-6 py-4 text-right">Estado</div>
      </div>

      {/* Cuerpo del Árbol */}
      <div className="flex flex-col divide-y divide-border">
        {tree.map(renderNode)}
      </div>
    </div>
  );
};

export default CategoriaTreeView;
