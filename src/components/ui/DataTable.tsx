import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  rowClassName?: (row: TData) => string;
  itemLabel?: string;
}

/**
 * DataTable
 * ═══════════════════════════════════════════════════
 * Estilos según la imagen:
 * - Tarjeta: `bg-surface` (#1D1E2C), borde sutil.
 * - Header: Fondo transparente o igual a la tarjeta, texto en mayúsculas 
 *   pequeño (`text-[11px] uppercase tracking-wider text-text-muted`).
 * - Filas: Hover sutil, bordes separadores tenues (`border-[#2A2B3D]`).
 * - Paginación: Texto a la izquierda ("Mostrando..."), flechas a la derecha,
 *   sin estar encerradas en un "pill" (sin fondo ni borde alrededor).
 * ═══════════════════════════════════════════════════
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  rowClassName,
  itemLabel = 'registros',
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total    = data.length;
  const firstRow = total === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow  = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden flex flex-col">

      {/* ── Tabla ────────────────────────────────────────────────── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">

          {/* ENCABEZADO */}
          <thead className="border-b border-border">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-6 py-4 text-[11px] font-semibold text-text-muted uppercase tracking-widest whitespace-nowrap"
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`hover:bg-[#252636]/50 transition-colors duration-150 group ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName ? rowClassName(row.original) : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-[14px] font-normal text-text">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <p className="text-sm text-text-muted">
                    No hay registros disponibles.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ───────────────────────────────────────────── */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-border mt-auto">
          
          <span className="text-[13px] text-text-muted font-normal">
            Mostrando {firstRow}-{lastRow} de {total} {itemLabel}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
