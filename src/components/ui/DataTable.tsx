import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type ColumnDef,
} from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  rowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Contenedor de la Tabla */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-2 text-text-muted font-semibold text-xs uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`hover:bg-surface-2/40 transition-colors group ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName ? rowClassName(row.original) : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-text">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <p className="text-text-muted text-base">No hay registros disponibles en este momento.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación Minimalista Premium */}
      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <span className="text-sm font-medium text-text-muted">
            Página <span className="text-primary">{table.getState().pagination.pageIndex + 1}</span> de{' '}
            {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-border bg-surface-2 text-text hover:bg-surface hover:border-primary/50 disabled:opacity-30 disabled:hover:border-border disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-border bg-surface-2 text-text hover:bg-surface hover:border-primary/50 disabled:opacity-30 disabled:hover:border-border disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
